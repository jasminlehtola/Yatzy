import { useState, useRef, useEffect } from 'react'
import '../index.css'
import Leaderboard from './leaderboard'
import backgroundmusic from '../assets/backgroundmusic.mp3'
import endgamesound from '../assets/endgamesound.mp3'
import SoundButton from './SoundButton.jsx'
import { calculateGrandTotal } from '../utils/calculateScores'
import confetti from "canvas-confetti"
import { motion } from 'framer-motion'

const StartGame = ({ gameOngoing, setPlayers }) => {
  const [formPlayers, setFormPlayers] = useState(["", "", "", ""]) // local state to manage form inputs

  const handleSetPlayers = (e) => {
    e.preventDefault()

    const players = [
      formPlayers[0],
      formPlayers[1],
      formPlayers[2],
      formPlayers[3]
    ]

    setPlayers(players)
    console.log(players)
    setFormPlayers(["", "", "", ""])
  }

  const handleChange = (index, value) => {
    const updated = [...formPlayers]
    updated[index] = value
    setFormPlayers(updated)
  }

  return (
    <div id="startgame">
      <motion.div
        animate={
          !gameOngoing
            ? { scale: [1, 1.20, 1] }
            : {}
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <SoundButton
          disabled={gameOngoing}
          className="menuButton"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
        >
          Start game
        </SoundButton>
      </motion.div>
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5">Set players</h2>
              <SoundButton type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <p>Set 2-4 player names.</p>
              <form key={gameOngoing ? "playing" : "new"}>
                <div className="mb-3 row">
                  <label htmlFor="player1" className="col-sm-2 col-form-label">Player 1</label>
                  <div className="col-sm-7">
                    <input className="form-control" name="player1" type="text" value={formPlayers[0]} onChange={(e) => handleChange(0, e.target.value)} placeholder="Set Player 1's name" />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label htmlFor="player2" className="col-sm-2 col-form-label">Player 2</label>
                  <div className="col-sm-7">
                    <input className="form-control" name="player2" type="text" value={formPlayers[1]} onChange={(e) => handleChange(1, e.target.value)} placeholder="Set Player 2's name" />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label htmlFor="player3" className="col-sm-2 col-form-label">Player 3</label>
                  <div className="col-sm-7">
                    <input className="form-control" name="player3" type="text" value={formPlayers[2]} onChange={(e) => handleChange(2, e.target.value)} placeholder="Set Player 3's name" disabled={!formPlayers[0] || !formPlayers[1]} />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label htmlFor="player4" className="col-sm-2 col-form-label">Player 4</label>
                  <div className="col-sm-7">
                    <input className="form-control" name="player4" type="text" value={formPlayers[3]} onChange={(e) => handleChange(3, e.target.value)} placeholder="Set Player 4's name" disabled={!formPlayers[2]} />
                  </div>
                </div>
              </form>
              <SoundButton onClick={handleSetPlayers} type="button" className="btn btn-primary" data-bs-dismiss="modal">Start game</SoundButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const EndGame = ({ gameOngoing, onEndGame, playEndgameaudio, winner }) => {
  function winAnimation() {
    confetti({
      particleCount: 250,
      spread: 80,
      origin: { y: 0.6 },
    })
  }

  return (
    <div id="endgame">
      <SoundButton disabled={!gameOngoing} className="menuButton" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">
        End game
      </SoundButton>
      <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5" id="exampleModalToggleLabel">Ending game</h2>
              <SoundButton type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
              </SoundButton>
            </div>
            <div className="modal-body">
              <p>Are you ready to end the game and save the results?</p>
              <SoundButton
                className="btn btn-primary"
                onClick={() => { playEndgameaudio(), winAnimation()}}
                data-bs-toggle="modal"
                data-bs-target="#exampleModalToggle2"
              >
                Confirm
              </SoundButton>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5" id="exampleModalToggleLabel2">Game ended</h2>
              <SoundButton type="button" className="btn-close" data-bs-dismiss="modal" onClick={onEndGame} aria-label="Close">
              </SoundButton>
            </div>
            <div className="modal-body">
              <p>
                {winner ? (
                  <>
                    The winner is <strong>{winner.name}</strong> with{" "}
                    <strong>{winner.score}</strong> points. Congratulations!
                    <br /><br />
                    Thank you for playing.
                  </>
                ) : (
                  "No winner yet"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const OpenLeaderboard = () => {
  return (
    <div id="openLeaderboard">
      <SoundButton type="button" className="menuButton" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Leaderboard
      </SoundButton>
      <div className="modal fade" id="exampleModal" tabindex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Leaderboard</h1>
              <SoundButton type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
              </SoundButton>
            </div>
            <div className="modal-body">
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>
      <div className="modal-body">

      </div>
    </div>
  )
}

const Menu = ({ setPlayers, onEndGame, gameOngoing, players, scores }) => {
  const endGameAudioRef = useRef(new Audio(endgamesound))

  useEffect(() => {
    endGameAudioRef.current.volume = 0.2 // volume adjustment for end game sound
  }, [])

  const playEndgameaudio = () => {
    const audio = endGameAudioRef.current

    audio.currentTime = 0
    audio.play()
  }

  const getWinner = () => {
    if (!players || players.length === 0) return null
    let bestScore = -1
    let winnerName = ""

    players.forEach((player, index) => {
      const score = calculateGrandTotal(scores, index)

      if (score > bestScore) {
        bestScore = score
        winnerName = player
      }
    })
    if (bestScore < 0) return null

    return { name: winnerName, score: bestScore }
  }

  const winner = getWinner()


  return (
    <div className="menu">
      <h1 id="yatzy">Yatzy</h1>
      <div className="menu">
        <StartGame gameOngoing={gameOngoing} setPlayers={setPlayers} />
        <EndGame gameOngoing={gameOngoing} onEndGame={onEndGame} playEndgameaudio={playEndgameaudio}
          winner={winner} />
        <OpenLeaderboard />
      </div>
    </div>
  )
}

export default Menu