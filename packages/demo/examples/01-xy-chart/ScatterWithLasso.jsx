/* eslint react/no-array-index-key: 0, class-methods-use-this: 0 */
import React from 'react';
import PropTypes from 'prop-types';

import { genRandomNormalPoints } from '@vx/mock-data';

import {
  XYChart,
  PointSeries,
  XAxis as XYChartXAxis,
  YAxis as XYChartYAxis,
  theme,
  withParentSize,
  Lasso,
} from '@data-ui/xy-chart';


const n = 50;
const datasetColors = theme.colors.categories;

export const pointData = genRandomNormalPoints(n).map(([x, y]) => ({
  x,
  y,
  size: Math.max(3, Math.random() * 10),
}));

const marginScatter = { top: 10, right: 10, bottom: 64, left: 64 };

function isInside(point, vs) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i, i += 1) {
    const xi = vs[i].x;
    const yi = vs[i].y;
    const xj = vs[j].x;
    const yj = vs[j].y;

    const intersect = ((yi > y) !== (yj > y))
       && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}


function renderTooltip({ datum }) { // eslint-disable-line react/prop-types
  const { x, y, fill: color } = datum;
  return (
    <div>
      <div>
        <strong style={{ color }}>x </strong>
        {x.toFixed(2)}
      </div>
      <div>
        <strong style={{ color }}>y </strong>
        {y.toFixed(2)}
      </div>
    </div>
  );
}

const propTypes = {
  parentWidth: PropTypes.number.isRequired,
};

const defaultProps = {
  parentWidth: null,
};

class ScatterWithHistogram extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showVoronoi: false,
      selectedPoints: new Set(),
    };
    this.updateSelectedPoints = this.updateSelectedPoints.bind(this);
  }

  updateSelectedPoints({ polygon }) {
    this.setState((state) => {
      let needUpdate = false;
      const previousSelectedPoints = new Set(state.selectedPoints);
      const selectedPoints = pointData.filter(point => isInside(point, polygon));
      for (let i = 0 ; i < selectedPoints.length; i +=1) {
        if (previousSelectedPoints.has(selectedPoints[i])) {
          previousSelectedPoints.delete(selectedPoints[i]);
        } else {
          needUpdate = true;
          break;
        }
      }
      if (previousSelectedPoints.size !== 0) {
        needUpdate = true;
      }

      if (needUpdate) {
        console.log('need update');
        return {
          selectedPoints: new Set(selectedPoints),
        };
      }
      return state;
    });
  }

  render() {
    console.log("rendered!");
    const { selectedPoints } = this.state;
    const { parentWidth } = this.props;
    const size = Math.floor(parentWidth * 0.6);
    const scatterSize = Math.floor(size * 0.8);
    return (
      <div style={{ transform: 'rotate(90)' }}>
        <XYChart
          ariaLabel="X- and y- values"
          width={scatterSize}
          height={scatterSize}
          xScale={{ type: 'linear' }}
          yScale={{ type: 'linear' }}
          margin={marginScatter}
          theme={theme}
          renderTooltip={renderTooltip}
        >
          <PointSeries
            data={pointData}
            fill={d => (selectedPoints.has(d) ? '#000' : datasetColors[0])}
            opacity={0.7}
            size={5}
          />
          <XYChartXAxis label="x value" />
          <XYChartYAxis label="y value" orientation="left" />
          <Lasso onDragMove={this.updateSelectedPoints} />
        </XYChart>
      </div>
    );
  }
}

ScatterWithHistogram.propTypes = propTypes;
ScatterWithHistogram.defaultProps = defaultProps;

export default withParentSize(ScatterWithHistogram);
