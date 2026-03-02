


const [dice, setDice] = useState([
  { id: 1, value: 0, held: false },
  { id: 2, value: 0, held: false },
  { id: 3, value: 0, held: false },
  { id: 4, value: 0, held: false },
  { id: 5, value: 0, held: false },
]);

function rollDice() {
  setDice(prev =>
    prev.map(die =>
      die.held
        ? die                              // pidetty → sama arvo
        : { ...die, value: Math.floor(Math.random() * 6) + 1 }
    )
  );
}

function toggleHold(id) {
  setDice(prev =>
    prev.map(die =>
      die.id === id ? { ...die, held: !die.held } : die
    )
  );
}

/**
 * 
 * 
 * 
 * 
 * Main Yatzy{
 *
 * <Create game>
 * Game game = new Game;
 *
 * <Ask player names>
 * game.addPlayer(input)
 *
 * <Create dice>
 * Die one = new Die;
 * ...
 * Die five = new Die;
 *
 * <<Loop>>
 *
 * <Choose player>
 * game.getPlayer
 *
 * <Throw dice>
 * for (three times){
 *     for (go through dice) {
 *         if (die != locked) {
 *             Die.throwDie;
 *         }
 *     }
 *     ask to lock or rethrow
 *     if (third throw OR wants to record score) {
 *         select point category and setCategory = input
 *     }
 * }
 * class Die
 * int value = 0;
 * boolean locked = false;
 *
 * throwDie{value = rand between 1-6}
 *
 * lockDie{locked = true}
 *
 * unlockDie{locked = false}
 *
 *
 *
 * class Game
 * HashMap(String, Int) scores;
 * boolean finished = false;
 *
 * addPlayer{scores.add(playername, 0)}
 *
 * updateScore{scores.get(playername) = newscore}
 *
 * getPlayers{scores.getKeys}
 *
 * getScores{scores.getValues}
 *
 * endGame{finished = true}
 *
 *
 *
 * class Scorecard
 * scorecard[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
 *
 * setOnes{scorecard[0] = score}
 *
 * setPair{scorecard[5] = score}
 *
 * setYatzy{scorecard[14] = score}
 *
 *
 *
 * 
 *
 * <</Loop>>
 *
 * <End game>
 * Present scores and winner
 * }
 */