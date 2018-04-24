import React from 'react';
import Board from './Board';



function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { 
        winnerLocation: [a,b,c],
        winnerPlayer: squares[a]
      };
    }
  }
  return null;
}

class Game extends React.Component{
    constructor(){
        super();
        this.state = {
          history: [{
            squares: Array(9).fill(null),
            moveLocation: '',
          }], 
          xIsNext: true,
          stepNumber: 0,
          isReverse: false,
        };
      }

      handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]){
          return;
        }
    
        const matrixSize = Math.sqrt(history[0].squares.length);
        const moveLocation = [Math.floor(i / matrixSize) + 1, (i % matrixSize) + 1].join(", "); // (row = vị trí / matrixSize, col = vị trí % matrixSize)
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
          history: history.concat([{
            squares: squares,
            moveLocation: moveLocation,
          }]),
          xIsNext: !this.state.xIsNext,
          stepNumber: history.length
        });
      }
    
    jumpTo(move){
        this.setState({
          stepNumber: move,
          xIsNext: (move % 2) ? false : true,
        });
      }
      changeReverse(isReverse){
        this.setState({
          isReverse: !isReverse
        });
      }

  render(){
    const history = this.state.history;
    const current = history[this.state.stepNumber]; 
    const squares = current.squares;
    const winner = calculateWinner(squares);
    let status;
    if(winner){
      status = "Chiến Thắng : " + winner.winnerPlayer;
    }else if(this.state.stepNumber === 9){
      status = "Hòa Nhau ";
    }else{
      status = "Người Chơi : " + (this.state.xIsNext ? 'X' : 'O');
    }
    const moves = history.map((step, move) => {
        const description = move ? `Lượt Đi Thứ ${move} (${step.moveLocation})` : 'Trò Chơi Mới '; 
        return <li key={move}><a onClick={() => this.jumpTo(move)}>{description}</a></li>
      });
      
    return(
        <div>
            <h1>Trò Chơi Caro </h1>
     
        <div className="game">
          <Board squares={squares} onClick={i => this.handleClick(i)} winner={winner && winner.winnerLocation}/> 
        </div>
        <div className="game-info">
          <p>{status}</p>
          <ol reversed={this.isReverse ? 'reverse' :''}>{this.isReverse ? moves.reverse() : moves}</ol>
          <button className="btn btn-info"onClick={() => this.changeReverse(this.isReverse)}>Sắp Xếp</button>
        </div>
      </div>
    );
  }
}

export default Game;