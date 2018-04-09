/**
 * Created by Andy Likuski on 2017.12.06
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {mapboxSelector, viewportSelector} from 'selectors/mapboxSelectors';
import {throwing} from 'rescape-ramda';
import * as R from 'ramda';

const {reqPath} = throwing;

describe('mapboxSelectors', () => {
  const oakland = {
    mapbox: {
      viewport: {
        zoom: 5
      }
    }
  };
  const paris = {
    mapbox: {
      viewport: {
        zoom: 4
      }
    }
  };
  const state = {
    regions: {oakland, paris},
    settings: {
      mapbox: {
        mapboxApiAccessToken: 'secret',
        viewport: {
          foo: 1
        }
      }
    }
  };

  test('mapboxSelector', () => {
    expect(mapboxSelector(state, {region: oakland})).toEqual(
      {
        mapboxApiAccessToken: 'secret',
        viewport: R.merge(
          {foo: 1},
          reqPath(['mapbox', 'viewport'], oakland))
      }
    );
  });

  test('viewportSelector', () => {
    expect(viewportSelector(state, {region: oakland})).toEqual(
      R.merge(
        {foo: 1},
        reqPath(['mapbox', 'viewport'], oakland))
    );
  });
});
