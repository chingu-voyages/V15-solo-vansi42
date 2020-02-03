function scrambleArray(arr) {
  let mixedBoard = [],
    tries = 3;

  for (let i = 0; i < arr.length; i++) {
    tries = 3;
    let rand = Math.floor(Math.random() * arr.length);
    while (typeof mixedBoard[rand] !== undefined && tries > 0) {
      rand = Math.floor(Math.random() * arr.length);
      tries--;
    }
    while (typeof mixedBoard[rand] !== "undefined") {
      rand++;
      if (rand >= arr.length) {
        rand = 0;
      }
    }

    mixedBoard[rand] = arr[i];
  }
  return mixedBoard;
}

export { scrambleArray };
