import { useState, useRef, useEffect } from 'react'
import './index.css'
import * as bootstrap from 'bootstrap'
import { motion, AnimatePresence } from "framer-motion"
import buttonclick from './assets/buttonclick.mp3'
import diceThrowSound from './assets/diceThrowSound.mp3'
import Dice from './components/diceRoll.jsx'
import Scoreboard from './components/scoreboard'
import Menu from './components/menu.jsx'
import categories from './data/categories'
import { calculateGrandTotal } from './utils/calculateScores'
import SoundButton from './components/SoundButton.jsx'
import Info from './components/info.jsx'

const App = () => {
  const throwSoundRef = useRef(new Audio(diceThrowSound))
  const clickSoundRef = useRef(new Audio(buttonclick))
  const [currentPlayer, setCurrentPlayer] = useState(() => {
    const saved = localStorage.getItem("yatzyGame")
    return saved ? JSON.parse(saved).currentPlayer ?? 0 : 0
  })

  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("yatzyGame")
    return saved ? JSON.parse(saved).players : ["", "", "", ""]
  })
  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem("yatzyGame")
    return saved ? JSON.parse(saved).scores : {}
  })
  const diceRef = useRef()

  const gameOngoing = players.some(p => p && p.trim() !== "")

  useEffect(() => {
    throwSoundRef.current.volume = 1 // volume adjustment for dice throw sound
  }, [])

  useEffect(() => {
    clickSoundRef.current.volume = 0.3 // volume adjustment for button click sound
  }, [])

  // Saves to localStorage everytime when players, scores or turn changes
  useEffect(() => {
    const data = {
      players,
      scores,
      currentPlayer
    }

    localStorage.setItem("yatzyGame", JSON.stringify(data))
    console.log("Game state saved to localStorage.")
  }, [players, scores, currentPlayer])


  // Saves the current game result to the leaderboard in localStorage
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
    setPlayers(["", "", "", ""])
    setCurrentPlayer(0)
    localStorage.removeItem("yatzyGame")
  }

  const handleThrow = () => {
    if (diceRef.current?.getRollsLeft?.() === 0) return
    if (diceRef.current?.isRolling?.()) return

    throwSoundRef.current.currentTime = 0
    throwSoundRef.current.play()

    diceRef.current?.roll()
    console.log("Dice were rolled!")
  }

  const handleEndTurn = () => {
    if (diceRef.current) {
      diceRef.current.reset()          // resets throws and dice
    }
    setCurrentPlayer((prev) => {
      const currentIndexInActive = activePlayers.findIndex(p => p.index === prev)
      const nextPlayer = activePlayers[(currentIndexInActive + 1) % activePlayers.length]
      return nextPlayer.index
    })
    console.log("Turn over")
  }

  // Filter out active players for turn rotation
  const activePlayers = players
    .map((p, i) => ({ name: p, index: i }))
    .filter(p => p.name && p.name.trim() !== "")


  // Keyboard shortcuts for throwing dice and ending turn
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.tagName === 'INPUT' || //Prevent throwing when the input area is activated.
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable) {
        return;
      }
      if (event.key === ' ') {
        event.preventDefault(); //Prevent scrolling the page
        handleThrow();
      }
      else if (event.key.toLowerCase() === 'e') {
        event.preventDefault()
        handleEndTurn()
      }
    };
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    };
  }, [handleThrow], [handleEndTurn])


  return (
    <div className="game" id="game">
      <Info />
      <Menu
        setPlayers={setPlayers}
        onEndGame={handleEndGame}
        gameOngoing={gameOngoing}
        players={players}
        scores={scores}
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
          <div className="currentPlayer">
            Turn:{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={currentPlayer}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                style={{ display: "inline-block" }}
              >
                <strong>{players[currentPlayer]}</strong>
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="throwButton">
            <SoundButton onClick={handleThrow} id="throwButton" > Throw (Space) </SoundButton>
          </div>
          <div className="diceContainer">
            <Dice ref={diceRef} />
          </div>
          <div className="endTurnButton">
            <SoundButton onClick={handleEndTurn} id="endTurnButton"> End Turn (E) </SoundButton>
          </div>
        </div>
      </div>
    </div >
  )
}


export default App

