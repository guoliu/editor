import React from 'react'
import { Redirect } from 'react-router-dom'
import { convertToRaw } from 'draft-js'
import { P5Wrapper } from '../components'
import { threeBody } from '../components/sketches'
import { createEditorState } from 'medium-draft'

console.log({ P5Wrapper })

class NewDraft extends React.Component {
  state = { draft: null }

  async componentDidMount() {
    // create store for a new draft, named by timestamp
    const draftId = btoa(Date.now())
    const draft = await window.orbitdb.eventlog(draftId, {
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
    return draft ? <Redirect to={`/draft${draft.address}`} push /> : <P5Wrapper sketch={threeBody} rotation={60} />
  }
}

export default NewDraft
