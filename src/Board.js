import React, { Component } from "react";
import "./Board.css";
import Tile from "./Tile";
import { scrambleArray } from "./helpers";

class Board extends Component {
  // 1-9 (Dots, Bamboo, Characters), each of these has 4 copies: 108 total
  // 4 winds, each has 4 copies: 16 total
  // 3 dragons (red, green, white), each has 4 copies: 12
  // 4 flowers (plum blossom, orchid, chrysantemum, bamboo)
  // 4 seasons
  // Total: 144

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
      pairsLeft: newBoard.length / 2,
      selected: null
    };
    this.checkIfPair = this.checkIfPair.bind(this);
    this.restart = this.restart.bind(this);
  }

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
    let newBoard = [];
    let tiles = scrambleArray(this.getTilesList());
    // each tile has coords: layer, row, position
    let layer = 0,
      row = 0,
      position = 0,
      padding = 0,
      isAvailable = "";
    for (let i = 0; i < tiles.length; i++) {
      padding = (14 - this.props.settings[layer][row]) / 2;
      //isAvailable = (position === 0 || position === this.props.settings[layer][row] - 1);
      isAvailable = true;
      newBoard.push({
        face: tiles[i],
        isFound: false,
        layer: layer,
        row: row,
        position: position,
        padding: padding,
        isAvailable: isAvailable
      });

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
    // Mix it all up
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

  isFlower(t) {
    return ["MUM", "BAMBOO", "ORCHID", "PLUM"].includes(t);
  }
  isSeason(t) {
    return ["AUTUMN", "WINTER", "SPRING", "SUMMER"].includes(t);
  }

  checkIfPair(t) {
    const selectedID = this.state.selected;
    let isPair = false;
    if (
      selectedID !== null &&
      (this.state.board[selectedID].face === this.state.board[t].face ||
        (this.isFlower(this.state.board[selectedID].face) &&
          this.isFlower(this.state.board[t].face)) ||
        (this.isSeason(this.state.board[selectedID].face) &&
          this.isSeason(this.state.board[t].face)))
    ) {
      isPair = true;
    }
    if (!isPair) {
      this.setState({ selected: t });
    } else if (selectedID !== t) {
      let newBoard = this.state.board;
      newBoard[t].isFound = true;
      newBoard[this.state.selected].isFound = true;
      let pairsLeft = this.state.pairsLeft - 1;
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
      const tiles = this.state.board.map((t, i) => (
        <Tile
          tileID={i}
          face={t.face}
          isAvailable={t.isAvailable}
          checkIfPair={this.checkIfPair}
          isSelected={this.state.selected === i}
          isFound={t.isFound}
          layer={t.layer}
          row={t.row}
          position={t.position}
          padding={t.padding}
          key={i}
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
