import React from 'react';
import {shallow} from 'enzyme';
import {reqPathThrowing} from 'rescape-ramda'
import {mapStateToProps} from './MarkerListContainer';
import {geojsonByType} from 'helpers/geojsonHelpers';

import {sampleConfig} from 'data/samples/sampleConfig';
import initialState from 'data/initialState'
import * as R from 'ramda';
import MarkerList from './MarkerList'
jest.mock('query-overpass');
const state = initialState(config);
const currentKey = reqPath(['regions', 'currentKey'], state);
import geojson from 'queryOverpassResponse'
const e = React.createElement;

const props = mapStateToProps(state, {
    region: R.set(
        R.lensProp('geojson'),
        geojsonByType(geojson.LA_SAMPLE),
        reqPath(['regions', currentKey], state)
    )
});

describe('MarkerList', () => {
    it('MarkerList can mount', () => {
        const wrapper = shallow(e(MarkerList, props));
        expect(wrapper).toMatchSnapshot();
    });
});

/*
TODO I don't know how to test this
 */
/*
it('MapGL call onLoad when provided', () => {
    const onLoad = jest.fn();

    const props = {onLoad, ...defaultProps};
    mount(<MapGL {...props} />);
    expect(onLoad).toBeCalledWith();
});
*/
