import { useState, useRef, useEffect } from 'react'
import '../index.css'
import Leaderboard from './leaderboard'
import backgroundmusic from '../assets/backgroundmusic.mp3'
import endgamesound from '../assets/endgamesound.mp3'
import SoundButton from './SoundButton.jsx'
import { calculateGrandTotal } from '../utils/calculateScores'

const StartGame = ({ setPlayers, playBgaudio }) => {
  const handleSetPlayers = (e) => {
    e.preventDefault()

    const formData = new FormData(document.getElementById("playerForm"))

    const players = [
      formData.get("player1"),
      formData.get("player2"),
      formData.get("player3"),
      formData.get("player4")
    ]

    setPlayers(players)
    console.log(players)
    playBgaudio()
  }

  return (
    <div id="startgame">
      <SoundButton className="menuButton" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        Start game
      </SoundButton>
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5">Set players</h2>
              <SoundButton onClick={playBgaudio} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
              </SoundButton>
            </div>
            <div className="modal-body">
              <p>Set 1-4 player names.</p>
              <form id="playerForm">
                <div className="mb-3 row">
                  <label htmlFor="player1" className="col-sm-2 col-form-label">Player 1</label>
                  <div className="col-sm-7">
                    <input className="form-control" name="player1" type="text" placeholder="Set Player 1's name" />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label htmlFor="player2" className="col-sm-2 col-form-label">Player 2</label>
                  <div className="col-sm-7">
                    <input className="form-control" name="player2" type="text" placeholder="Set Player 2's name" />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label htmlFor="player3" className="col-sm-2 col-form-label">Player 3</label>
                  <div className="col-sm-7">
                    <input className="form-control" name="player3" type="text" placeholder="Set Player 3's name" />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label htmlFor="player4" className="col-sm-2 col-form-label">Player 4</label>
                  <div className="col-sm-7">
                    <input className="form-control" name="player4" type="text" placeholder="Set Player 4's name" disabled />
                  </div>
                </div>
                <SoundButton onClick={handleSetPlayers} type="button" className="btn btn-primary" data-bs-dismiss="modal">
                  Start game
                </SoundButton>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const EndGame = ({ onEndGame, stopBgaudio, playEndgameaudio, winner }) => {
  return (
    <div id="endgame">
      <SoundButton className="menuButton" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">
        End game
      </SoundButton>
      <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
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
                onClick={() => {
                  stopBgaudio()
                  playEndgameaudio()
                }}
                data-bs-toggle="modal"
                data-bs-target="#exampleModalToggle2"
              >
                Confirm
              </SoundButton>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
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
      <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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

const Menu = ({ setPlayers, onEndGame, players, scores }) => {
  const [gameOngoing, setGameOngoing] = useState(false) // Tällä pitäisi saada Start- ja End-nappulat disabled vuorollaan
  const bgAudioRef = useRef(null)
  const endGameAudioRef = useRef(new Audio(endgamesound))

  useEffect(() => {
    bgAudioRef.current = new Audio(backgroundmusic)
    bgAudioRef.current.volume = 0.4 // volume adjustment for background music
    bgAudioRef.current.loop = true
  }, [])

  useEffect(() => {
    endGameAudioRef.current.volume = 0.2 // volume adjustment for end game sound
  }, [])

  const playBgaudio = () => {
    const audio = bgAudioRef.current
    if (!audio || !audio.paused) return
    audio.currentTime = 0
    audio.play()
    console.log("playing bg audio", bgAudioRef.current)
  }

  const stopBgaudio = () => {
    const audio = bgAudioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
  }

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
        <StartGame setPlayers={setPlayers} playBgaudio={playBgaudio} />
        <EndGame onEndGame={onEndGame} stopBgaudio={stopBgaudio} playEndgameaudio={playEndgameaudio}
          winner={winner} />
        <OpenLeaderboard />
      </div>
    </div>
  )
}

export default Menu