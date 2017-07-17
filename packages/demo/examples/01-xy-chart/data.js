import mockData from '@vx/mock-data';
import { theme } from '@data-ui/xy-chart';

const { cityTemperature, appleStock, genRandomNormalPoints, letterFrequency } = mockData;

export const timeSeriesData = appleStock.filter((d, i) => i % 120 === 0).map(d => ({
  x: new Date(d.date),
  y: d.close,
}));

export const categoricalData = letterFrequency.map(d => ({ x: d.letter, y: d.frequency }));

// stacked data
export const groupKeys = Object.keys(cityTemperature[0]).filter(attr => attr !== 'date');
export const stackedData = cityTemperature.slice(0, 12).map(d => ({
  ...d,
  x: d.date,
  y: groupKeys.reduce((ret, curr) => ret + Number(d[curr]), 0),
}));

export const groupedData = stackedData.slice(0, 6).map(d => ({
  ...d,
  y: Math.max(...groupKeys.map(attr => Number(d[attr]))),
}));

// point data
const n = 10;
export const pointData = genRandomNormalPoints(n).map(([x, y], i) => ({
  x,
  y,
  fill: theme.colors.categories[Math.floor(i / n)],
  size: Math.max(3, Math.random() * 10),
  label: (i % n) === 0 ? `(${parseInt(x, 10)},${parseInt(y, 10)})` : null,
}));


export const BoxPlotData = (number) => {
  const data = [];
  let i;
  for (i = 0; i < number; i += 1) {
    const points = [];
    let j;
    for (j = 0; j < 5; j += 1) {
      points.push(Math.random() * 100);
    }
    points.sort((a, b) => (a - b));
    data.push({
      x: `Statistics ${i}`,
      min: points[0],
      firstQuartile: points[1],
      median: points[2],
      thirdQuartile: points[3],
      max: points[4],
    });
  }
  return data;
};

// interval data
const intervals = [[5, 8], [15, 19]];

export const intervalLineData = cityTemperature.slice(0, 25).map((d, i) => ({
  ...d,
  x: d.date,
  y: intervals.some(([i0, i1]) => i >= i0 && i <= i1) ? null : d[groupKeys[0]],
}));

export const intervalData = intervals.reduce((ret, [i0, i1]) => {
  ret.push({
    x0: cityTemperature[i0].date,
    x1: cityTemperature[i1].date,
  });
  return ret;
}, []);
