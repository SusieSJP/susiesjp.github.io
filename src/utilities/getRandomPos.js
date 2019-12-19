const getRandomPos = (boardNo) => {
  let posTaken = new Set();
  const ships_size = {'carrier': 5, 'battleship': 4, 'submarine': 3, 'destroyer':2, 'cruiser':1};
  let ship_location = {};
  let location_ship = {};

  Object.entries(ships_size).forEach(([ship, size]) => {
    let notSuccess = true;
    while (notSuccess) {
      const startCellRow = Math.floor(Math.random() * 10);
      const startCellCol = Math.floor(Math.random() * 10);
      let cells = [];
      // check for the boundary
      if (startCellCol+size-1 < 10) {
        // try horizontal
        for (let i = 0; i < size; i++) {
          let cellId = `grid-${boardNo}-${startCellRow}-${startCellCol + i}`;
          if (posTaken.has(cellId)) {
            cells = [];
            break;
          } else {
            cells.push(cellId);
          };
        };
      };

      if (cells.length ===0 && startCellRow+size-1 < 10) {
        // try vertical
        for (let i = 0; i < size; i++) {
          let cellId = `grid-${boardNo}-${startCellRow + i}-${startCellCol}`;
          if (posTaken.has(cellId)) {
            cells = [];
            break;
          } else {
            cells.push(cellId);
          }
        };
      };

      if (cells.length === size) {
        cells.forEach(posTaken.add, posTaken);
        ship_location[ship] = [];
        for (let c of cells) {
          ship_location[ship].push(c);
          location_ship[c] = ship;
        }
        notSuccess = false;
      }
    };
  });

  return {
    ship_location,
    location_ship
  };
};

export default getRandomPos;
