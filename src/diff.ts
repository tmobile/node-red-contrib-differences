/**
 * Returns the list of of items the `desired` array contains that is NOT in the `owned` array.
 *
 * @export
 * @template T
 * @param {T[]} desired - The list of desired items
 * @param {T[]} owned - The list of owned items
 * @returns {T[]} - Items in `desired` but not in `owned`
 */
export function complement<T>(desired: T, owned: T): Partial<T> {
  function complementArray(desired: any[], owned: any[]): T {
    const ownCache = owned.map((own: any) => JSON.stringify(own));
    return (desired.filter((desire) => {
      const ownIndex = ownCache.findIndex(
        (own) => own === JSON.stringify(desire)
      );
      return ownIndex === -1 || !ownCache.splice(ownIndex, 1);
    }) as unknown) as T;
  }

  function complementTuple(
    desired: [string, any][],
    owned: [string, any][]
  ): T {
    const ownCache = owned.map((own: any) => JSON.stringify(own));
    const result: any = {};
    for (const desire of desired) {
      const ownIndex = ownCache.findIndex(
        (own) => own === JSON.stringify(desire)
      );
      if (ownIndex === -1) {
        ownCache.splice(ownIndex, 1);
        result[desire[0]] = desire[1];
      }
    }
    return result;
  }

  return Array.isArray(desired) && Array.isArray(owned)
    ? complementArray(desired, owned)
    : desired === Object(desired) && owned === Object(owned)
    ? complementTuple(
        Object.entries(desired) as [string, any],
        Object.entries(owned) as [string, any]
      )
    : complementArray([desired], [owned]);
}

export function union(left: any, right: any) {
  function counts(list: any[]) {
    const result: { [key: string]: number } = {};
    for (const item of list) {
      const key = JSON.stringify(item);
      result[key] = result[key] ? result[key] + 1 : 1;
    }
    return result;
  }

  function unionArray(listA: any[], listB: any[]) {
    console.log("*** unionArray ***", { listA, listB });
    const countsA = counts(listA);
    const countsB = counts(listB);
    const keys = new Set([...Object.keys(countsA), ...Object.keys(countsB)]);

    console.log("a - countsA", countsA);
    console.log("a - countsB", countsB);
    console.log("a - keys", keys);

    const result: any[] = [];

    keys.forEach((key) => {
      const value = JSON.parse(key);
      if ((countsA[key] || 0) > (countsB[key] || 0)) {
        for (let i = 0; i < countsA[key]; i++) {
          result.push(value);
        }
      } else {
        for (let i = 0; i < countsB[key]; i++) {
          result.push(value);
        }
      }
    });

    console.log("a - result", result);

    return result;
  }

  function unionTuple(listA: [string, any][], listB: [string, any][]) {
    console.log("*** unionTuple ***", { listA, listB });
    const keys = new Set([
      ...listA.map((a) => a[0]),
      ...listB.map((b) => b[0]),
    ]);

    console.log("t - keys", keys);

    const result: any = {};

    keys.forEach((key) => {
      const propA = listA.find((a) => a[0] === key) || [];
      const propB = listB.find((b) => b[0] === key) || [];
      const [, valueA] = propA;
      const [, valueB] = propB;
      const ua = unionArray(propA, propB);
      let filtered = false;
      const valueU = ua.filter((prop) => {
        const isPropKey = prop === key;
        const result = filtered || !isPropKey;
        filtered = filtered || isPropKey;
        return result;
      });
      

      result[key] =
        Array.isArray(valueA) && Array.isArray(valueB)
          ? unionArray(valueA, valueB)
          : Array.isArray(valueA) || Array.isArray(valueB)
          ? valueU
          : valueU.length === 1
          ? valueU[0]
          : valueU;
      console.log("t - valueU", valueU);
      console.log("t - a", propA);
      console.log("t - b", propB);
      console.log(`t - result[${key}]`, result[key]);
    });

    return result;
  }

  return Array.isArray(left) && Array.isArray(right)
    ? unionArray(left, right)
    : left === Object(left) && right === Object(right)
    ? unionTuple(
        Object.entries(left) as [string, any],
        Object.entries(right) as [string, any]
      )
    : unionArray([left], [right]);
}
