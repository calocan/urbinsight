/**
 * Created by Andy Likuski on 2017.10.17
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {createSelector} from 'reselect';
import * as R from 'ramda';
import {geojsonByType} from 'helpers/geojsonHelpers';
import {mergeDeep, throwing} from 'rescape-ramda';

const {reqPath} = throwing;

/**
 * Resolves the openstreetmap features of a region and categorizes them by type (way, node, relation).
 * Equality is currently based on the length of the features, but we should be able to do this
 * simply by reference equality (why would the features reference change?)
 * @param {Object} state Should be the region with the
 */
export const makeFeaturesByTypeSelector = () => (state, {region}) => createSelector(
  [
    (state, {region}) => R.view(R.lensPath(['geojson', 'osm']), region)
  ],
  geojsonByType
)(state, {region});

/**
 * Resolves the marker features of a region and categorizes them by type (way, node, relation)
 * @returns {Function} Selector that expects a state and props containing region
 */
export const makeMarkersByTypeSelector = () => (state, {region}) => createSelector(
  [
    (state, {region}) => R.view(R.lensPath(['geojson', 'markers']), region)
  ],
  geojsonByType
)(state, {region});

/**
 * Selector for the geojson of a region that merges in derived data structures
 * @param {Object} State The redux state
 * @param {Object} Region The Region that is the parent of the geojson
 * @returns {Function} Selector that expects a state and props containing region
 */
export const makeGeojsonSelector = () => (state, {region}) => createSelector(
  [
    makeFeaturesByTypeSelector(),
    makeMarkersByTypeSelector()
  ],
  (featuresByType, locationsByType) =>
    mergeDeep(
      reqPath(['geojson'], region),
      {
        geojson: {
          osm: {
            featuresByType,
            locationsByType
          }
        }
      })
)(state, {region});

export const sankeyGraphSelector = (_, {store, user, region}) => {
  const graph = reqPath(['region', 'geojson', 'sankey', 'graph'], store);
  const userRegion = R.find(R.eqProps('id', region), user.regions);
  const selectedSankeyNodeCategories = R.defaultTo(
    {},
    R.view(R.lensPath(['geojson', 'sankey', 'selected']),
      userRegion
    )
  );

  return R.length(R.keys(selectedSankeyNodeCategories)) ?
    R.over(
      R.lensProp('nodes'),
      nodes => R.map(node => R.merge(
        node,
        {
          isVisible: R.or(
            // Not there
            R.compose(R.isNil, R.prop(node.material))(selectedSankeyNodeCategories),
            // There and true
            R.prop(node.material, selectedSankeyNodeCategories)
          )
        }
      ), nodes || []),
      graph
    ) : graph;
};