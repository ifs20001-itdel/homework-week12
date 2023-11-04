import * as React from 'react';
import './App.css';
import useSound from 'use-sound';
import winSound from './menang.mp3';
import loseSound from './kalah.mp3';
import backgroundImg from './background.jpg';
import backgroundMusic from './backsound.mp3';

function calculateStatus(winner, squares, nextValue) {
  let currentPlayer = nextValue === 'X' ? 'Kamu' : 'Musuh';
  let winnerMessage = winner === 'X' ? 'Kamu' : winner === 'O' ? 'Musuh' : '';

  return winner
    ? `Winner: ${winnerMessage}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${currentPlayer}`;
}


function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
}

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
      return squares[a];
    }
  }
  return null;
}

function Board() {
  const [squares, setSquares] = React.useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = React.useState(true);
  const [playWinSound, { stop: stopWinSound }] = useSound(winSound);
  const [playLoseSound, { stop: stopLoseSound }] = useSound(loseSound);
  const [playBackgroundMusic, { stop: stopBackgroundMusic }] = useSound(backgroundMusic);
  const [gameStarted, setGameStarted] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);

  React.useEffect(() => {
    return () => {
      stopBackgroundMusic();
    };
  }, [stopBackgroundMusic]);

  function startGame() {
    setGameStarted(true);
    let countdownValue = 3;

    const countdownInterval = setInterval(() => {
      setCountdown(countdownValue);
      countdownValue--;
    }, 1000);

    setTimeout(() => {
      clearInterval(countdownInterval);
      setCountdown(0);
      playBackgroundMusic(); 
    }, 1000);
  }

  function selectSquare(square) {
    if (squares[square] || calculateWinner(squares) || !gameStarted) {
      return;
    }
    const newSquares = squares.slice();
    newSquares[square] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);

    const winner = calculateWinner(newSquares);
    if (winner) {
      if (winner === 'X') {
        playWinSound();
      } else {
        playLoseSound();
      }
      stopBackgroundMusic();
    }
  }

  function restart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameStarted(false);
    setCountdown(0);
    stopWinSound();
    stopLoseSound();
    stopBackgroundMusic();
  }

  function renderSquare(i) {
    const isX = squares[i] === 'X';
    const isO = squares[i] === 'O';
    const squareStyle = {
      backgroundColor: isX ? '#FF6969' : isO ? '#87C4FF' : 'gray',
    };
  
    return (
      <button
        className="square hover:bg-gray-600 text-white font-bold py-14 px-12 rounded-lg"
        style={squareStyle}
        onClick={() => selectSquare(i)}
      >
        {squares[i]}
      </button>
    );
  }
  

  const winner = calculateWinner(squares);
  const nextValue = calculateNextValue(squares);
  const status = calculateStatus(winner, squares, nextValue);

  return (
    <div className="w-96 mx-auto bg-gray-200 p-4 rounded-lg backdrop-blur-md">
      {!gameStarted && (
        <div className="text-2xl text-center font-bold mb-4">
          {countdown > 0 ? countdown : 'Press "Start" to begin'}
        </div>
      )}
      {gameStarted && <div className="text-2xl font-bold mb-4">{status}</div>}
      <div className="grid grid-cols-3 gap-2">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      {!gameStarted && (
        <button
          className="mt-4 w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
          onClick={startGame}
        >
          Start
        </button>
      )}
      {gameStarted && (
        <button
          className="mt-4 w-full py-2 px-4 bg-red-500 hover:bg-red-700 text-white font-bold rounded"
          onClick={restart}
        >
          Restart
        </button>
      )}
    </div>
  );
}

function Game() {
  return (
    <div className="h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImg})` }}>
      <div>
        <Board />
      </div>
    </div>
  );
}

function App() {
  return <Game />;
}

export default App;
