const assert = require("chai").assert;
const removeDuplicates = require("../jaque").removeDuplicates;

let inputs = [
  [],
  [1],
  [1, 2], // no duplicates
  [2, 2, 3, 3, 3, 4], // one duplicate at middle
  [4, 4, 5, 5, 6, 6], // many duplicates: beginning, middle, end
  [1, 1, 1, 1, 1, 1, 1, 1, 1], // only duplicates
  [1, 2, 3, 4, 5, 6, 7, 8, 9] // no duplicates
];

let expected = [
  [],
  [1],
  [1, 2],
  [2, 3, 4],
  [4, 5, 6],
  [1],
  [1, 2, 3, 4, 5, 6, 7, 8, 9]
];

let results = inputs.map(e => removeDuplicates(e));
let doubleCall = results.map(e => removeDuplicates(e));

describe("Duplicates", () => {
  it("should return an array", () => {
    results.map(e => assert.isArray(e));
  });

  it("should have at most the length of the original array", () => {
    for (let i = 0; i < results.length; i++) {
      assert.isAtMost(results[i].length, inputs[i].length);
    }
  });

  it("should remove duplicates", () => {
    for (let i = 0; i < results.length; i++) {
      assert.deepEqual(results[i], expected[i]);
    }
  });

  it("should return the same array when chained", () => {
    for (let i = 0; i < doubleCall.length; i++) {
      assert.deepEqual(doubleCall[i], results[i]);
    }
  });
});
