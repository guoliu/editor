import React from 'react'
import { Redirect } from 'react-router-dom'
import { convertToRaw } from 'draft-js'
import { createEditorState } from 'medium-draft'

class NewDraft extends React.Component {
  state = { draft: null }

  async componentDidMount() {
    // create store for a new draft
    const draft = await window.orbitdb.eventlog('test', {
      write: ['*']
    })

    // add empty content state to store
    await draft.add({
      contentState: JSON.stringify(convertToRaw(createEditorState().getCurrentContent()))
    })
    await draft.close()

    this.setState({ draft })
  }

  render() {
    const { draft } = this.state
    return draft ? <Redirect to={`/draft${draft.address}`} push /> : <div>starting draft</div>
  }
}

export default NewDraft
