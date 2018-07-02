import { convertFromRaw, convertToRaw } from 'draft-js'

export const getSnapshots = (draft, limit) => {
  const rawContentStates = draft
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

export const saveSnapshot = async (draft, snapshot) => {
  const hash = await draft.add({
    contentState: JSON.stringify(convertToRaw(snapshot))
  })
  return hash
}
