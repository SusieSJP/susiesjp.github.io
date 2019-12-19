import React from 'react';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="row-display--center">
          <span className="bg-white">
            <table>
              <caption>{`${this.props.playerName}'s Board`}</caption>
              <thead>
                {
                  this.props.colsLabel.map((label, idx) => {
                        return (
                          <th
                          key={`colLabel-${idx}`}
                          scope="col"
                          className="label"
                          >{label}
                          </th>
                        )
                  })
                }
              </thead>
              <tbody id={`${this.props.playerName}-board`}>
                {
                  this.props.board.map((elements, row) => {
                    return (
                      <tr key={`${this.props.playerName}-row-${row}`}>
                      {
                        elements.map((element, col) => {
                          return (
                            <td
                              key={`${row}-${col}`}
                              id={`grid-${this.props.boardNo}-${row}-${col}`}
                              onDragEnter={this.props.handleDragEvent}
                              onDragLeave={this.props.handleDragEvent}
                              onDragOver={this.props.handleDragEvent}
                              onDrop={this.props.handleDragEvent}
                              onMouseDown={this.props.handleMouseEvent}
                              onMouseEnter={this.props.handleMouseEvent}
                              onMouseLeave={this.props.handleMouseEvent}
                              onMouseUp={this.props.handleMouseEvent}
                              onClick={this.props.handleMouseEvent}
                            />)
                        })
                      }
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </span>

        </div>

    )
  }
}
