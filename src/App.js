import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [points, setPoints] = useState();
  const [currentPoint, setCurrentPoint] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [allCleared, setAllCleared] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('0.0s');
  const [buttonText, setButtonText] = useState('Play');
  const [circles, setCircles] = useState([]);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  const startGame = () => {
    resetGame();
    if (points <= 0) return;
    setButtonText('Restart');
    generateCircles(points);
    setGameOver(false);
    setAllCleared(false);

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = ((Date.now() - startTimeRef.current) / 1000).toFixed(1);
      setElapsedTime(`${elapsed}s`);
    }, 100);
  };

  const generateCircles = (points) => {
    const newCircles = [];
    const gameAreaWidth = 480;
    const gameAreaHeight = 500; 

    for (let i = 1; i <= points; i++) {
      const randomX = Math.random() * (gameAreaWidth - 50);
      const randomY = Math.random() * (gameAreaHeight - 50);
      newCircles.push({
        number: i,
        x: randomX,
        y: randomY,
        color: 'white', 
        opacity: 1, 
      });
    }

    setCircles(newCircles);
  };

  const checkClick = (number) => {
    if (gameOver || allCleared) return;

    setCircles((prevCircles) => {
      const updatedCircles = prevCircles.map((circle) => {
        if (circle.number === number) {
          if (number === currentPoint) {
            if (currentPoint === points) {
              setAllCleared(true);
              setGameOver(true);
              clearInterval(timerRef.current);
            } else {
              setCurrentPoint((prev) => prev + 1);
            }
            return {
              ...circle,
              color: 'red',
              opacity: 0,
            };
          } else {
            setGameOver(true);
            clearInterval(timerRef.current);
          }
        }
        return circle;
      });
      return updatedCircles;
    });
  };

  const resetGame = () => {
    clearInterval(timerRef.current);
    setButtonText('Play');
    setElapsedTime('0.0s');
    setGameOver(false);
    setAllCleared(false);
    setCurrentPoint(1);
    setCircles([]);
  };

  return (
    <div className="container">
      <div className="header">
        <h2
          id="gameStatus"
          style={{ color: gameOver ? (allCleared ? 'green' : 'red') : 'black' }}
        >
          {allCleared ? 'ALL CLEARED' : gameOver ? 'GAME OVER' : "LET'S PLAY"}
        </h2>
      </div>
      <div className="settings">
        <div className="input-group">
          <label htmlFor="pointsInput">Points:</label>
          <input
            type="number"
            id="pointsInput"
            min="1"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="time-display">
          <label>Time:</label>
          <label id="timeLabel">{elapsedTime}</label>
        </div>
        <button onClick={startGame}>{buttonText}</button>
      </div>
      <div className="game-area">
        {circles.map((circle) => (
          <div
            key={circle.number}
            className="circle"
            style={{
              left: `${circle.x}px`,
              top: `${circle.y}px`,
              backgroundColor: circle.color,
              opacity: circle.opacity,
              position: 'absolute',
            }}
            onClick={() => checkClick(circle.number)}
          >
            {circle.number}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
