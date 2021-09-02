import logo from './logo.svg';
import './App.css';
import Board from './components/board';
import { useState, useEffect } from 'react';

function App() {

  const [query, setQuery] = useState('')
  const [flashCards, setFlashCards] = useState({})
  const [currentFCCount, setCurrentFCCount] = useState(1)
  const [currentCount, setCurrentCount] = useState(0)
  const [positions, setPositions] = useState({
    "white": {
        "P": [["a",2],["b",2],["c",2],["d",2],["e",2],["f",2],["g",2],["h",2]],
        "N": [["b",1], ["g",1]],
        "R": [["a",1], ["h",1]],
        "B": [["c",1], ["f",1]],
        "Q": [["d",1]],
        "K": [["e",1]],
    },
    "black": {
        "P": [["a",7],["b",7],["c",7],["d",7],["e",7],["f",7],["g",7],["h",7]],
        "N": [["b",8], ["g",8]],
        "R": [["a",8], ["h",8]],
        "B": [["c",8], ["f",8]],
        "Q": [["d",8]],
        "K": [["e",8]],
    }        
    })



  useEffect(() => {
    if(Object.keys(flashCards).length===0){
      const getFC = fetch('/fc', {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      }).then(getFC => getFC.json().then(data => {
        setFlashCards(data)
      }))  
    }

  })

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
    }))

    const getFC = fetch('/fc', {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    }).then(getFC => getFC.json().then(data => {
      console.log(data)
      setFlashCards(data)
    }))

  }

  function previousFC(){
    if(Object.keys(flashCards).length!=0){
      setCurrentCount(0)

      let value = currentFCCount
      if(value<=0) value = Object.keys(flashCards).length
      setCurrentFCCount(value-1)
      getBoard(value-1, 0)  
    }
  }

  function previousStep(){

    let value = currentCount
    if(value<=0) value = 4

    setCurrentCount((value-1))
    getBoard(currentFCCount, value-1)

  }

  function nextFC(){
    if(Object.keys(flashCards).length!=0){
      setCurrentCount(0)
      setCurrentFCCount((currentFCCount+1)%(Object.keys(flashCards).length))
      getBoard((currentFCCount+1)%(Object.keys(flashCards).length), 0)
  
    }

  }

  function nextStep(){

    setCurrentCount((currentCount+1)%4)
    getBoard(currentFCCount, (currentCount+1)%4)
  }

  function getBoard(fcCount, stepCount){
    console.log(flashCards)
    console.log(currentFCCount)
    console.log(currentCount)
    if(flashCards.length>0){

      const getPositions = fetch('/positions', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          'moves':JSON.parse(flashCards[fcCount]['nextSteps']),
          'step': stepCount,
          'positions1':JSON.parse(flashCards[fcCount]['positions']),
          'board1':JSON.parse(flashCards[fcCount]['board']),
          'turn':flashCards[fcCount]['turn']
        })
      }).then(getPositions => getPositions.json().then(data => {
        setPositions(data)
        console.log(positions)
      }))
  
    }
    return positions
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
      <div class="flex py-1">
        <input type='form' placeholder="Add a new game link" class="flex justify-left items-center w-1/2 sm:w-5/6 mx-20 rounded-full border border-black	px-2 py-1 focus:outline-none" onChange={(e) => handleChange(e)}></input>
        <button type='button' class="flex justify-left items-center mx-20 rounded-full border border-black px-2 py-1 focus:outline-none"
          onClick={async () => handleSubmit()}
        >Search</button>
      </div>


      <div class="py-2">
        <button type='button' class="items-center mx-20 rounded-full border border-black px-2 py-1 focus:outline-none"
            onClick={() => previousFC()}
          >Previous Set</button>
        <span>{currentFCCount+1}/{flashCards.length} </span>
        <button type='button' class="items-center mx-20 rounded-full border border-black px-5 py-1 focus:outline-none"
          onClick={() => nextFC()}
        >Next Set</button>
      </div>
      <Board positions={positions}/>
      <div>
        <button type='button' class="items-center mx-20 rounded-full border border-black px-2 py-1 focus:outline-none"
              onClick={() => previousStep()}
            >Step Backward</button>
        <span>{currentCount+1}/4</span>
        <button type='button' class="items-center mx-20 rounded-full border border-black px-2 py-1 focus:outline-none"
          onClick={() => nextStep()}
        >Step Forward</button>
      </div>

    </div >
  );
}

export default App;
