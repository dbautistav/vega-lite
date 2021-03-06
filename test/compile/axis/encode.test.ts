/* tslint:disable:quotemark */

import {assert} from 'chai';

import {parseUnitModel, parseModel} from '../../util';
import * as encode from '../../../src/compile/axis/encode';


describe('compile/axis', () => {
  describe('encode.labels()', function () {
    it('should show truncated labels by default', function () {
      const labels = encode.labels(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "ordinal"}
          }
        }), 'x', {}, {orient: 'top'});
      assert.deepEqual(labels.text.signal, 'truncate(datum.value, 25)');
    });

    it('should rotate label', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "month"}
        }
      });
      const labels = encode.labels(model, 'x', {}, {});
      assert.equal(labels.angle.value, 270);
    });

    it('should also rotate labels if the channel is column', function() {
      const model = parseModel({
        mark: "point",
        encoding: {
          column: {field: "a", type: "temporal", timeUnit: "month", axis: {labelAngle: 270}}
        }
      });
      const labels = encode.labels(model, 'column', {}, {});
      assert.equal(labels.angle.value, 270);
    });

    it('should have correct text.signal for quarter timeUnits', function () {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "quarter"}
        }
      });
      const labels = encode.labels(model, 'x', {}, {});
      let expected = "'Q' + quarter(datum.value)";
      assert.equal(labels.text.signal, expected);
    });

    it('should have correct text.signal for yearquartermonth timeUnits', function () {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "yearquartermonth"}
        }
      });
      const labels = encode.labels(model, 'x', {}, {});
      let expected = "'Q' + quarter(datum.value) + ' ' + timeFormat(datum.value, '%b %Y')";
      assert.equal(labels.text.signal, expected);
    });
  });
});
