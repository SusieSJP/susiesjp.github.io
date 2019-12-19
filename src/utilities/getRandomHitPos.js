const getRandomHitPos = (visited) => {
  let notSuccess = true;
  const visitedPos = new Set(visited);
  let row;
  let col;
  while (notSuccess) {
    row = Math.floor(Math.random() * 10);
    col = Math.floor(Math.random() * 10);
    if (!visitedPos.has(`grid-1-${row}-${col}`)) {
      notSuccess = false;
    };
  };
  return `grid-1-${row}-${col}`;

};

export default getRandomHitPos;
