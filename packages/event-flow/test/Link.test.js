import React from 'react';
import { shallow } from 'enzyme';
import { Bar } from '@vx/shape';
import Link from '../src/components/Link';

describe('<Link />', () => {
  const props = {
    source: {
      id: 'source',
      depth: 0,
      parent: null,
      children: null,
    },
    target: {
      id: 'target',
      depth: 0,
      parent: null,
      children: null,
    },
    x: 15,
    y: 10,
    width: 100,
    height: 100,
    fill: 'orange',
  };

  test('it should be defined', () => {
    expect(Link).toBeDefined();
  });

  test('It should render a Bar', () => {
    const wrapper = shallow(<Link {...props} />);
    expect(wrapper.find(Bar).length).toBe(1);
  });

  test('It should set a data-source and -target attributes', () => {
    const wrapper = shallow(<Link {...props} />);
    expect(wrapper.find('g').length).toBe(1);
    expect(wrapper.find('g').props()['data-source']).toBe(props.source.id);
    expect(wrapper.find('g').props()['data-target']).toBe(props.target.id);
  });

  test('It should pass x, y, width, height, and fill props to the Bar', () => {
    const wrapper = shallow(<Link {...props} />);
    const bar = wrapper.find(Bar);
    const barProps = bar.props();

    expect(barProps.width).toBe(props.width);
    expect(barProps.height).toBe(props.height);
    expect(barProps.x).toBe(props.x);
    expect(barProps.y).toBe(props.y);
    expect(barProps.fill).toBe(props.fill);
  });

  test('It should not pass negative width or heights', () => {
    const wrapper = shallow(<Link {...props} width={-10} height={-10} />);
    const bar = wrapper.find(Bar);
    const barProps = bar.props();

    expect(barProps.width).toBeGreaterThan(0);
    expect(barProps.height).toBeGreaterThan(0);
  });
});
