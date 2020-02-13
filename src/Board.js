import React, { Component } from "react";
import "./Board.css";
import Tile from "./Tile";
import { scrambleArray, isFlower, isSeason, compArray } from "./helpers";

class Board extends Component {
  // Layout:
  // Layer 0: 12-8-10-12-12-10-8-12
  // Layer 1: 6 X 6
  // Layer 2: 4 X 4
  // Layer 3: 2 X 2
  // Layer 4: 1
  // Left: 1
  // Right: 2
  static defaultProps = {
    settings: {
      0: [12, 8, 10, 12, 12, 10, 8, 12],
      1: [6, 6, 6, 6, 6, 6],
      2: [4, 4, 4, 4],
      3: [2, 2],
      4: [1],
      left: [1],
      right: [2]
    }
  };

  constructor(props) {
    super(props);
    let newBoard = this.createBoard();
    this.state = {
      board: newBoard,
      pairsLeft: Object.keys(newBoard).length / 2,
      selected: null
    };
    this.checkIfPair = this.checkIfPair.bind(this);
    this.restart = this.restart.bind(this);
  }

  // getTilesList()
  // Builds an array of the classic tiles set:
  // 1-9 (Dots, Bamboo, Characters), each of these has 4 copies: 108 total
  // 4 winds, each has 4 copies: 16 total
  // 3 dragons (red, green, white), each has 4 copies: 12
  // 4 flowers (plum blossom, orchid, chrysantemum, bamboo)
  // 4 seasons
  // Total: 144
  getTilesList() {
    let tilesList = [];
    // Numbers
    for (let i = 1; i <= 9; i++) {
      for (let j = 1; j <= 4; j++) {
        tilesList.push("Dots-" + i, "Bamboo-" + i, "Character-" + i);
      }
    }
    // Winds
    for (let i = 1; i <= 4; i++) {
      tilesList.push("NORTH", "EAST", "SOUTH", "WEST");
    }
    // Dragons
    for (let i = 1; i <= 4; i++) {
      tilesList.push("RED dragon", "GREEN dragon", "BLUE dragon");
    }
    // Flowers
    tilesList.push("PLUM", "ORCHID", "MUM", "BAMBOO");
    // Seasons
    tilesList.push("SPRING", "WINTER", "SUMMER", "AUTUMN");
    return tilesList;
  }

  createBoard() {
    let newBoard = {};
    let tiles = scrambleArray(this.getTilesList());
    // each tile has coords: layer, row, position
    let layer = 0,
      row = 0,
      position = 0,
      isAvailable = "";
    for (let i = 0; i < tiles.length; i++) {
      isAvailable = this.isAvailable({ layer, row, position });
      newBoard[[layer, row, position]] = {
        face: tiles[i],
        isFound: false,
        isAvailable: isAvailable
      };

      position++;
      if (position === this.props.settings[layer][row]) {
        position = 0;
        row++;
        if (row === this.props.settings[layer].length) {
          if (layer === 4) {
            layer = "left";
          } else if (layer === "left") {
            layer = "right";
          } else {
            layer++;
          }
          row = 0;
        }
      }
    }
    return newBoard;
  }

  // Check if tile is available
  // e.i. at least one of its sides is empty and there are no tiles covering it.
  // Param: t
  // On the first time this runs, the board isn't initialized yet. then t is an object {layer, row, position}.
  // If the board is initialized, then t stands for the tile's index.
  isAvailable(t) {
    // Initializing
    let { layer, row, position } = t;
    return (
      // First tile in row
      (position === 0 &&
        !(row === 3 && layer === 0) &&
        !(row === 4 && layer === 0) &&
        layer !== "right" &&
        layer !== 3) ||
      // Last tile in row
      (position === this.props.settings[layer][row] - 1 &&
        !(row === 3 && layer === 0) &&
        !(row === 4 && layer === 0) &&
        layer !== 3)
    );
  }

  updateAvailability(t) {
    let [layer, row, position] = t;
    let newBoard = this.state.board;
    newBoard[t].isAvailable = false;
    // update tile to the left
    if (
      position > 0 &&
      !newBoard[[layer, row, position - 1].join(",")].isFound
    ) {
      newBoard[[layer, row, position - 1].join(",")].isAvailable = true;
    }
    // update tile to the right
    if (position < this.props.settings[layer][row] - 1) {
      newBoard[
        [layer, row, 1 + parseInt(position, 10)].join(",")
      ].isAvailable = true;
    }
    // top tile frees four under it
    if (layer === "4") {
      newBoard[[3, 0, 0]].isAvailable = true;
      newBoard[[3, 0, 1]].isAvailable = true;
      newBoard[[3, 1, 0]].isAvailable = true;
      newBoard[[3, 1, 1]].isAvailable = true;
    }
    return newBoard;
  }

  restart() {
    let newBoard = this.createBoard();
    this.setState({
      board: newBoard,
      pairsLeft: newBoard.length / 2,
      selected: null
    });
  }

  checkIfPair(t) {
    const selectedID = this.state.selected;
    let isPair = false;
    if (
      selectedID !== null &&
      !compArray(t, selectedID) &&
      (this.state.board[selectedID].face === this.state.board[t].face ||
        (isFlower(this.state.board[selectedID].face) &&
          isFlower(this.state.board[t].face)) ||
        (isSeason(this.state.board[selectedID].face) &&
          isSeason(this.state.board[t].face)))
    ) {
      isPair = true;
    }
    if (!isPair) {
      this.setState({ selected: t });
    } else {
      let newBoard = this.state.board;
      newBoard[t].isFound = true;
      newBoard[this.state.selected].isFound = true;
      let pairsLeft = this.state.pairsLeft - 1;

      newBoard = this.updateAvailability(t);
      newBoard = this.updateAvailability(this.state.selected);
      this.setState({
        selected: null,
        board: newBoard,
        pairsLeft: pairsLeft
      });
    }
  }

  render() {
    if (this.state.pairsLeft === 0) {
      return (
        <div>
          <h1>YOU WIN! YAAAAAAYYY!!!</h1>
          <button onClick={this.restart}>Play again?</button>
        </div>
      );
    } else {
      const board = this.state.board;
      //console.log(board);
      const tiles = Object.keys(board).map((key, i) => (
        <Tile
          face={board[key].face}
          isAvailable={board[key].isAvailable}
          checkIfPair={this.checkIfPair}
          curr={this.state.selected}
          isSelected={compArray(this.state.selected, key.split(","))}
          isFound={board[key].isFound}
          layer={key.split(",")[0]}
          row={key.split(",")[1]}
          position={key.split(",")[2]}
          padding={
            (14 - this.props.settings[key.split(",")[0]][key.split(",")[1]]) / 2
          }
          key={key}
        />
      ));
      return (
        <div>
          <button onClick={this.restart}>Restart</button>
          <div className="board"> {tiles} </div>
        </div>
      );
    }
  }
}

export default Board;
