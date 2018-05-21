import React from 'react';
import PropTypes from 'prop-types';
import { LinePath } from '@vx/shape';
import { Drag } from '@vx/drag';
import { curveBasisClose } from '@vx/curve';


class Lasso extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      polygon: [],
    };
  }

  render() {
    const { xScale, yScale, onDragMove, width, height, samplingDistance=10, margin } = this.props;
    const { polygon } = this.state;

    return ([
      <LinePath
        stroke="#000"
        strokeWidth={0}
        data={polygon}
        curve={curveBasisClose}
        x={d => d.x}
        y={d => d.y}
        xScale={xScale}
        yScale={yScale}
        fill="rgba(12,43,255, 0.1)"
      />,
      <Drag
        width={width}
        height={height}
        resetOnStart
        onDragStart={({ x, y }) => {
          const xConverted = xScale ? xScale.invert(x - margin.left) : x;
          const yConverted = yScale ? yScale.invert(y - margin.top) : y;
          const point = { x: xConverted, y: yConverted };
          this.setState(() => ({
            polygon: [point],
          }));
        }}
        onDragMove={({ x, y, dx, dy }) => {
          if ((dx * dx) + (dy * dy) > samplingDistance * samplingDistance) {
            const xConverted = xScale ? xScale.invert(x + dx - margin.left) : x + dx;
            const yConverted = yScale ? yScale.invert(y + dy - margin.top) : y + dy;
            this.setState((state) => {
              const point = { x: xConverted, y: yConverted };
              const nextData = state.polygon.concat(point);
              if (onDragMove) onDragMove({ polygon: nextData });
              return { polygon: nextData };
            });
          }
        }}
      >
        {({
          x,
          y,
          dx,
          dy,
          isDragging,
          dragStart,
          dragEnd,
          dragMove,
        }) => (
          <g>
            {isDragging && (
              <g>
                <rect
                  fill="rgba(0,0,0,0.5)"
                  width={8}
                  height={8}
                  x={x + dx - 4 - margin.left}
                  y={y + dy - 4 - margin.top}
                  style={{ pointerEvents: 'none' }}
                />
                <circle
                  cx={x - margin.left}
                  cy={y - margin.top}
                  r={4}
                  fill="rgba(0,0,0,0.5)"
                  stroke="white"
                  style={{ pointerEvents: 'none' }}
                />
              </g>
            )}
            <rect
              fill="transparent"
              width={width}
              height={height}
              onMouseDown={dragStart}
              onMouseUp={dragEnd}
              onMouseMove={dragMove}
              onTouchStart={dragStart}
              onTouchEnd={dragEnd}
              onTouchMove={dragMove}
            />
          </g>
        )
      }
      </Drag>,
    ]);
  }
}

export default Lasso;
