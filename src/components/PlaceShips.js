import React from 'react';
import Board from './Board';
import getValidCellGroup from '../utilities/getValidCellGroup';
import checkRotateValidation from '../utilities/checkRotateValidation';
import getRotatedCellGroup from '../utilities/getRotatedCellGroup';
import getRandomPos from '../utilities/getRandomPos';
import { getNewStateProperty, getNewStatePropertyDelete, addNewStatePropertyData } from '../utilities/getNewStateProperty';

export default class PlaceShips extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curBoard: props.board1,
      curBoardNo: 1,
      playerName: props.playerName1,
      ships_size: {'carrier': 5, 'battleship': 4, 'submarine': 3, 'destroyer':2, 'cruiser':1},
      shipClass: {'carrier': "ship-fill", 'battleship': "ship-fill", 'submarine': "ship-fill", 'destroyer':"ship-fill", 'cruiser':"ship-fill" },

      // drag and drop tracking states
      draggingElementName: '',
      dragIdx: null, // drag index (compare to the length)
      draggingElementLen: null,
      location_ships_dict: {},
      ships_location_dict: {},
      draggingGroup: [], // adjust position within grid as a whole
      isMoving: false, // moving within grid
      dropSuccess: 0,
      draggable: {'carrier': true, 'battleship': true, 'submarine': true, 'destroyer':true, 'cruiser':true },

      // rotate
      isHorizontal: {'carrier': true, 'battleship': true, 'submarine': true, 'destroyer':true, 'cruiser':true },

    };

    this.handleDragEvent = this.handleDragEvent.bind(this);
    this.handleMouseEvent = this.handleMouseEvent.bind(this);
    this.handleReady = this.handleReady.bind(this);
  }

  // update state when props changes!
  componentDidUpdate(prevProps) {
    const newProps = this.props;
    if (newProps.droppedShip) {
      console.log('update the shipclass because of drop outside')
      this.setState((prevState) => {
        const newShipClass = getNewStateProperty(prevState.shipClass, this.state.draggingElementName, "ship-fill");
        return {shipClass: newShipClass};
      });
      this.props.setDroppedBack();
    };

    if (newProps.playerName1 != prevProps.playerName1) {
      this.setState({playerName: newProps.playerName1});
    }
  };

  handleDragEvent(event) {
    const elementId = event.target.id;
    const element = document.getElementById(elementId);

    switch(event.type) {
      case 'dragstart':
        // 1. using absolution position to calculate dragging index
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        // 2. set the states about drag event
        this.setState({
          draggingElementName: elementId.substring(2),
          dragIdx: Math.floor(x / 21),
          draggingElementLen: this.state.ships_size[elementId.substring(2)],
        });
        this.props.startDragging();
        // 3. change the dragged element style from fill to empty
        setTimeout(() => {
          this.setState((prevState) => {
            const newShipClass = getNewStateProperty(prevState.shipClass, this.state.draggingElementName, "ship-empty");
            return {shipClass: newShipClass}});
          console.log('drag start with: ', elementId, ' dragging index is: ', this.state.dragIdx);
          })
        break;

      case 'dragenter':
        // get valid cell group to adjust style together
        const validEnterGroup = getValidCellGroup(elementId, this.state.draggingElementLen, this.state.dragIdx, "horizontal");
        if (validEnterGroup.length === this.state.draggingElementLen) {
          for (let cellId of validEnterGroup) {
            const cell = document.getElementById(cellId);
            setTimeout(() => cell.className = "hovered"); // enter style set after leave style
          }
        } else {
          console.log('drag enter invalid position')
        };
        break;

      case 'dragleave':
        // get valid cell group to adjust style together
        const validLeaveGroup = getValidCellGroup(elementId, this.state.draggingElementLen, this.state.dragIdx, "horizontal");
        if (validLeaveGroup.length === this.state.draggingElementLen) {
          // console.log('drag leave: ', elementId);
          for (let cellId of validLeaveGroup) {
            const cell = document.getElementById(cellId);
            cell.className = "";
          }
        } else {
          console.log('drag leave invalid position');
        };
        break;
      case 'dragover':
        event.preventDefault();
        break;
      case 'drop':
        // 1. check if the drop positions are valid
        const validDropGroup = getValidCellGroup(elementId, this.state.draggingElementLen, this.state.dragIdx, "horizontal");
        if (validDropGroup.length != this.state.draggingElementLen) {
          var dropFail = true;
        } else {
          var dropFail = false;
        };

        // 2. change the style based on validation result
        if (dropFail) {
          console.log('drop failed');
          this.setState((prevState) => {
            const newShipClass = getNewStateProperty(prevState.shipClass, this.state.draggingElementName, "ship-fill");
            return {
              draggingElementName: '',
              draggingElementLen: null,
              dragIdx: null,
              shipClass: newShipClass
            }
          });
        } else {
          console.log('drop success')
          for (let cellId of validDropGroup) {
            const cell = document.getElementById(cellId);
            cell.className = "fill";
          };
          this.setState((prevState) => {
            const newLocationShips = addNewStatePropertyData(prevState.location_ships_dict, validDropGroup, this.state.draggingElementName);
            const newShipLocation = addNewStatePropertyData(prevState.ships_location_dict, this.state.draggingElementName, validDropGroup.slice());
            const newDraggable = getNewStateProperty(prevState.draggable, this.state.draggingElementName, false);
            console.log(newLocationShips, newShipLocation, newDraggable);
            return {
              ships_location_dict: newShipLocation,
              location_ships_dict: newLocationShips,
              draggingElementName: '',
              draggingElementLen: null,
              dragIdx: null,
              draggable: newDraggable,
              dropSuccess: prevState.dropSuccess + 1
            }
          });
        };
        this.props.endDragging();
        break;
      default:
        console.log('cannot recognize drag event');
    }
  }

  handleMouseEvent(event) {
    const elementId = event.target.id;
    const element = document.getElementById(elementId);

    switch(event.type) {
      case 'mousedown':
        if (element.className === "fill") {
          // get the dragging group id array via two dictionaries
          console.log('modify position: ', elementId);
          console.log(this.state.location_ships_dict, this.state.ships_location_dict);
          const shipName = this.state.location_ships_dict[elementId];
          const ships = this.state.ships_location_dict[shipName];
          const idx = ships.indexOf(elementId);
          console.log(ships, elementId, idx);
          this.setState(() => ({
            draggingElementName: shipName,
            dragIdx: idx,
            draggingGroup: ships,
            isMoving: true
          }));
        }
        break;

      case 'mouseenter':
        if (this.state.isMoving) {
          // 1. validate the new positions
          const validMouseEnterGroup = getValidCellGroup(elementId, this.state.draggingGroup.length, this.state.dragIdx, this.state.isHorizontal[this.state.draggingElementName] ? "horizontal" : "vertical");
          // 2. change the style and update location_ships
          if (validMouseEnterGroup.length === this.state.draggingGroup.length) {
            console.log('mouseenter success: ',elementId);
            for (let cellId of validMouseEnterGroup) {
              const cell = document.getElementById(cellId);
              cell.className = "fill";
            };
            // 3. update the dragging group
            this.setState((prevState) => {
              const newLocationShips = addNewStatePropertyData(getNewStatePropertyDelete(prevState.location_ships_dict, prevState.draggingGroup), validMouseEnterGroup, this.state.draggingElementName);
              console.log(newLocationShips)
              const newShipLocation = getNewStateProperty(prevState.ships_location_dict, this.state.draggingElementName, validMouseEnterGroup.slice());
              return {
                draggingGroup: validMouseEnterGroup,
                ships_location_dict: newShipLocation,
                location_ships_dict: newLocationShips
              }
            });
            setTimeout(console.log('locations after mouoseenter: ',this.state.location_ships_dict));
          } else {
            // mouse enter cell is invalid
            console.log('invalid mouse enter pos');
            for (let i=0; i < this.state.draggingGroup.length; i++) {
              const cell = document.getElementById(this.state.draggingGroup[i]);
              cell.className = "fill";
            }
            this.setState(() => ({isMoving: false}));
          };
        }
        break;

      case 'mouseleave':
        if (this.state.isMoving === true) {
          console.log('mouseleave: ',elementId);
          for (let i=0; i < this.state.draggingGroup.length; i++) {
            const cell = document.getElementById(this.state.draggingGroup[i]);
            cell.className = "";
          }
        }
        break;

      case 'mouseup':
        if (this.state.isMoving === true) {
          console.log('mouseup: ',elementId);
          this.setState(() => ({draggingElementName: '', dragIdx: null, draggingGroup: [], isMoving: false}));
          console.log(this.state.ships_location_dict);
          console.log('locations after mouse up: ',this.state.location_ships_dict);
        }
        break;

      case 'click':
        console.log('click ', elementId);
        if (element.className === "fill") {
          // rotation
          const shipName = this.state.location_ships_dict[elementId];
          const ships = this.state.ships_location_dict[shipName];
          const idx = ships.indexOf(elementId);
          console.log(this.state.isHorizontal[shipName], ships, shipName);
          // 1. check if the vertical position is valid
          if (this.state.isHorizontal[shipName]) {
            // change to vertical from the point
            var canRotate = checkRotateValidation("horizontal", ships.length, idx, elementId);
            var newships = getRotatedCellGroup("horizontal", ships.length, idx, elementId);
            console.log(newships);
          } else {
            // change to horizontal from the point
            var canRotate = checkRotateValidation("vertical", ships.length, idx, elementId);
            var newships = getRotatedCellGroup("vertical", ships.length, idx, elementId);
          };

          // 2. shake if not valid
          if (!canRotate) {
            for (let ship of ships) {
              const cell = document.getElementById(ship);
              cell.className += " ship-shake";
              setTimeout(() => cell.className = "fill", 1000);
            }
          } else {
            // 2. set new dictionaries if valid
            for (let ship of ships) {
              const cell = document.getElementById(ship);
              cell.className = ""
            };
            for (let cellId of newships) {
              const cell = document.getElementById(cellId);
              cell.className = "fill";
            };
            this.setState((prevState) => {
              const newLocationShips = addNewStatePropertyData(getNewStatePropertyDelete(prevState.location_ships_dict, ships), newships, shipName);
              const newShipLocation = getNewStateProperty(prevState.ships_location_dict, shipName, newships.slice());
              const newHorizontal = getNewStateProperty(prevState.isHorizontal, shipName, !prevState.isHorizontal[shipName]);
              return {
                ships_location_dict: newShipLocation,
                location_ships_dict: newLocationShips,
                isHorizontal: newHorizontal
              }});
          }
        }
        break;
      default:
        console.log('cannot recognize event');
    }
  };

  handleReady() {
    // 1. upload board data
    console.log(this.state.curBoardNo, ' ready');
    console.log(this.state.ships_location_dict);
    console.log(this.state.location_ships_dict);
    this.props.setBoardData(this.state.curBoardNo, this.state.ships_location_dict, this.state.location_ships_dict);

    // 2. decide to re-render or start the game.
    if (this.state.curBoardNo === 1) {
      if (this.props.gameMode === "friend") {
        this.setState(() => ({
          curBoard: this.props.board2,
          curBoardNo: 2,
          playerName: this.props.playerName2,
          ships_size: {'carrier': 5, 'battleship': 4, 'submarine': 3, 'destroyer':2, 'cruiser':1},
          shipClass: {'carrier': "ship-fill", 'battleship': "ship-fill", 'submarine': "ship-fill", 'destroyer':"ship-fill", 'cruiser':"ship-fill" },
          draggingElementName: '',
          dragIdx: null,
          draggingElementLen: null,
          location_ships_dict: {},
          ships_location_dict: {},
          draggingGroup: [],
          isMoving: false,
          dropSuccess: 0,
          draggable: {'carrier': true, 'battleship': true, 'submarine': true, 'destroyer':true, 'cruiser':true },
          isHorizontal: {'carrier': true, 'battleship': true, 'submarine': true, 'destroyer':true, 'cruiser':true }
        }));
      } else {
        // random placement
        console.log('random placement');
        console.log(getRandomPos(2));
        const {ship_location, location_ship} = getRandomPos(2);
        console.log(ship_location, location_ship);
        this.props.setBoardData(2, ship_location, location_ship);
        setTimeout(() => this.props.setGameOn());
      }

    } else {
      // start the game
      this.props.setGameOn();
    }
  }

  render() {
    return (
      <div className="bg-boards">
        <div className="row-display">
          <div className="column-display">
            <p> Drag the ship to place.</p>
            <p>Click the ship to rotate.</p>
            <div className="launchPad">
              <div className="row-display--center">
                <span id={`${this.state.curBoardNo}-carrier`} className={`carrier ${this.state.shipClass['carrier']}`} draggable={this.state.draggable['carrier']} onDragStart={this.handleDragEvent}/>
                <span id={`${this.state.curBoardNo}-battleship`} className={`battleship ${this.state.shipClass['battleship']}`} draggable={this.state.draggable['battleship']} onDragStart={this.handleDragEvent}/>
              </div>
              <div className="row-display--center">
                <span id={`${this.state.curBoardNo}-submarine`} className={`submarine ${this.state.shipClass['submarine']}`} draggable={this.state.draggable['submarine']} onDragStart={this.handleDragEvent}/>
                <span id={`${this.state.curBoardNo}-destroyer`} className={`destroyer ${this.state.shipClass['destroyer']}`} draggable={this.state.draggable['destroyer']} onDragStart={this.handleDragEvent}/>
                <span id={`${this.state.curBoardNo}-cruiser`} className={`cruiser ${this.state.shipClass['cruiser']}`} draggable={this.state.draggable['cruiser']} onDragStart={this.handleDragEvent}/>
              </div>
            </div>
            <div className="row-display--center">
                <button disabled={this.state.dropSuccess < 5} onClick={this.handleReady} className={this.state.dropSuccess < 5 ? "btn-disabled" : "btn-confirm"}>Confirm</button>
            </div>
          </div>

          <Board
            board={this.state.curBoard}
            boardNo={this.state.curBoardNo}
            playerName={this.state.playerName}
            colsLabel={this.props.colsLabel}
            isDragging={this.props.isDragging}
            handleMouseEvent={this.handleMouseEvent}
            handleDragEvent={this.handleDragEvent}
          />
        </div>
      </div>

    )
  }
}
