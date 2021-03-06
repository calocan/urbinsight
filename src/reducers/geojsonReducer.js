/**
 * Created by Andy Likuski on 2017.04.27
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import * as R from 'ramda';
import {combineReducers} from 'redux';
import {mapDefaultAndPrefixOthers} from 'rescape-ramda';
import locations, {locationActions, locationActionCreators} from './locationReducer'
import openStreetMaps, {openStreetMapActions, openStreetMapActionCreators} from './openStreetMapReducer';
import searches, {searchesActions, searchesActionCreators} from './searchReducer'

module.exports.actions = R.mergeAll([locationActions, openStreetMapActions, searchesActions]);
module.exports.actionCreators = R.mergeAll([locationActionCreators, openStreetMapActionCreators, searchesActionCreators]);

/**
 @typedef Geojson
 @type {Object}
 @property {[Number]} bounds A four element array representing the bounds [min lon, min lat, max lon, max lat]
 @property {geojson} osm OpenStreetMap geojson data
 @property {geojson} locations Point data representing locations in geojson format
*/

/**
 * A reducer for reducing geojson
 */
module.exports.default = combineReducers({
  osm: openStreetMaps,
  locations: locations,
  searches: searches
});

