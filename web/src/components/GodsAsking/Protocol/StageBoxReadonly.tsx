// web/src/components/GodsAsking/Protocol/StageBoxReadonly.tsx
import React from 'react'
import { Stage, Layer, Group, Rect, Text, Line } from 'react-konva'
import {
  PROTOCOL_CANVAS_WIDTH,
  PROTOCOL_CANVAS_HEIGHT,
  TILE_SIZE,
} from 'src/constants/protocolCanvas'

const StageBoxReadonly = ({ symbols = [], links = [] }) => (
  <Stage
    width={PROTOCOL_CANVAS_WIDTH}
    height={PROTOCOL_CANVAS_HEIGHT}
    style={{ border: '2px solid #f4ce73', background: 'white' }}
  >
    <Layer>
      {links.map((link) => (
        <Line
          key={link.id}
          points={link.points.flatMap((p) => [p.x, p.y])}
          stroke={'blue'}
          strokeWidth={2}
          tension={0}
        />
      ))}
      {symbols.map((item) => (
        <Group key={item.instanceId || item.id} x={item.x} y={item.y}>
          <Rect
            width={32}
            height={32}
            fill={item.isRune ? '#bae6fd' : '#fef08a'}
            cornerRadius={16}
          />
          <Text
            text={item.symbol}
            fontSize={24}
            align="center"
            verticalAlign="middle"
            width={TILE_SIZE}
            height={TILE_SIZE}
            fill="#000"
            rotation={item.rotation || 0}
            offsetX={TILE_SIZE / 2}
            offsetY={TILE_SIZE / 2}
            x={TILE_SIZE / 2}
            y={TILE_SIZE / 2}
          />
        </Group>
      ))}
    </Layer>
  </Stage>
)

export default StageBoxReadonly
