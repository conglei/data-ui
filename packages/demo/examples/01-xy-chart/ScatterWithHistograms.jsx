/* eslint react/no-array-index-key: 0, class-methods-use-this: 0 */
import React from 'react';
import PropTypes from 'prop-types';

import { genRandomNormalPoints } from '@vx/mock-data';

import {
  XYChart,
  PointSeries,
  XAxis as XYChartXAxis,
  YAxis as XYChartYAxis,
  CrossHair,
  theme,
  withParentSize,
  Lasso,
} from '@data-ui/xy-chart';

import {
  Histogram,
  DensitySeries,
  YAxis as HistYAxis,
} from '@data-ui/histogram';

import Checkbox from '../shared/Checkbox';

const BIN_COUNT = 50;
const n = 50;
const datasets = [];
const datasetColors = theme.colors.categories;

export const pointData = genRandomNormalPoints(n).forEach(([x, y], i) => {
  const dataSetIndex = Math.floor(i / n);
  if (!datasets[dataSetIndex]) datasets[dataSetIndex] = [];

  datasets[dataSetIndex].push({
    x: dataSetIndex !== 1 ? x + Math.random() : x,
    y: dataSetIndex === 1 ? y - Math.random() : y,
    // fill: theme.colors.categories[dataSetIndex],
    size: Math.max(3, Math.random() * 10),
  });
});

const marginScatter = { top: 10, right: 10, bottom: 64, left: 64 };
const marginTopHist = { top: 10, right: marginScatter.right, bottom: 5, left: marginScatter.left };
const marginSideHist = { top: 10, right: marginScatter.bottom, bottom: 5, left: marginScatter.top };

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
    const selectedPoints = datasets[0].filter(point => isInside(point, polygon));
    this.setState(() => ({
      selectedPoints: new Set(selectedPoints),
    }));
  }

  renderScatter({ width, height }) {
    const { selectedPoints } = this.state;

    return (
      <div style={{ transform: 'rotate(90)' }}>
        <XYChart
          ariaLabel="X- and y- values"
          width={width}
          height={height}
          xScale={{ type: 'linear' }}
          yScale={{ type: 'linear' }}
          margin={marginScatter}
          theme={theme}
          renderTooltip={renderTooltip}
        >
          {datasets.map((dataset, i) => (
            <PointSeries
              key={i}
              data={dataset}
              fill={d => (selectedPoints.has(d) ? '#000' : datasetColors[i])}
              opacity={0.7}
              size={5}
            />
          ))}
          <XYChartXAxis label="x value" />
          <XYChartYAxis label="y value" orientation="left" />
          <Lasso onDragMove={this.updateSelectedPoints} />
        </XYChart>
      </div>
    );
  }

  renderRightHistogram({ width, height }) {
    return (
      <div style={{ transform: 'rotate(90deg)', display: 'flex', alignItems: 'flex-end' }}>
        <Histogram
          width={width}
          height={height}
          valueAccessor={d => -d.y}
          ariaLabel="y counts"
          binCount={BIN_COUNT}
          margin={marginSideHist}
          theme={theme}
        >
          {datasets.map((dataset, i) => (
            <DensitySeries
              key={i}
              label={i}
              rawData={dataset}
              fill={datasetColors[i]}
              fillOpacity={0.5}
              stroke={datasetColors[i]}
            />
          ))}
          <HistYAxis
            orientation="right"
            label="y counts"
            labelProps={{
              ...theme.yAxisStyles.label.right,
              transform: `translate(${height / 1.75}, ${height})rotate(270)`,
            }}
          />
        </Histogram>
      </div>
    );
  }

  renderTopHistogram({ width, height }) {
    return (
      <div style={{ transform: 'rotate(90)' }}>
        <Histogram
          width={width}
          height={height}
          ariaLabel="x values"
          valueAccessor={d => d.x}
          binCount={BIN_COUNT}
          margin={marginTopHist}
          theme={theme}
        >
          {datasets.map((dataset, i) => (
            <DensitySeries
              key={i}
              label={i}
              rawData={dataset}
              fill={datasetColors[i]}
              fillOpacity={0.5}
              stroke={datasetColors[i]}
            />
          ))}
          <HistYAxis label="x counts" />
        </Histogram>
      </div>
    );
  }

  render() {
    const { showVoronoi } = this.state;
    const { parentWidth } = this.props;
    const size = Math.floor(parentWidth * 0.6);
    const scatterSize = Math.floor(size * 0.8);
    const histSize = size - scatterSize;

    return parentWidth && parentWidth > 100 ? (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {this.renderTopHistogram({ width: scatterSize, height: histSize })}
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {this.renderScatter({ width: scatterSize, height: scatterSize })}
            {this.renderRightHistogram({ width: scatterSize, height: histSize })}
          </div>
        </div>
        <Checkbox
          id="scatter_hist"
          label="Show Voronoi overlay"
          checked={showVoronoi}
          onChange={() => { this.setState({ showVoronoi: !showVoronoi }); }}
        />
      </div>
    ) : null;
  }
}

ScatterWithHistogram.propTypes = propTypes;
ScatterWithHistogram.defaultProps = defaultProps;

export default withParentSize(ScatterWithHistogram);
