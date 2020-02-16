// scrambleArray(arr):
// return a new array with all of arr's elements in a shuffled order.
function scrambleArray(arr) {
  let mixedArray = [],
    tries = 3;

  for (let i = 0; i < arr.length; i++) {
    tries = 3;
    let rand = Math.floor(Math.random() * arr.length);
    while (typeof mixedArray[rand] !== undefined && tries > 0) {
      rand = Math.floor(Math.random() * arr.length);
      tries--;
    }
    while (typeof mixedArray[rand] !== "undefined") {
      rand++;
      if (rand >= arr.length) {
        rand = 0;
      }
    }
    mixedArray[rand] = arr[i];
  }
  return mixedArray;
}

function isFlower(t) {
  return ["MUM", "BAMBOO", "ORCHID", "PLUM"].includes(t);
}

function isSeason(t) {
  return ["AUTUMN", "WINTER", "SPRING", "SUMMER"].includes(t);
}

// compArray(a1, a2):
// a1 and a2 are arrays.
// returns true if a1 == a2.
function compArray(a1, a2) {
  if (
    (a1 === null && a2 !== null) ||
    (a1 !== null && a2 === null) ||
    a1.length !== a2.length
  ) {
    return false;
  }
  let same = true,
    i = 0;
  while (same && i < a1.length) {
    if (a1[i] !== a2[i]) {
      same = false;
    }
    i++;
  }
  return same;
}

export { scrambleArray, isFlower, isSeason, compArray };
