import { useState, useRef, useEffect } from 'react'
import './index.css'
import * as bootstrap from 'bootstrap'
import buttonclick from './assets/buttonclick.mp3'
//import dicethrow from './assets/dicethrow.mp3'
import diceThrowSound from './assets/diceThrowSound.mp3'
import Dice from './components/diceRoll.jsx'
import Scoreboard from './components/scoreboard'
import Menu from './components/menu.jsx'
import categories from './data/categories'
import { calculateGrandTotal } from './utils/calculateScores'

const App = () => {
  const throwSoundRef = useRef(new Audio(diceThrowSound))
  const clickSoundRef = useRef(new Audio(buttonclick))

  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("yatzyGame")
    return saved ? JSON.parse(saved).players : ["Player 1", "Player 2", "Player 3", "Player 4"]
  })
  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem("yatzyGame")
    return saved ? JSON.parse(saved).scores : {}
  })
  const diceRef = useRef()


  useEffect(() => {
    throwSoundRef.current.volume = 1 // volume adjustment for dice throw sound
  }, [])

  useEffect(() => {
    clickSoundRef.current.volume = 0.3 // volume adjustment for button click sound
  }, [])

  // Saves to localStorage everytime when players or scores change
  useEffect(() => {
    const data = {
      players,
      scores
    }

    localStorage.setItem("yatzyGame", JSON.stringify(data))
    console.log("Game state saved to localStorage.")
  }, [players, scores])


  const saveToLeaderboard = () => {
    const saved = localStorage.getItem("yatzyLeaderboard")
    const leaderboard = saved ? JSON.parse(saved) : []

    players.forEach((player, index) => {
      const score = calculateGrandTotal(scores, index)

      leaderboard.push({
        name: player,
        score: score
      })
    })

    leaderboard.sort((a, b) => b.score - a.score)

    localStorage.setItem(
      "yatzyLeaderboard",
      JSON.stringify(leaderboard.slice(0, 5))
    )
  }

  // Resets the game state and clears localStorage
  const handleEndGame = () => {
    saveToLeaderboard()
    setScores({})
    setPlayers(["Player 1", "Player 2", "Player 3", "Player 4"])
    localStorage.removeItem("yatzyGame")
  }

  const handleThrow = () => {
    if (diceRef.current && diceRef.current.isRolling()) {
      return
    }
    throwSoundRef.current.currentTime = 0
    throwSoundRef.current.play()

    diceRef.current?.roll()
    console.log("Dice were rolled!")
  }


  const handleEndTurn = () => {
    if (diceRef.current) {
      diceRef.current.reset()          // nollaa heitot + nopat
    }
    console.log("Turn over")
  }


  return (
    <div className="game" id="game">
      <Menu
        setPlayers={setPlayers}
        onEndGame={handleEndGame}
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
            <button onClick={handleThrow} id="throwButton"> Throw </button>
          </div>
          <div className="diceContainer">
            <Dice ref={diceRef} />
          </div>
          <div className="endTurnButton">
            <button onClick={handleEndTurn} id="endTurnButton"> End Turn </button>
          </div>
        </div>
      </div>
    </div >
  )
}


export default App

