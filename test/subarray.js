const assert = require("chai").assert;
const subarray = require("../jaque").subarray;

let inputs = [
  [],
  [1],
  [2, 1],
  [1, 2], // subarray === array
  [1, 2, 3, 1, 2], // subarray starts at 0
  [2, 3, 2, 3, 4], // subarray ends at n-1
  [3, 4, 3, 4, 5, 3, 4], // subarray starts and ends within array
  [4, 5, 4, 5, 6, 4, 5, 6, 7], // subarray ends at n-1
  [3, 4, 1, 2] // multiple subarrays of the same length
];

let expected = [
  [],
  [],
  [],
  [1, 2],
  [1, 2, 3],
  [2, 3, 4],
  [3, 4, 5],
  [4, 5, 6, 7],
  [1, 2]
];

let results = inputs.map(e => subarray(e));
let doubleCall = results.map(e => subarray(e));

describe("Subarray", () => {
  it("should return an array", () => {
    results.map(e => assert.isArray(e));
  });

  it("should have at most the length of the original array", () => {
    for (let i = 0; i < results.length; i++) {
      assert.isAtMost(results[i].length, inputs[i].length);
    }
  });

  it("should find the correct subarray", () => {
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
