const getValidCellGroup = (curCellId, len, curCellIdx, direction) => {

    const boardNo = curCellId.substring(5,6);
    const row = curCellId.substring(7,8);
    const col= curCellId.substring(9);

    // construct cell group array and validate by "fill"
    let cellGroup = [];
    for (let i=0; i < len; i++) {
      if (direction === "horizontal") {
        if (col - curCellIdx + i < 0 || col - curCellIdx + i >= 10 || row < 0 || row >= 10) {
          break;
        };
        var cellId = `grid-${boardNo}-${row}-${col - curCellIdx + i}`;
      } else if (direction === "vertical") {
        if (row - curCellIdx + i < 0 || row - curCellIdx + i >= 10 || col <0 || col >= 10) {
          break;
        };
        var cellId = `grid-${boardNo}-${row - curCellIdx + i}-${col}`;
      };

      let cell = document.getElementById(cellId);
      if (cell.className === "fill") {
        break;
      } else {
        cellGroup.push(cellId);
      };
  };
  return cellGroup;
}

export default getValidCellGroup;
