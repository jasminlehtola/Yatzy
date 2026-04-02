import { useState, useRef, useEffect } from 'react'
import * as bootstrap from 'bootstrap'
import SoundButton from '../components/SoundButton.jsx'
import backgroundmusic from '../assets/backgroundmusic.mp3'

const Info = () => {
  useEffect(() => {
    const shouldHide = localStorage.getItem("hideInfoModal")

    if (!shouldHide) {
      const modalElement = document.getElementById("infoModal")
      const modal = new bootstrap.Modal(modalElement)
      modal.show()
    }
  }, [])

  const bgAudioRef = useRef(null)
  useEffect(() => {
    bgAudioRef.current = new Audio(backgroundmusic)
    bgAudioRef.current.volume = 0.1 // volume adjustment for background music
    bgAudioRef.current.loop = true
  }, [])
  const playBgaudio = () => {
    const audio = bgAudioRef.current
    if (!audio || !audio.paused) return
    audio.currentTime = 0
    audio.play()
    console.log("playing bg audio", bgAudioRef.current)
  }

  return (
    <div className="modal fade" id="infoModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5">Welcome to play Yatzy!</h2>
            <SoundButton onClick={() => {
              playBgaudio()
              localStorage.setItem("hideInfoModal", "true")
            }} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">
            <p><strong>How to play Yatzy</strong></p>
            <p>Each player throws dice on their turn and try to get the best possible score on their scoreboard.
              On 1st throw of the turn the player throws all 5 dice. You may rethrow your dice up to twice if you
              want. On rethrows you can lock dice to keep them as they are or unlock them to rethrow them.</p>
            <p>Record your score to whichever category you want once you are happy with your dice or when you have
              thrown dice three times. If your thrown dice cannot give any score, you record 0 points to whichever
              category you want and that is still free. Once score is set for a category, it cannot be changed.</p>
            <p>Game ends once each player has filled their scorecard. Player with the highest score wins.</p>
            <div class="alert alert-secondary">
              <p><strong>Bonus:</strong> By scoring at least 61 points from the upper categories, you receive 50 bonus
                points.</p>
              <p><strong>Small straight:</strong> 1-2-3-4-5 (15 points).</p>
              <p><strong>Large straight:</strong> 2-3-4-5-6 (20 points).</p>
              <p><strong>Chance:</strong> Any set of dice.</p>
              <p><strong>Yatzy:</strong> Five same of any number (50 points).</p>
            </div>
            <p><strong>Controls</strong></p>
            <p>Start your game from the top right. Insert 2-4 player names and you're ready to play. Throw your dice
              by pressing "Throw" or with <span class="badge text-bg-secondary">spacebar</span>. You can lock and
              unlock the dice by clicking them with your mouse. End turn by pressing the button or with
              <span class="badge text-bg-secondary">E</span> from keyboard.</p>
            <p>Remember to mark your score in the scorecard at the end of your turn. If you accidentally entered the
              wrong value, you can edit it by double-clicking the cell.</p>
            <p>When you are ready to finish your
              game, press "End game" from top right. You can check the leaderboard from top right as well.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Info