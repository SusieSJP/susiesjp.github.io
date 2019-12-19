import React from 'react';
import GameSetting from './GameSetting';
import PlaceShips from './PlaceShips';
import PlayGame from './PlayGame';

export default class BattleshipApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // 1. choose to battle with computer or friend, set names
      gameMode: '',
      playerName1: 'Player1',
      playerName2: 'Player2',
      isSettingCompleted: false,
      colsLabel: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      board1: Array(10).fill(0).map(x => Array(10).fill(0)),
      board2: Array(10).fill(0).map(x => Array(10).fill(0)),
      // 2. result of placing ships
      location_ship1: {},
      location_ship2: {},
      ship_location1: {},
      ship_location2: {},
      // put it in the top level states to handle corner case of droping somewhere outside the board
      droppedShip: false,
      isDragging: false,
      isGameOn: false
    };
    this.handleGameSetting = this.handleGameSetting.bind(this);
    this.handleRename = this.handleRename.bind(this);
    this.handleDropOut = this.handleDropOut.bind(this);
    this.startDragging = this.startDragging.bind(this);
    this.endDragging = this.endDragging.bind(this);
    this.setDroppedBack = this.setDroppedBack.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.setBoardData = this.setBoardData.bind(this);
    this.setGameOn = this.setGameOn.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
  }

  // game settings functions
  handleGameSetting(mode) {
    console.log('setting game mode');
    this.setState(() => ({
      gameMode: mode,
      playerName2: mode === "friend" ? 'Player2' : 'Computer'
    }));
  }

  handleRename(e) {
    console.log('Setting player names');
    e.preventDefault();  // prevent refreshing the page after submit the form
    const data = e.target.elements;
    if (data.playerName1.value) {
      this.setState(() => ({playerName1: data.playerName1.value}));
    };

    if (data.playerName2.value) {
      this.setState(() => ({playerName2: data.playerName2.value}));
    };

    this.setState(() => ({isSettingCompleted: true}))
  }

  // handle drop outside grid case
  setDroppedBack() {
    this.setState({droppedShip: false});
  }
  startDragging() {
    this.setState({isDragging: true});
  }
  endDragging() {
    this.setState({isDragging: false});
  }
  handleDragOver(event) {
    event.preventDefault(); // prevent default of dragOver to fire drop event
  }
  handleDropOut(event) {
    const dropElementId = event.target.id;
    if (this.state.isDragging && dropElementId.substring(0,4) != "grid") {
      console.log('drop out of grid');
      this.setState({droppedShip: true});
    };
  }

  // begin game
  setGameOn() {
    this.setState({isGameOn: true});
  }

  setBoardData(boardNo, ship_location, location_ship) {
    if (boardNo === 1) {
      this.setState(() => ({
        ship_location1: ship_location,
        location_ship1: location_ship
      }));
    } else {
      this.setState(() => ({
        ship_location2: ship_location,
        location_ship2: location_ship
      }));
    }
  }

  // restart game
  handleRestart() {
    this.setState({
      gameMode: '',
      playerName1: 'Player1',
      playerName2: 'Player2',
      isSettingCompleted: false,
      colsLabel: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      board1: Array(10).fill(0).map(x => Array(10).fill(0)),
      board2: Array(10).fill(0).map(x => Array(10).fill(0)),
      // 2. result of placing ships
      location_ship1: {},
      location_ship2: {},
      ship_location1: {},
      ship_location2: {},
      // put it in the top level states to handle corner case of droping somewhere outside the board
      droppedShip: false,
      isDragging: false,
      isGameOn: false
    });
  }

  render() {
    return (
      <div className='column-display' onDrop={this.handleDropOut} onDragOver={this.handleDragOver}>
        <div className='row-display--center'>
          <h1>Battleship Game</h1>
        </div>

        <GameSetting
          handleGameSetting={this.handleGameSetting}
          handleRename={this.handleRename}
          isSettingCompleted={this.state.isSettingCompleted}
          gameMode={this.state.gameMode}
          playerName1={this.state.playerName1}
          playerName2={this.state.playerName2}
        />
        {
          !this.state.isGameOn ?
          <div className={this.state.isSettingCompleted && !this.state.isGameOn? "" : "no-click"}>
            <PlaceShips
              gameMode={this.state.gameMode}
              board1={this.state.board1}
              board2={this.state.board2}
              playerName1={this.state.playerName1}
              playerName2={this.state.playerName2}
              colsLabel={this.state.colsLabel}
              setDroppedBack={this.setDroppedBack}
              startDragging={this.startDragging}
              endDragging={this.endDragging}
              setBoardData={this.setBoardData}
              setGameOn={this.setGameOn}
              droppedShip={this.state.droppedShip}
            />
          </div> :
          <PlayGame
            player1={this.state.playerName1}
            player2={this.state.playerName2}
            board1={this.state.board1}
            board2={this.state.board2}
            ship_location1={this.state.ship_location1}
            ship_location2={this.state.ship_location2}
            location_ship1={this.state.location_ship1}
            location_ship2={this.state.location_ship2}
            colsLabel={this.state.colsLabel}
            handleRestart={this.handleRestart}
            gameMode={this.state.gameMode}
          />
        }
        <div className="footer">
          <p className="grow-element">Made with <span className="heart">&#10084;</span> by Susie.</p>
        </div>

      </div>
    )
  };
};

// &hearts;
