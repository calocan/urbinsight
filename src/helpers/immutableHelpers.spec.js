/**
 * Created by Andy Likuski on 2017.02.26
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import ImMap from 'immutable';
import f from './immutableHelpers';
import Task from 'data.task';
import {immutableMemoize, memoizeCall, toImmutable, toSingleArgMemoize} from 'helpers/immutableHelpers';
import {taskToPromise} from 'rescape-ramda';
import moment from 'moment';
import WeakTupleMap from 'weaktuplemap';
import NamedTupleMap from 'namedtuplemap'
import * as R from 'ramda';
import memoize from 'memoize-immutable';

describe('immutablHelperFunctions', () => {
  test('Should be an Immutable Map', () => {
    expect(ImMap.isMap(f.toImmutable({foo: 1}))).toBeTruthy();
  });
  test('Should be a plain old javascript object', () => {
    expect(!ImMap.isMap(f.fromImmutable(f.toImmutable({foo: 1})))).toBeTruthy();
    expect(f.fromImmutable([f.toImmutable({foo: 1})])).toMatchSnapshot();
  });
  test('Should copy an object', (done) => {
    const obj = {a: {b: 1}};
    const copy = f.copy(obj);
    expect(obj).toEqual(copy);
    expect(obj).not.toBe(copy);
    expect(obj.a).toEqual(copy.a);
    expect(obj.a).not.toBe(copy.a);
  });
});
