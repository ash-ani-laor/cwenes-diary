/*
 * web/src/components/Protocol/StageLinks.tsx
 */
import React from 'react'

import { Line } from 'react-konva'

import { useProtocolStore } from 'src/stores/protocolStore'

const StageLinks = () => {
  const { links } = useProtocolStore()

  return (
    <>
      {links.map((link) => (
        <Line
          key={link.id}
          points={link.points.flatMap((p) => [p.x, p.y])}
          stroke="blue"
          strokeWidth={2}
          tension={0.5}
        />
      ))}
    </>
  )
}

export default StageLinks
