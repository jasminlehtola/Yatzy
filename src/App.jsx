import Dice from './components/dice'
import Scoreboard from './scoreboard'
import dicesix from './assets/dice-six-faces-six.png'

const App = () => (
  <div class="game">
    <div class="menu">
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
    <div class="dice">
      <Dice />
  <img src = {dicesix} className = "dice"/>
  </div>
    <div class="scoreboard">
    </div>
  <div>
    <Scoreboard />
  </div>
  </div>
)

export default App