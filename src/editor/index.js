import React from 'react'
import { ImageSideButton, Block, addNewBlock, createEditorState, Editor } from 'medium-draft'
import 'medium-draft/lib/index.css'
import styles from './styles'
import 'isomorphic-fetch'

class CustomImageSideButton extends ImageSideButton {
  /*
  We will only check for first file and also whether
  it is an image or not.
  */
  onChange(e) {
    const file = e.target.files[0]
    if (file.type.indexOf('image/') === 0) {
      // This is a post request to server endpoint with image as `image`
      const formData = new FormData()
      formData.append('image', file)
      fetch('/your-server-endpoint', {
        method: 'POST',
        body: formData
      }).then(response => {
        if (response.status === 200) {
          // Assuming server responds with
          // `{ "url": "http://example-cdn.com/image.jpg"}`
          return response.json().then(data => {
            if (data.url) {
              this.props.setEditorState(
                addNewBlock(this.props.getEditorState(), Block.IMAGE, {
                  src: data.url
                })
              )
            }
          })
        }
      })
    }
    this.props.close()
  }
}

// Now pass this component instead of default prop to Editor example above.
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
      editorState: createEditorState() // for empty content
    }

    /*
    this.state = {
      editorState: createEditorState(data), // with content
    };
    */

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
