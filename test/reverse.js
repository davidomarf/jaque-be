const assert = require("chai").assert;
const reverse = require("../jaque").reverse;

let inputs = [
  "",
  " ",
  "ł",
  "ie",
  "abc",
  "abcd",
  "poqiwd",
  "90u8zsfklnhc",
  "æß→ð↓@@]·"
];

let expected = [
  "",
  " ",
  "ł",
  "ei",
  "cba",
  "dcba",
  "dwiqop",
  "chnlkfsz8u09",
  "·]@@↓ð→ßæ"
];

let results = inputs.map(e => reverse(e));

describe("Reverse", () => {
  it("should return a string", () => {
    results.map(e => assert.isString(e));
  });

  it("should return a string with the same length", () => {
    for (let i = 0; i < inputs.length; i++) {
      assert.equal(results[i].length, inputs[i].length);
    }
  });

  it("should reverse strings", () => {
    for (let i = 0; i < results.length; i++) {
      assert.equal(expected[i], results[i]);
    }
  });

  it("should be the same string if you reverse the reversed string", () => {
    let resultsReversed = results.map(e => reverse(e));
    for (let i = 0; i < resultsReversed.length; i++) {
      assert.equal(inputs[i], resultsReversed[i]);
    }
  });
});
