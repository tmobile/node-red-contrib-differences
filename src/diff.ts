/**
 * A tuple that can represent any javascript object property
 */
type AnyPropertyTuple = [string, any];

interface AnyObject {
  [key: string]: any;
}

/**
 * Returns the list of of items the `desired` array contains that is NOT in the `owned` array. Equality determined by value-based
 * (not object/reference based) comparisons.
 *
 * @export
 * @template T
 * @param {T[]} desired - The list of desired items
 * @param {T[]} owned - The list of owned items
 * @returns {T[]} - Items in `desired` but not in `owned`
 */
export function complement<T>(desired: T, owned: T): Partial<T> {
  function complementOfArrays(desired: any[], owned: any[]): Partial<T> {
    const ownCache = owned.map((own) => JSON.stringify(own));
    return (desired.filter((desire) => {
      const ownIndex = ownCache.findIndex(
        (own) => own === JSON.stringify(desire)
      );
      return ownIndex === -1 || !ownCache.splice(ownIndex, 1);
    }) as unknown) as T;
  }

  function complementOfTuples(
    desired: AnyPropertyTuple[],
    owned: AnyPropertyTuple[]
  ): Partial<T> {
    const ownCache = owned.map((own) => JSON.stringify(own));
    return desired.reduce((prev: AnyObject, desire) => {
      const ownIndex = ownCache.findIndex(
        (own) => own === JSON.stringify(desire)
      );
      if (ownIndex === -1) prev[desire[0]] = desire[1];
      else ownCache.splice(ownIndex, 1);
      return prev;
    }, {}) as T;
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

  function unionOfScalars(left: any, right: any){
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
