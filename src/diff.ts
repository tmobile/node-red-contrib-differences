/**
 * A tuple that can represent any javascript object property
 */
type AnyPropertyTuple = [string, any];

/**
 * An object that can have any set of properties
 *
 * @interface AnyObject
 */
interface AnyObject {
  [key: string]: any;
}

/**
 * Returns the elements from `desired` that do NOT have equivalent entries in `owned`. Equality determined by value-based
 * (not object/reference based) comparisons.
 *
 * @export
 * @template T - Both arguments should share the same type, at least partially
 * @param {T[]} desired - An object or array that represents a set of desired values
 * @param {T[]} owned - An object or array that represents a set of owned values
 * @returns {T[]} - Items in `desired` but not in `owned`
 */
export function complement<T>(desired: T, owned: T): AnyObject {
  function complementOfArrays(desired: any[], owned: any[]) {
    const ownedCache = owned.map((own) => JSON.stringify(own));
    return desired.filter((desire) => {
      const ownIndex = ownedCache.findIndex(
        (own) => own === JSON.stringify(desire)
      );
      return ownIndex === -1 || !ownedCache.splice(ownIndex, 1); // Splice so not found twice
    });
  }

  function complementOfTuples(
    desired: AnyPropertyTuple[],
    owned: AnyPropertyTuple[]
  ) {
    const ownedCache = owned.map((own) => JSON.stringify(own));
    return desired.reduce((prev: AnyObject, desire) => {
      const ownedIndex = ownedCache.findIndex(
        (own) => own === JSON.stringify(desire)
      );
      if (ownedIndex === -1) prev[desire[0]] = desire[1];
      else ownedCache.splice(ownedIndex, 1);
      return prev;
    }, {});
  }

  return Array.isArray(desired) && Array.isArray(owned)
    ? complementOfArrays(desired, owned)
    : desired === Object(desired) && owned === Object(owned)
    ? complementOfTuples(
        Object.entries(desired) as AnyPropertyTuple,
        Object.entries(owned) as AnyPropertyTuple
      )
    : complementOfArrays([desired], [owned]);
}

/**
 * Returns the entries that exist equivalently in both the `left` and `right`.
 *
 * @export
 * @template T - Both arguments should share the same type, at least partially
 * @param {T} left - An object or array containing elements that may have equivalent values in right
 * @param {T} right - An object or array containing elements that may have equivalent values in left
 * @returns
 */
export function intersection<T>(left: T, right: T) {
  function intersectionOfArrays(left: any[], right: any[]) {
    const rightCache = right.map((r) => JSON.stringify(r));
    return left.filter((l) => {
      const rightIndex = rightCache.findIndex((r) => r === JSON.stringify(l));
      return rightIndex > -1 && rightCache.splice(rightIndex, 1);
    });
  }

  function intersectionOfTuples(
    left: AnyPropertyTuple[],
    right: AnyPropertyTuple[]
  ) {
    const rightCache = right.map((r) => JSON.stringify(r));
    return left.reduce((result: AnyObject, l) => {
      const rightIndex = rightCache.findIndex((r) => r === JSON.stringify(l));
      if (rightIndex > -1) {
        result[l[0]] = l[1];
        rightCache.splice(rightIndex, 1);
      }

      return result;
    }, {});
  }

  function intersectionOfScalars(left: any, right: any) {
    const result = intersectionOfArrays([left], [right]);
    return result.length === 1 ? result[0] : result; // Convert back to scalar if only one value
  }

  return Array.isArray(left) && Array.isArray(right)
    ? intersectionOfArrays(left, right)
    : left === Object(left) && right === Object(right)
    ? intersectionOfTuples(
        Object.entries(left) as AnyPropertyTuple,
        Object.entries(right) as AnyPropertyTuple
      )
    : intersectionOfScalars(left, right);
}

/**
 * Returns all the elements contained in either (or both) sets. Equality determined by value-based
 * (not object/reference based) comparisons.
 *
 * @export
 * @param {*} left - An object or array
 * @param {*} right - An object or array
 * @returns Items or properties contained in either (or both) sets
 */
export function union(left: any, right: any) {
  function counts(list: any[]) {
    const result: { [key: string]: number } = {};
    for (const item of list) {
      const key = JSON.stringify(item); // Use JSON as a hack for value-based comparison
      result[key] = result[key] ? result[key] + 1 : 1;
    }
    return result;
  }

  function unionOfArrays(left: any[], right: any[]) {
    const leftCounts = counts(left);
    const rightCounts = counts(right);
    const keys = new Set([
      ...Object.keys(leftCounts),
      ...Object.keys(rightCounts),
    ]);

    const result: any[] = [];
    keys.forEach((key) => {
      const value = JSON.parse(key);
      if ((leftCounts[key] || 0) > (rightCounts[key] || 0)) {
        // Left contains more equivalent values than right, therefore left contains the union
        for (let i = 0; i < leftCounts[key]; i++) {
          result.push(value);
        }
      } else {
        // Right contains same or more equivalent values from left, therefore right contains the union
        for (let i = 0; i < rightCounts[key]; i++) {
          result.push(value);
        }
      }
    });

    return result;
  }

  function unionOfTuples(left: AnyPropertyTuple[], right: AnyPropertyTuple[]) {
    const keys = new Set([...left.map((a) => a[0]), ...right.map((b) => b[0])]);

    const result: any = {};
    keys.forEach((key) => {
      const propA = left.find((a) => a[0] === key) || [];
      const propB = right.find((b) => b[0] === key) || [];

      const [, valueA] = propA;
      const [, valueB] = propB;

      const ua = unionOfArrays(propA, propB);

      let filtered = false;
      const valueU = ua.filter((prop) => {
        const isPropKey = prop === key;
        const result = filtered || !isPropKey;
        // Value could contain key, e.g [x, "x"], so only filter on first encounter
        filtered = filtered || isPropKey;
        return result;
      });

      result[key] =
        Array.isArray(valueA) && Array.isArray(valueB)
          ? // Union the property value arrays if both values are arrays
            unionOfArrays(valueA, valueB)
          : Array.isArray(valueA) || Array.isArray(valueB)
          ? // Preserve array values as array type if either is array
            valueU
          : valueU.length === 1
          ? // Preserve scalar values as scalar type
            valueU[0]
          : // Combine multiple scalar values into array
            valueU;
    });

    return result;
  }

  function unionOfScalars(left: any, right: any) {
    const result = unionOfArrays([left], [right]);
    return result.length === 1 ? result[0] : result;
  }

  return Array.isArray(left) && Array.isArray(right)
    ? unionOfArrays(left, right)
    : left === Object(left) && right === Object(right)
    ? unionOfTuples(
        Object.entries(left) as AnyPropertyTuple,
        Object.entries(right) as AnyPropertyTuple
      )
    : unionOfScalars(left, right);
}
