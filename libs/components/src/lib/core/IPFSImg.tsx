import React, { FC } from 'react'

export const IPFSImg: FC<{ uri?: string; alt?: string }> = ({ uri, alt }) => {
  if (!uri) return null
  const url = uri.startsWith('ipfs://') ? `https://cloudflare-ipfs.com/ipfs/${uri.slice(7)}` : uri
  return <img src={url} alt={alt as string} />
}
