import './App.css'



/*
** Menupalkki:
Start-nappi
End-nappi
Leaderboard-nappi

** Taulukko:
taulukko[rivi][pelaaja]

taulukko = [
  [null, null, null, null, null],  // Ykköset
  [null, null, null, null, null],  // Kakkoset
  ...
  [null, null, null, null, null]   // Yatzy
]

Tarkistus, onko kategoria jo käytetty (ei voi lisätä samaan kahteen kertaan):
käytetyt_kategoriat[pelaaja]


** Pelialue

*/










/**
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
 *
 * <</Loop>>
 *
 * <End game>
 * Present scores and winner
 * }
 */