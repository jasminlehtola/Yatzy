import { useState } from "react"
import * as bootstrap from "bootstrap"
import '../index.css'


function saveLeaderboard(newScore) {
  const existing = JSON.parse(localStorage.getItem("leaderboard")) || []

  existing.push(newScore)
  existing.sort((a, b) => b.score - a.score)
  const top5 = existing.slice(0, 5)

  localStorage.setItem("leaderboard", JSON.stringify(top5))
}


const StartGame = () => {
  return (
    <div id="startgame">
      <button class="menuButton" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Start game</button>
      <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title fs-5">Set players</h2>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Set 1-4 player names.</p>
              <form id="playerForm">
                <div class="mb-3 row">
                  <label for="player1" class="col-sm-2 col-form-label">Player 1</label>
                  <div class="col-sm-7">
                    <input class="form-control" id="player1" type="text" placeholder="Set Player 1's name" />
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="player2" class="col-sm-2 col-form-label">Player 2</label>
                  <div class="col-sm-7">
                    <input class="form-control" id="player2" type="text" placeholder="Set Player 2's name" />
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="player3" class="col-sm-2 col-form-label">Player 3</label>
                  <div class="col-sm-7">
                    <input class="form-control" id="player3" type="text" placeholder="Set Player 3's name" />
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="player4" class="col-sm-2 col-form-label">Player 4</label>
                  <div class="col-sm-7">
                    <input class="form-control" id="player4" type="text" placeholder="Set Player 4's name" />
                  </div>
                </div>
                <button type="submit" class="btn btn-primary">Start game</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const EndGame = () => {
  return (
    <div id="endgame">
      <button class="menuButton" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">End game</button>
      <div class="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title fs-5" id="exampleModalToggleLabel">Ending game</h2>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Are you ready to end the game and save results?</p>
              <button
                class="btn btn-primary"
                onClick={() => saveLeaderboard({ name: "Player 1", score: 100 })}
                data-bs-target="#exampleModalToggle2"
                data-bs-toggle="modal"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title fs-5" id="exampleModalToggleLabel2">Game ended</h2>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>The winner is Player 1 with 100 points. Congratulations!<br /><br />Thank you for playing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Leaderboard = () => {
  return (
    <div id="leaderboard">
      <button type="button" class="menuButton" data-bs-toggle="modal" data-bs-target="#exampleModal">Leaderboard</button>
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Leaderboard</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Showing top 5 best results:</p>
              <p><strong>1st Player 1 100p<br />2nd Player 2 90p<br />3rd Player 3 80p</strong><br />4th Player 4 70p<br />5th ---</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Menu = () => {
  return (
    <div className="menu">
      <h1 id="yatzy">Yatzy</h1>
      <div className="menu">
        <StartGame />
        <EndGame />
        <Leaderboard />
      </div>
    </div>
  )
}

export default Menu