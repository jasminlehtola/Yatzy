import { useState } from 'react';




const handleCellClick = (category, playerIndex) => {
  const newScores = { ...scores };
  if (!newScores[category]) {
    newScores[category] = [null, null, null, null];
  }
  newScores[category][playerIndex] = 10;
  setScores(newScores);
};


const Scoreboard = ({ players, categories, scores }) => {
    return (
        <div>
            <div className="grid-table">
                <div className="cell header">Category</div>
                <div className="cell header">Player 1</div>
                <div className="cell header">Player 2</div>
                <div className="cell header">Player 3</div>
                <div className="cell header">Player 4</div>

                {categories.map((category) => (
                    <>
                        <div className="cell category">{category}</div>

                        {players.map((playerIndex) => (
                            <div
                                key={playerIndex}
                                className="cell"
                                onClick={() => handleCellClick(category, playerIndex)}
                            >
                            </div>
                        ))}
                    </>
                ))}
            </div>
        </div>
    )
}



export default Scoreboard