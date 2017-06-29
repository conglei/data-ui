import React from 'react';
import PropTypes from 'prop-types';

import { Group } from '@vx/group';
import { GlyphBoxPlot } from '@vx/glyph/';

import { callOrValue, isDefined } from '../utils/chartUtils';
import { colors } from '../theme';
import { boxPlotSeriesDataShape } from '../utils/propShapes';

const propTypes = {
  data: boxPlotSeriesDataShape.isRequired,
  label: PropTypes.string.isRequired,

  // attributes on data points will override these
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  // likely be injected by the parent chart
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

const defaultProps = {
  boxWidth: null,
  stroke: '#000000',
  strokeWidth: 2,
  fill: colors.default,
  xScale: null,
  yScale: null,
};

const MAX_BOX_WIDTH = 50;
const x = d => d.x;
const min = d => d.min;
const max = d => d.max;
const median = d => d.median;
const firstQuartile = d => d.firstQuartile;
const thirdQuartile = d => d.thirdQuartile;

export default function BoxPlotSeries({
  data,
  label,
  fill,
  stroke,
  strokeWidth,
  xScale,
  yScale,
}) {
  if (!xScale || !yScale) return null;

  const boxWidth = xScale.bandwidth();
  const actualyWidth = Math.min(MAX_BOX_WIDTH, boxWidth);
  const offset = (xScale.offset || 0) - ((boxWidth - actualyWidth) / 2);

  return (
    <Group key={label}>
      {data.map((d, i) => (
        isDefined(min(d)) && (
          <GlyphBoxPlot
            min={yScale(min(d))}
            max={yScale(max(d))}
            left={xScale(x(d)) - offset}
            firstQuartile={yScale(firstQuartile(d))}
            thirdQuartile={yScale(thirdQuartile(d))}
            median={yScale(median(d))}
            boxWidth={actualyWidth}
            fill={d.fill || callOrValue(fill, d, i)}
            stroke={d.stroke || callOrValue(stroke, d, i)}
            strokeWidth={d.strokeWidth || callOrValue(strokeWidth, d, i)}
          />
        )
      ))
    }
    </Group>
  );
}

BoxPlotSeries.propTypes = propTypes;
BoxPlotSeries.defaultProps = defaultProps;
BoxPlotSeries.displayName = 'BoxPlotSeries';
