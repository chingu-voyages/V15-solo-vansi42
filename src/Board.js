import React, { Component } from "react";
import "./Board.css";
import Tile from "./Tile";
import { scrambleArray, isFlower, isSeason, compArray } from "./helpers";

class Board extends Component {
  // Layout for classic game.
  // Layer 0 row 0 has 12 tiles
  // Layer 0 row 1 has 8 tiles
  // And so on...

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
    this.handleChoice = this.handleChoice.bind(this);
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
        tilesList.push("Dots-" + i, "Bamboo-" + i, "Char-" + i);
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

  // createBoard()
  // Returns the main object for the game, initialized for a new game.
  // The keys are the tiles coordinates (layer, row, position)
  // Each tile has 3 attributes:
  // - face: the "picture" on it
  // - isRemoved: if true, don't display it
  // - isAvailable: Can it be removed in the current move?
  createBoard() {
    let newBoard = {};
    // Shuffle the tiles
    const tiles = scrambleArray(this.getTilesList());
    let layer = 0,
      row = 0,
      position = 0,
      isAvailable = "";

    for (let i = 0; i < tiles.length; i++) {
      isAvailable = this.isAvailable({ layer, row, position });
      newBoard[[layer, row, position]] = {
        face: tiles[i],
        isRemoved: false,
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

  // isAvailable(t):
  // Check if tile t can be removed.
  // e.i. at least one of its sides is empty and there are no tiles covering it.
  // t contains the tile's coordinates.
  // This function is used only to initialize the "isAvailable" attribute for each tile.
  isAvailable(t) {
    let { layer, row, position } = t;
    return (
      // First tile in row and edge cases
      (position === 0 &&
        !(row === 3 && layer === 0) &&
        !(row === 4 && layer === 0) &&
        layer !== "right" &&
        layer !== 3) ||
      // Last tile in row and edge cases
      (position === this.props.settings[layer][row] - 1 &&
        !(row === 3 && layer === 0) &&
        !(row === 4 && layer === 0) &&
        layer !== 3)
    );
  }

  // updateAvailability(t):
  // Every time a tile is removed we need to upadte the availability for its neighbors.
  updateAvailability(t) {
    let [layer, row, position] = t;
    let newBoard = this.state.board;
    newBoard[t].isAvailable = false;
    // update tile to the left
    if (
      position > 0 &&
      !newBoard[[layer, row, position - 1].join(",")].isRemoved
    ) {
      newBoard[[layer, row, position - 1].join(",")].isAvailable = true;
    }
    // update tile to the right
    if (position < this.props.settings[layer][row] - 1) {
      newBoard[
        [layer, row, 1 + parseInt(position, 10)].join(",")
      ].isAvailable = true;
    }
    // Edge cases
    // top tile frees four under it
    if (layer === "4") {
      newBoard[[3, 0, 0]].isAvailable = true;
      newBoard[[3, 0, 1]].isAvailable = true;
      newBoard[[3, 1, 0]].isAvailable = true;
      newBoard[[3, 1, 1]].isAvailable = true;
    }
    // rightmost tiles
    if (position === "0" && layer === "right") {
      newBoard[[0, 3, 11]].isAvailable = true;
      newBoard[[0, 4, 11]].isAvailable = true;
    }
    // leftmost tile
    if (layer === "left") {
      newBoard[[0, 3, 0]].isAvailable = true;
      newBoard[[0, 4, 0]].isAvailable = true;
    }

    return newBoard;
  }

  // restart():
  // Starts a new game.
  // creates a new board (shuffled)
  restart() {
    let newBoard = this.createBoard();
    this.setState({
      board: newBoard,
      pairsLeft: newBoard.length / 2,
      selected: null
    });
  }

  // checkIfPair(t):
  // returns true if the tile t matches the tile that was previously selected.
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
    return isPair;
  }
  // handleChoice(t):
  // if t matches the previously selected tile - remove them from the board.
  // else, set t as the new selected tile.
  handleChoice(t) {
    if (!this.checkIfPair(t)) {
      this.setState({ selected: t });
    } else {
      let newBoard = this.state.board;
      let pairsLeft = this.state.pairsLeft - 1;
      newBoard[t].isRemoved = true;
      newBoard[this.state.selected].isRemoved = true;
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
    // Game over
    if (this.state.pairsLeft === 0) {
      return (
        <div>
          <h1>YOU WIN! YAAAAAAYYY!!!</h1>
          <button onClick={this.restart}>Play again?</button>
        </div>
      );
    } else {
      const board = this.state.board;
      const tiles = Object.keys(board).map((key, i) => (
        <Tile
          face={board[key].face}
          isAvailable={board[key].isAvailable}
          handleChoice={this.handleChoice}
          curr={this.state.selected}
          isSelected={compArray(this.state.selected, key.split(","))}
          isRemoved={board[key].isRemoved}
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
