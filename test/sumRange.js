const assert = require("chai").assert;
const sumRange = require("../jaque").sumRange;

let inputs = [
  [2, 5],
  [4, 8],
  [0, 25], 
  [5, 10] // The result of sumRange(n, m) is the same as sumRange(0, m) - sumRange(0, n-1)
];

let expected = [14, 30, 325, sumRange(0, 10) - sumRange(0, 4)];

let results = inputs.map(e => sumRange(e[0], e[1]));
let inverseCall = inputs.map(e => sumRange(e[1], e[0]));

describe("Sum of range", () => {
  it("should find the correct result", () => {
    for (let i = 0; i < results.length; i++) {
      assert.equal(results[i], expected[i]);
    }
  });

  it("should swap values if m < n", () => {
    for (let i = 0; i < inverseCall.length; i++) {
      assert.equal(inverseCall[i], expected[i]);
    }
  });
});
