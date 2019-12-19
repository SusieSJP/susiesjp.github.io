const getRotatedCellGroup = (direction, len, curIdx, curCellId) => {
  const curCellBoard = curCellId.substring(5,6);
  const curCellRow = curCellId.substring(7,8);
  const curCellCol = curCellId.substring(9);

  let rotatedGroup = [];
  for (let i=0; i < len; i++) {
    if (direction === "horizontal") {
      var cellId = `grid-${curCellBoard}-${curCellRow-curIdx+i}-${curCellCol}`;
    } else if (direction === "vertical") {
      var cellId = `grid-${curCellBoard}-${curCellRow}-${curCellCol-curIdx+i}`;
    };

    rotatedGroup.push(cellId);
  };

  return rotatedGroup;
};

export default getRotatedCellGroup;
