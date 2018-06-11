import React from 'react'
import { ImageSideButton, Block, addNewBlock, createEditorState, Editor } from 'medium-draft'
import 'medium-draft/lib/index.css'
// import 'font-awesome/css/font-awesome.min.css'
import styles from './styles'
import 'isomorphic-fetch'

class CustomImageSideButton extends ImageSideButton {
  onChange(e) {
    const { setEditorState } = this.props
    const file = e.target.files[0]

    const reader = new FileReader()
    reader.onload = e => {
      setEditorState(
        addNewBlock(this.props.getEditorState(), Block.IMAGE, {
          src: e.target.result
        })
      )
    }

    reader.readAsDataURL(file)
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
      editorState: createEditorState() // createEditorState(data) with content
    }

    this.onChange = editorState => {
      this.setState({ editorState })
    }
  }

  componentDidMount() {
    this.refs.editor.focus()
  }

  render() {
    const { editorState } = this.state
    return (
      <div style={styles.draftContainer}>
        <div style={styles.draft}>
          <Editor ref="editor" editorState={editorState} onChange={this.onChange} sideButtons={this.sideButtons} />
        </div>
      </div>
    )
  }
}

export default DraftEditor
