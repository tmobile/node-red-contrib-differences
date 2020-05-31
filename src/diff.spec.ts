import { complement, union } from "./diff";
import { expect } from "chai";

describe("The diff module", () => {
  describe("Given two sets of values with equivalent and distinct values...", () => {
    describe("AND the sets are arrays", () => {
      const left = ["a", "b", "b", { c: 3 }, 4, { d: 5 }, [1, 2, 3], [4, 5, 6]];
      const right = ["a", "b", { c: 2 }, 4, [1, 2, 3]];

      describe("When complement() is called, it...", () => {
        const complementResult = complement(left, right);
        it("Returns the set of 'missing' values (the complement)", () => {
          expect(complementResult).to.deep.equal([
            "b",
            { c: 3 },
            { d: 5 },
            [4, 5, 6],
          ]);
        });
      });

      describe("When union() is called, it...", () => {
        const unionResult = union(left, right);
        it("Combines the arrays based on equivalence", () => {
          expect(unionResult).to.deep.equal([
            4,
            "a",
            "b",
            "b",
            { c: 3 },
            { d: 5 },
            [1, 2, 3],
            [4, 5, 6],
            { c: 2 },
          ]); // TODO: Order shouldn't matter
        });
      });
    });

    describe("AND the sets are objects", () => {
      const left = { a: 1, b: 2, c: ["c", "c", "c"], num: 4 };
      const right = { a: 1, b: 1, c: ["c", "c"], num: 4 };

      describe("When complement() is called, it...", () => {
        const complementResult = complement(left, right);
        it("Returns the set of 'missing' values (the complement)", () => {
          expect(complementResult).to.deep.equal({ b: 2, c: ["c", "c", "c"] });
        });
      });

      describe("When union() is called", () => {
        const unionResult = union(left, right);
        it("Combines the arrays", () => {
          expect(unionResult).to.deep.equal({
            a: 1,
            b: [2, 1],
            c: ["c", "c", "c"],
            num: 4
          });
        });
      });
    });

    describe("AND the sets are strings", () => {
      const left = "desired";
      const right = "owned";

      describe("When complement() is called", () => {
        const complementResult = complement(left, right);

        it("Returns the 'desired' value", () => {
          expect(complementResult).to.deep.equal(["desired"]);
        });
      });

      describe("When union() is called, it...", () => {
        const unionResult = union(left, right);
        it("Returns both values", () => {
          expect(unionResult).to.deep.equal(["desired", "owned"]);
        });
      });
    });
  });

  describe("Given two sets of values that are equivelent", () => {
    describe("AND the sets are strings", () => {
      const left = "left and right";
      const right = "left and right";

      describe("When complement() is calledm it...", () => {
        const complementResult = complement(left, right);

        it("Returns an empty array", () => {
          expect(complementResult).to.deep.equal([]);
        });
      });

      describe("When union() is called, it...", () => {
        const unionResult = union(left, right);
        it("Returns the equivalent value of either", () => {
          expect(unionResult).to.deep.equal("left and right");
        });
      });
    });
  });
});

// Missing Item Detector Node
//  Left Input: desiredInventory
//  Right Input: actualInventory
//

//
//   Left, Right
//   union (everything), intersection (shared items), complement[left|right] (only in one set),

/*



{ name: "widget", quantity: 1 },

// Calculator Node
//  Left Input: desiredInventory
//  Right Input: actualInventory
//  InputType: Array of [scalar | object] 
//     (if object, compare props)
//  Operation: Subtract (multiply, etc...)


["b", "c"] = { b: 1, c:1}
["b", "c", "c"] 
----
[ "c" ]


aaaabbbb vs. aaabb => abb => b:2, a:1

// Missing Item Detector Node
//  Left Input: desiredInventory
//  Right Input: actualInventory
//  


// 
//   Left, Right
//   union (everything), intersection (shared items), complement[left|right] (only in one set), 

*/
