{/*
//jsx
function App() {
  return (
    <h1>Hello Divyanshi</h1>
  );
}

export default App;

//component
function Greeting() {
  return <h2>Hello User!</h2>;
}

function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
    </div>
  );
}

//prop
function Greeting({ name }) {
  return <h2>Hello {name}</h2>;
}

function App() {
  return (
    <div>
      <Greeting name="Divyanshi" />
      <Greeting name="Riya" />
    </div>
  );
}
export default App;


//useState
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increase
      </button>
    </div>
  );
}

export default App;

//event handling1
function App() {
  const handleClick = () => {
    alert("Button clicked!");
  };

  return (
    <button onClick={handleClick}>
      Click Me
    </button>
  );
}
export default App;


//event handling2
import { useState } from "react";

function App() {
  const [name, setName] = useState("");

  return (
    <div>
      <input 
        type="text" 
        onChange={(e) => setName(e.target.value)} 
      />
      <h2>Hello {name}</h2>
    </div>
  );
}
export default App;

//event handling3
import {useState} from "react";
function App(){
  const [time, setTime] = useState(" 00:00 ");

  return(
    <>
    <input type="text" onChange={(e) => setTime(e.target.value)} placeholder = "Enter current time..."/>
    
    <h1>Time:{time}</h1>
    </>
  );
}
export default App;

//todo app
import { useState } from "react";
function App() {
  const [name, setName] = useState("");
  const [tasks, setTasks] = useState([]);

  const add = () => {
  setTasks([...tasks, name]);
  setName("");
};
  return (
    <div>
      <h2>ToDo App</h2>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter task toDo"/>
      <button onClick={add}>Add</button>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </div>
  );
}
export default App;

//contact form
import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!name) newErrors.name = "Name is required";

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!email.includes("@")) {
      newErrors.email = "Enter valid email";
    }

    if (!message) newErrors.message = "Message is required";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);
    } else {
      setErrors({});
      setSubmitted(true);

      setName("");
      setEmail("");
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Contact Form</h2>
      <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
          <p>{errors.name}</p>
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <p>{errors.email}</p>
          <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)}/>
          <p>{errors.message}</p>
        <button type="submit">Submit</button>
      </form>
      {submitted && <h3>Form submitted successfully!</h3>}
    </div>
  );
}

export default App;
  */}

import { useState } from "react";

function App(){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () =>{
    let newError = {};
    if(!name){
      newError.name="Name is required!";
    }
    if(!email){
      newError.email="Email is required!";
    } else if (!email.includes("@")){
      newError.email = "Enter valid email!";
    }
    if(!message){
      newError.message ="Message is required!"
    }
    return newError;
  };

  const handleSubmit = (e) =>{
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);
    } else {
      setErrors({});
      setSubmitted(true);

      setName("");
      setEmail("");
      setMessage("");
    }
  };

  return(
    <>
    <form onSubmit={handleSubmit}>
    <div>
    <h2>Contact Form</h2>
    <h3>Name:</h3>
    <input type ="text" value={name} onChange={(e)=>setName(e.target.value)}/>
    <p>{errors.name}</p>
    <h3>Email:</h3>
    <input type ="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
    <p>{errors.email}</p>
    <h3>Message:</h3>
    <input type ="text" value={message} onChange={(e)=>setMessage(e.target.value)}/>
    <p>{errors.message}</p>
    <br></br>
    <br></br>
    <button type = "submit">Submit form</button>
    </div>
    </form>
    <br></br>
    {submitted && <h2>Form Submitted Successfully!</h2>}
    </>
  );
}
export default App;

{/*
//main file
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


//useEffect
import { useState, useEffect } from 'react';
function App() {
  const [count, setCount] = useState(1000);

  useEffect(() => {
    setTimeout(() => {
      setCount((count) => count - 1);
    }, 1000);
  });

  return <h1>Your time starts now {count}</h1>;
}
export default App;


//useRef
import { useState, useRef, useEffect } from "react";

function App() {
  const [inputValue, setInputValue] = useState("");
  const count = useRef(0);

  useEffect(() => {
    count.current = count.current + 1;
  });

  return (
    <div>
      <br></br>
      <p>Type in the input field:</p><br></br>
      <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/><br></br>
      <br></br>  
      <h2>Type Count: {count.current}</h2>
    </div>
  );
}
export default App;


// Tic-Tac-Toe Game 
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i] || squares.every(s => s !== null)) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (squares.every(square => square !== null)) {
    status = 'Draw! No one wins';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>

      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>

      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>

      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      nextSquares
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
        />
        
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
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

    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }

  return null;
}
*/}
