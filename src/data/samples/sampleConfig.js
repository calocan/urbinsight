/**
 * Created by Andy Likuski on 2017.03.28
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import * as R from 'ramda';
import {globalSampleConfig} from './global-sample/globalSampleConfig';
import {oaklandSampleConfig} from './oakland-sample/oaklandSampleConfig';
import {parisSampleConfig} from './paris-sample/parisSampleConfig';
import {mergeDeepAll} from 'rescape-ramda';
import {defaultConfig} from 'data/default/defaultConfig';
import {firstUserLens} from 'data/configHelpers';

// Merge the global and regional sampleConfigs
export const sampleConfig = mergeDeepAll([
  {
    // Any settings that aren't Region specific.
    styles: defaultConfig.styles,
    // Any browser settings that would normally be set externally by the browser
    browser: {
      width: 1080,
      height: 720
    }
  },
  globalSampleConfig,
  // Oakland Region
  // Make the first user active
  R.over(
    firstUserLens(oaklandSampleConfig),
    R.merge({isActive: true}),
    oaklandSampleConfig
  ),
  // Paris Region
  parisSampleConfig
]);
