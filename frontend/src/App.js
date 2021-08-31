import logo from './logo.svg';
import './App.css';
import Board from './components/board';
import { useState, useEffect } from 'react';

function App() {

  const [query, setQuery] = useState('')


  function handleChange(e) {
    setQuery(e.target.value);
  }

  function handleSubmit() {
    const response = fetch('/parse', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 'query': query })
    }).then(response => response.json().then(data => {
      console.log(data)
    }))

  }

  return (
    <div className="App">
      <nav class="container flex items-center px-20 py-8">
        <div class="text-3xl	">chess flashcards</div>
        <ul class="hidden sm:flex flex-1 justify-end items-center gap-12">
          <li class="cursor-pointer">home</li>
          <li class="cursor-pointer">about</li>
        </ul>
      </nav>
      <div class="flex py-2">
        <input type='form' class="flex justify-left items-center w-1/2 sm:w-5/6 mx-20 rounded-full border border-black	px-2 py-1 focus:outline-none" onChange={(e) => handleChange(e)}></input>
        <button type='button' class="flex justify-left items-center mx-20 rounded-full border border-black px-2 py-1 focus:outline-none"
          onClick={async () => handleSubmit()}
        >Search</button>
      </div>

      <Board />

    </div >
  );
}

export default App;
