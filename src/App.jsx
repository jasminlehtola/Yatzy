

import { useState, useEffect } from 'react';
import './index.css'
import categories from './data/categories'
import players from './data/players'

import Dice from './components/die'
import Scoreboard from './components/scoreboard'
import dicesix from './assets/dice-six-faces-six.png'

const App = () => {
  //const [players, setPlayers] = useState([]) 
  //const [categories, setCategories] = useState([])
  const [scores, setScores] = useState({})


  return (
    <div className="game">
      <div className="menu">
        <button id="start">
          <p>Start game</p>
        </button>
        <button id="end">
          <p>End game</p>
        </button>
        <button id="leaderboard">
          <p>Leaderboard</p>
        </button>

    </div>
      <div className="scoreboard">
        <Scoreboard
          players={players}
          categories={categories}
          scores={scores}
          setScores={setScores}
        />
      </div>
    <div class="dice">
      <Dice />
  <img src = {dicesix} className = "dice"/>
  </div>

    </div>

  )
}

export default App