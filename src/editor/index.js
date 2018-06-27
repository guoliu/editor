import React from 'react'
import { ImageSideButton, Block, addNewBlock, Editor } from 'medium-draft'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import 'medium-draft/lib/index.css'
import styles from './styles'
import 'isomorphic-fetch'

class CustomImageSideButton extends ImageSideButton {
  onChange(upload) {
    const { setEditorState } = this.props
    const reader = new FileReader()
    reader.onload = e => {
      setEditorState(
        addNewBlock(this.props.getEditorState(), Block.IMAGE, {
          src: e.target.result
        })
      )
    }
    Object.values(upload.target.files).map(file => reader.readAsDataURL(file))
    this.props.close()
  }
}

class DraftEditor extends React.Component {
  constructor(props) {
    super(props)

    this.sideButtons = [
      {
        title: 'Image',
        component: CustomImageSideButton
      }
    ]

    this.state = {
      editorState: null
    }

    this.onChange = editorState => {
      this.setState({ editorState })
    }
  }

  saveVersion = async () => {
    const { draft } = this.state
    try {
      await draft.add({
        contentState: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()))
      })
    } catch (err) {
      console.error('error while saving draft version', err)
    }
  }

  onKeyDown = e => {
    if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && e.keyCode === 83) {
      e.preventDefault()
      this.saveVersion()
      return true
    }
    return false
  }

  async componentDidMount() {
    // load database
    const { draftAddress } = this.props
    const draft = await window.orbitdb.eventlog(`/${draftAddress}`)
    await draft.load()

    // get content state and initiate editor state
    const rawContentState = draft
      .iterator({ limit: 1 })
      .collect()
      .map(e => e.payload.value.contentState)[0]
    let content
    try {
      content = JSON.parse(rawContentState)
    } catch (err) {
      console.error({ err, rawContentState })
    }

    this.setState({ draft, editorState: EditorState.createWithContent(convertFromRaw(content)) }, () =>
      this.refs.editor.focus()
    )
  }

  render() {
    const { editorState } = this.state
    return (
      <div style={styles.draftContainer}>
        <div style={styles.draft} onKeyDown={this.onKeyDown}>
          {editorState ? (
            <Editor ref="editor" editorState={editorState} onChange={this.onChange} sideButtons={this.sideButtons} />
          ) : (
            <div ref="editor">{'initiating'}</div>
          )}
        </div>
      </div>
    )
  }
}

export default DraftEditor
