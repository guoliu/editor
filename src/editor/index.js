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
  sideButtons = [
    {
      title: 'Image',
      component: CustomImageSideButton
    }
  ]

  state = {
    editorState: null
  }

  onChange = editorState => {
    this.setState({ editorState })
  }

  getSnapshots = limit => {
    const rawContentStates = this.state.draft
      .iterator({ limit })
      .collect()
      .map(e => e.payload.value.contentState)

    const snapshots = rawContentStates.map(rawContentState => {
      let content
      try {
        content = JSON.parse(rawContentState)
      } catch (err) {
        console.error({ err, rawContentState })
      }
      return convertFromRaw(content)
    })

    return snapshots
  }

  saveSnapshot = async () => {
    const hash = await this.state.draft.add({
      contentState: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()))
    })
    console.log('save')
    return hash
  }

  onKeyDown = e => {
    if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && e.keyCode === 83) {
      e.preventDefault()
      this.saveSnapshot()
      return true
    }
    return false
  }

  async componentDidMount() {
    // load database
    const { draftAddress } = this.props
    const draft = await window.orbitdb.eventlog(`/${draftAddress}`)
    this.setState({ draft })
    await draft.load()
    draft.events.on('replicated', () => {
      console.log('replicated')
      const content = this.getSnapshots(1)[0]
      this.setState({
        editorState: EditorState.createWithContent(content)
      })
    })

    // get content state and initiate editor state
    const content = this.getSnapshots(1)[0]
    this.setState({ editorState: EditorState.createWithContent(content) }, () => this.refs.editor.focus())
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
