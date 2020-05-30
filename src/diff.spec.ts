import { complement, union } from "./diff";
import { expect } from "chai";

describe("The diff module", () => {
  describe("complement() function", () => {
    describe("Given an array of 'desired' values and an array of 'owned' values containing only some of the 'desired' values", () => {
      const desired = ["a", "a", "b", { c: 3 }, 4, { d: 5 }],
        owned = ["a", 1, "b", { c: 3 }];

      describe("When diff() is called", () => {
        const complementResult = complement(desired, owned);

        it("Returns the complement (what's in the desired but not the owned)", () => {
          expect(complementResult).to.deep.equal(["a", 4, { d: 5 }]);
        });
      });
    });

    describe("Given an object of 'desired' values and an object of 'owned' values containing only some of the 'desired' values", () => {
      const desired = { a: 1, b: 2, c: 3 };
      const owned = { a: 1, b: 2, c: 1 };

      describe("When diff() is called", () => {
        const complementResult = complement(desired, owned);

        it("Returns the complement (what's in the desired but not the owned)", () => {
          expect(complementResult).to.deep.equal({ c: 3 });
        });
      });
    });

    describe("Given a class-constructed of 'desired' values and an object of 'owned' values containing only some of the 'desired' values", () => {
      class DesiredObjects {
        a = 1;
        b = 2;
        c = 3;
      }

      const desired = new DesiredObjects();
      const owned = { a: 1, b: 2, c: 1 };

      describe("When diff() is called", () => {
        const complementResult = complement(desired, owned);

        it("Returns the complement (what's in the desired but not the owned)", () => {
          expect(complementResult).to.deep.equal({ c: 3 });
        });
      });
    });

    describe("Given a 'desired' string and a different 'owned' string", () => {
      const desired = "desired";
      const owned = "owned";

      describe("When diff() is called", () => {
        const complementResult = complement(desired, owned);

        it("Returns the 'desired' value", () => {
          expect(complementResult).to.deep.equal(["desired"]);
        });
      });
    });

    describe("Given a 'desired' string and an equal 'owned' string", () => {
      const desired = "desired and owned";
      const owned = "desired and owned";

      describe("When diff() is called", () => {
        const complementResult = complement(desired, owned);

        it("Returns an empty array", () => {
          expect(complementResult).to.deep.equal([]);
        });
      });
    });
  });

  describe("union() function", () => {
    describe("Given a two arrays with some overlapping values", () => {
      const a1 = ["a", { b: "b" }, { b: "b" }, "c", "c", "c", "d"];
      const a2 = ["a", { b: "b" }, { b: "b" }, "c", "e"];
      describe("When union() is called", () => {
        const unionResult = union(a1, a2);
        it("Combines the arrays", () => {
          expect(unionResult).to.deep.equal([
            "a",
            { b: "b" },
            { b: "b" },
            "c",
            "c",
            "c",
            "d",
            "e",
          ]);
        });
      });
    });

    describe("Given a two objects with some overlapping values", () => {
      const o1 = { a: 1, b: { b: "b" }, c: ["c", "d"], d: "d", f:["do", "ra", "me"] };
      const o2 = { a: 1, b: { b: "b" }, c: ["c"], d: "e", f: [1,2,3] };
      describe("When union() is called", () => {
        const unionResult = union(o1, o2);
        it("Combines the arrays", () => {
          expect(unionResult).to.deep.equal({
            a: 1,
            b: { b: "b" },
            c: ["c", "d"],
            d: ["d", "e"],
            f: ["do", "ra", "me", 1, 2, 3]
          });
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
