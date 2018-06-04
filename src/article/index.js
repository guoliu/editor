import React from 'react'
//${articleURL}/article.md
const Article = ({ articleURL, rootHash, ipfs }) => {
  ipfs.ls(rootHash, (err, files) => {
    files.forEach(file => {
      console.log(file.path)
    })
  })

  ipfs.files.get('QmanRgUyZfWaFWvtCKqB9kdb3YEoxvWuGDKjEeJHcDNAkU', (err, files) => {
    console.log({ err, files })
  })

  ipfs.files.get('/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/wiki', (err, files) => {
    console.log({ err, files })
  })
  return <div>hello</div>
}

export default Article
