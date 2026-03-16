import { useState, useEffect } from 'react'
import './index.css'
import categories from './data/categories'
import players from './data/players'
import Dice from './components/die.jsx'
//import Dice from './components/diceRoll'
import Scoreboard from './components/scoreboard'
import Menu from './components/menu.jsx'

const App = () => {
  const [players, setPlayers] = useState(["Player 1", "Player 2", "Player 3", "Player 4"])
  const [scores, setScores] = useState({})


  const handleThrow = () => {
    console.log("Throw button clicked")
    diceRoll.rollDice()
  }


  return (
    <div className="game">
      <Menu
        setPlayers={setPlayers}
        scores={scores} setScores={setScores}
      />
      <div className="gameArea">
        <div className="scoreboard">
          <Scoreboard
            players={players}
            categories={categories}
            scores={scores}
            setScores={setScores}
          />
        </div>

        <div className="diceArea">
          <div className="throwButton">
            <throwButton onClick={handleThrow}>Throw</throwButton>
          </div>
          <div className="diceContainer">
            <Dice />
          </div>
        </div>
      </div>
    </div >

  )
}

export default App