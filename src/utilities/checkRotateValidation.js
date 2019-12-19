const checkRotateValidation = (direction, len, curIdx, curCellId) => {
  const curCellBoard = curCellId.substring(5,6);
  const curCellRow = curCellId.substring(7,8);
  const curCellCol = curCellId.substring(9);

  if (direction === "horizontal") {
    // change to vertical from the point
    for (let i=0; i < len; i++) {
      const cellId = `grid-${curCellBoard}-${curCellRow-curIdx+i}-${curCellCol}`;
      const cell = document.getElementById(cellId);
      if (!cell || (cellId != curCellId && cell.className === "fill")) {
        // invalid rotation
        console.log('ho rotation fails because ',cellId);
        return false;
      };
    }
    return true;
    } else if (direction === "vertical") {
      for (let i=0; i < len; i++) {
        const cellId = `grid-${curCellBoard}-${curCellRow}-${curCellCol-curIdx+i}`;
        const cell = document.getElementById(cellId);
        if (!cell || (cellId != curCellId && cell.className === "fill")) {
          // invalid rotation
          console.log('vertical rotation fails because ',cellId);
          return false;
        };
      }
      return true;
    }

};

export default checkRotateValidation;
