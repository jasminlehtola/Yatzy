import { useState, useRef } from 'react'
import './index.css'
import categories from './data/categories'
import players from './data/players'
import Dice from './components/diceRoll.jsx'
import Scoreboard from './components/scoreboard'
import Menu from './components/menu.jsx'

const App = () => {
  const [players, setPlayers] = useState(["Player 1", "Player 2", "Player 3", "Player 4"])
  const [scores, setScores] = useState({})
  const diceRef = useRef()

  const handleThrow = () => {
    if (diceRef.current){
      diceRef.current?.roll()
    console.log("Dice were rolled!")
    }
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
            <button onClick={handleThrow} id="throwButton">
             
              Throw
            </button>
          </div>
          <div className="diceContainer">
            <Dice ref={diceRef}/>
          </div>
        </div>
      </div>
    </div >

  )
}

export default App