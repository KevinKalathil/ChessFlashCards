import logo from './logo.svg';
import './App.css';
import Board from './components/board';
import SideBar from './components/sidebar';
import Navbar from './components/navbar';
import { useState, useEffect } from 'react';

function App() {

  const [query, setQuery] = useState('')
  const [flashCards, setFlashCards] = useState({})
  const [currentFCCount, setCurrentFCCount] = useState(1)
  const [currentCount, setCurrentCount] = useState(0)
  const [candidate, setCandidates] = useState([])
  const [destination, setDestinations] = useState([])

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
        setPositions(data['positions'])
        setCandidates(data['candidate'])
        setDestinations(data['destination'])
      }))
  
    }
    return positions
  }



  return (
    <div className="App">
      <Navbar handleChange={handleChange} handleSubmit={handleSubmit}/>
      <div class="py-2">
        <button type='button' class="inline-block text-lg px-4 py-2 mx-8 leading-none border rounded text-black border-black hover:border-transparent hover:text-white hover:bg-red-400 mt-10 lg:mt-0"
            onClick={() => previousFC()}
          >Previous Set</button>
        <span class="mx-4 text-lg">{currentFCCount+1}/{flashCards.length} </span>
        <button type='button' class="inline-block text-lg px-4 py-2 mx-8 leading-none border rounded text-black border-black hover:border-transparent hover:text-white hover:bg-green-400 mt-10 lg:mt-0"
          onClick={() => nextFC()}
        >Next Set</button>
      </div>
      <span class="fas fa-camera"></span>
      <div class="grid grid-cols-2 w-2/3 gap-5">
        <SideBar moves={flashCards} count={currentFCCount} step={currentCount}/>
        <Board class="items-center" positions={positions} candidates={candidate} destinations={destination}/>
      </div>
      <div class="">
        <button type='button' class="inline-block text-lg px-4 py-2 mx-8 leading-none border rounded text-black border-black hover:border-transparent hover:text-white hover:bg-red-400 mt-10 lg:mt-0"
              onClick={() => previousStep()}
            >Step Backward</button>
        <span class="mx-4 text-lg">{currentCount+1}/4</span>
        <button type='button' class="inline-block text-lg px-4 py-2 mx-8 leading-none border rounded text-black border-black hover:border-transparent hover:text-white hover:bg-green-400 mt-4 lg:mt-0"
          onClick={() => nextStep()}
        >Step Forward</button>
      </div>

    </div >
  );
}

export default App;
