import React from 'react';
import Board from './Board';
import { getNewStateProperty } from '../utilities/getNewStateProperty';
import getRandomHitPos from '../utilities/getRandomHitPos';

export default class PlayGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ship_locations: [props.ship_location1, props.ship_location2],
      location_ships: [props.location_ship1, props.location_ship2],
      active: [false, true], // active board status
      remainingNum: [15,15],
      isMsgTime: false,
      ship_nums: [
        {'carrier': 5, 'battleship': 4, 'submarine': 3, 'destroyer':2, 'cruiser':1},
        {'carrier': 5, 'battleship': 4, 'submarine': 3, 'destroyer':2, 'cruiser':1}
      ],
      resultMsg: ['none','none'],
      markVisited: true,
      location_visited: [],
      players: [props.player1, props.player2],
      winner: ''
    };

    this.checkBoardStatus();
    this.handleMouseEvent = this.handleMouseEvent.bind(this);
    this.changeMarkSetting = this.changeMarkSetting.bind(this);
  };

  componentDidUpdate() {
    if (this.props.gameMode === "computer" && this.state.active[0] && !this.state.isMsgTime && !this.state.winner) {
      this.handleComputerTurn();
    }
  }

  checkBoardStatus() {
    if (this.props.gameMode === "computer") {
      console.log('no click on board1');
      console.log('from play game: ',this.props.player1);
      const board1 = document.getElementById(`${this.props.player1}-board`);
      board1.className += "no-click";
    };
  }

  changeMarkSetting() {
    this.setState((prevState) => ({markVisited: !prevState.markVisited}));
  }

  handleMouseEvent(event) {
    let clickBoardNo = +event.target.id.substring(5,6) - 1;
    if (event.type === "click" && this.state.active[clickBoardNo] && !this.state.isMsgTime) {
      this.setState({isMsgTime: true}); // prevent extra clicks on both boards
      const hitId = event.target.id;
      this.handleGame(clickBoardNo, hitId);
    };
  };

  handleComputerTurn() {
      const visited = this.state.markVisited ? this.state.location_visited : [];
      const computerHitId = getRandomHitPos(visited);
      this.setState({isMsgTime: true});
      this.handleGame(0, computerHitId);
  };

  handleGame(clickBoardNo, hitId) {
    const cell = document.getElementById(hitId)
    console.log('hit on board: ', hitId);
    // 1. check if it has been visited
    if (this.state.location_visited.includes(hitId)) {
      let newMsg = ['none','none'];
      if (this.state.markVisited) {
        cell.className = "disable-click";
      };
      newMsg[clickBoardNo] = 'Emmm...Already Taken!';
      this.setState({resultMsg: newMsg});
      setTimeout(() => {
        this.setState((prevState) => ({
          resultMsg: ['none','none'],
          active: [!prevState.active[0], !prevState.active[1]],
          isMsgTime: false
        }));
      }, 1500);
    } else if (hitId in this.state.location_ships[clickBoardNo]) {
      // 2. check if it is a hit, distinguish between hit and sunk
      const hitShipName = this.state.location_ships[clickBoardNo][hitId];
      let result = '';

      cell.className = "hit";
      if (this.state.markVisited) {
        cell.className += " disable-click";
      };
      if (this.state.remainingNum[clickBoardNo] === 1) {
        result = `Here you go!...Winner!`;
        const winner = clickBoardNo === 0 ? this.state.players[1] : this.state.players[0];
        this.setState({winner: winner});
        const board1 = document.getElementById(`${this.props.player1}-board`);
        const board2 = document.getElementById(`${this.props.player2}-board`);
        board1.className += " no-click";
        board2.className += " no-click";
      } else if (this.state.ship_nums[clickBoardNo][hitShipName] === 1) {
        result = `Congrats!...${hitShipName} Sunk!`;
      } else {
        result = 'Nice!...Hit the target!';
      };

      let newMsg = ['none','none'];
      newMsg[clickBoardNo] = result;
      this.setState((prevState) => {
        const newRemainingNum = prevState.remainingNum.map((num, idx) => {
          if (idx === clickBoardNo) {
            return num-1
          } else { return num }
        });
        const newShipNums = prevState.ship_nums.map((pairs, idx) => {
          if (idx === clickBoardNo) {
            const newNums = getNewStateProperty(pairs, hitShipName, pairs[hitShipName] - 1);
            return newNums;
          } else { return pairs};
        });
        return {
          resultMsg: newMsg,
          location_visited: prevState.location_visited.concat([hitId]),
          remainingNum: newRemainingNum,
          ship_nums: newShipNums
        }
      });
      setTimeout(() => {
        this.setState((prevState) => ({
          resultMsg: ['none','none'],
          active: [!prevState.active[0], !prevState.active[1]],
          isMsgTime: false
        }));
      }, 1500);
    } else {
      // 3. miss
      if (this.state.markVisited) {
        cell.className = "disable-click";
      };
      let newMsg = ['none','none'];
      newMsg[clickBoardNo] = 'Oops. Miss.';
      this.setState((prevState) => {
        console.log(hitId, prevState.location_visited.concat([hitId]));
        return{
          resultMsg: newMsg,
          location_visited: prevState.location_visited.concat([hitId])
        }
        });
      setTimeout(() => {
        this.setState((prevState) => ({
          resultMsg: ['none','none'],
          active: [!prevState.active[0], !prevState.active[1]],
          isMsgTime: false
        }));
      }, 1500);
    }
  };


  render() {
    return (
      <div className="column-display">
        <div className="row-display bg-boards">
          <div className="column-display">
            <p className={this.state.resultMsg[0] !== "none" ? "" : "hide"}>{this.state.resultMsg[0]}</p>
            <Board
              board={this.props.board1}
              boardNo={1}
              playerName={this.props.player1}
              colsLabel={this.props.colsLabel}
              handleMouseEvent={this.handleMouseEvent}
            />
            <span className={this.state.active[0] ? "active" : "inactive"}></span>
          </div>
          <div className="column-display">
            <p className={this.state.resultMsg[1] !== "none" ? "" : "hide"}>{this.state.resultMsg[1]}</p>
            <Board
              board={this.props.board2}
              boardNo={2}
              playerName={this.props.player2}
              colsLabel={this.props.colsLabel}
              handleMouseEvent={this.handleMouseEvent}
            />
            <span className={this.state.active[1] ? "active" : "inactive"}></span>
          </div>
        </div>
        <div className="bg-boards">
          <input type="checkbox" className="checkbox" id="markVisited" name="markVisited" checked={this.state.markVisited} onClick={this.changeMarkSetting} />
          <label className="checkbox-label" for="mark">Mark and disable click on visited positions.</label>
        </div>
        <div className="row-display bg-lightgrey">
          { !this.state.winner && <h3>{this.props.player1} has <span class="highlight">{this.state.remainingNum[1]}</span> to win.</h3>}
          { !this.state.winner && <h3>{this.props.player2} has <span class="highlight">{this.state.remainingNum[0]}</span> to win.</h3>}
        </div>
        <div className="column-display bg-lightgrey">
          <div className="row-display--center center-text">{ this.state.winner && <h3><span class="highlight">{this.state.winner}</span> Win!</h3> }</div>
          <div className="row-display--center"><button className="btn s-width" onClick={this.props.handleRestart}>Start A New Game</button></div>
        </div>
      </div>

    )
  }
}
