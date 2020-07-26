import * as util from '../util'

import chai = require('chai');
let assert = chai.assert;

describe('Util', function () {
  it('StringBuffer', function () {
    const sb = new util.StringBuffer("this is a test string");
    assert.equal(21, sb.length())
    assert.equal("this", sb.substring(0, 4));    

    sb.setCharAt(2, "a");
    sb.setCharAt(3, "t");
    assert.equal("that", sb.substring(0, 4));
    assert.equal("that is a test string", sb.toString());
  });
});
