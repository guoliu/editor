import React, { Component } from 'react'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import IPFS from 'ipfs'
import Home from './home'
import Article from './article'

const rootHash = 'QmanRgUyZfWaFWvtCKqB9kdb3YEoxvWuGDKjEeJHcDNAkU'

class App extends Component {
  state = { ready: false, ipfs: null }

  componentWillMount() {
    const ipfs = new IPFS()
    ipfs.on('error', errorObject => console.error(errorObject))

    ipfs.on('ready', () => {
      console.log('ipfs ready')
      this.setState({ ready: true, ipfs })
    })
  }

  render() {
    const { ready, ipfs } = this.state
    return ready ? (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route
            path="/article/:articleURL"
            render={({ match }) => <Article rootHash={rootHash} ipfs={ipfs} articleURL={match.params.articleURL} />}
          />
        </div>
      </Router>
    ) : (
      <div>loading</div>
    )
  }
}

export default App
