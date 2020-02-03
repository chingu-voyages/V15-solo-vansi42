import React, { Component } from "react";
import "./Tile.css";

class Tile extends Component {
  static defaultProps = { width: 7, height: 75 };
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (this.props.isAvailable) {
      this.props.checkIfPair(this.props.tileID);
    } else {
      console.log("unavailable");
    }
  }

  render() {
    const width = this.props.width,
      height = this.props.height;
    const classes =
      "tile" +
      (this.props.isSelected ? " selected" : "") +
      (this.props.isFound ? " found" : "");
    let top = height * this.props.row + height * this.props.layer;
    let left = width * this.props.position;
    if (
      this.props.layer === "left" ||
      this.props.layer === "right" ||
      this.props.layer === 4
    ) {
      top = (height * 8) / 2 - height / 2;
    }
    if (this.props.layer === "left") {
      left = 0 ;
    } else if (this.props.layer === "right") {
      left += 13 * width;
    } else {
      left += width * this.props.padding;
    }

    return (
      <div
        className={classes}
        style={{
          left: left+'%',
          top: top,
          zIndex: this.props.layer
        }}
        face={this.props.face}
        onClick={this.handleClick}
        key={this.props.tileID}
      >
        {this.props.face}
      </div>
    );
  }
}

export default Tile;