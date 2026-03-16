import { useState } from "react"
import * as bootstrap from "bootstrap"
import '../index.css'

const StartGame = () => {
    const setPlayers = (e) => {
            e.preventDefault()

            const formData = new FormData(document.getElementById("playerForm"))

            const players = [
                formData.get("player1"),
                formData.get("player2"),
                formData.get("player3"),
                formData.get("player4")
            ]

            console.log(players)
        }

    return (
        <div id="startgame">
            <button className="menuButton" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Start game</button>
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2 className="modal-title fs-5">Set players</h2>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                            <input className="form-control" name="player4" type="text" placeholder="Set Player 4's name" />
                          </div>
                        </div>
                        <button onClick={setPlayers} type="submit" className="btn btn-primary">Start game</button>
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
            <button className="menuButton" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">End game</button>
            <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2 className="modal-title fs-5" id="exampleModalToggleLabel">Ending game</h2>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <p>Are you ready to end the game and save results?</p>
                    <button className="btn btn-primary" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">Confirm</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2 className="modal-title fs-5" id="exampleModalToggleLabel2">Game ended</h2>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <p>The winner is Player 1 with 100 points. Congratulations!<br/><br/>Thank you for playing.</p>
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
            <button type="button" className="menuButton" data-bs-toggle="modal" data-bs-target="#exampleModal">Leaderboard</button>
            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Leaderboard</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <p>Showing top 5 best results:</p>
                    <p><strong>1st Player 1 100p<br/>2nd Player 2 90p<br/>3rd Player 3 80p</strong><br/>4th Player 4 70p<br/>5th ---</p>
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
                <OpenLeaderboard />
            </div>
        </div>
    )
}

export default Menu