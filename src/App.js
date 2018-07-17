import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import IPFS from 'ipfs'
import OrbitDB from 'orbit-db'
// import Home from './home'
import Editor from './editor'
import CreateDraft from './createDraft'

const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        // Use IPFS dev signal server
        // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
        // Use local signal server
        // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
      ]
    }
  }
}
class App extends Component {
  state = { ready: false }

  componentWillMount() {
    const ipfs = new IPFS(ipfsOptions)
    ipfs.on('error', errorObject => console.error(errorObject))

    ipfs.on('ready', () => {
      console.log('ipfs ready')
      window.orbitdb = new OrbitDB(ipfs)
      window.ipfs = ipfs
      this.setState({ ready: true })
    })
  }

  render() {
    const { ready } = this.state
    return ready ? (
      <Switch>
        <Route exact path="/" render={() => <CreateDraft />} />
        <Route exact path="/draft" render={() => <CreateDraft />} />
        <Route
          path="/draft/:draftAddress*"
          render={({ match }) => <Editor draftAddress={match.params.draftAddress} />}
        />
      </Switch>
    ) : (
      <div>loading...</div>
    )
  }
}

export default App
