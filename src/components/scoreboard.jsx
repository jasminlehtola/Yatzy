import { useState, Fragment } from "react"

// muuta myöhemmin Player-otsikot päivittymään pelaajien syöttämillä nimillä
const Scoreboard = ({ players, categories, scores, setScores }) => {
    const [editingCell, setEditingCell] = useState(null)

    
    const handleCellClick = (category, playerIndex) => {
        // Block already filled cells. If a value already exists -> block editing
        // If the score is null or undefined -> allow editing
        if (scores[category]?.[playerIndex] != null) return

        setEditingCell({ category, playerIndex })

    }

    const saveValue = (category, playerIndex, value) => {
        const points = Number(value);
        if (isNaN(points)) return;

        const newScores = { ...scores };

        if (!newScores[category]) {
            newScores[category] = [null, null, null, null]
        }

        newScores[category][playerIndex] = points;
        setScores(newScores);
        console.log(`Clicked on category: ${category}, player index: ${playerIndex}`)
        setEditingCell(null);
    }




    return (
  <div>
    <div className="grid-table">
      <div className="cell header">Category</div>
      <div className="cell header">Player 1</div>
      <div className="cell header">Player 2</div>
      <div className="cell header">Player 3</div>
      <div className="cell header">Player 4</div>

      {categories.map((category) => (
        <Fragment key={category}>
          <div className="cell category">{category}</div>

          {players.map((_, playerIndex) => {
            const isEditing =
              editingCell?.category === category &&
              editingCell?.playerIndex === playerIndex

            return (
              <div
                key={playerIndex}
                className="cell"
                onClick={() => {
                  if (!isEditing) handleCellClick(category, playerIndex)
                }}
              >
                {isEditing ? (
                  <input
                    type="number"
                    autoFocus
                    onBlur={(e) =>
                      saveValue(category, playerIndex, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveValue(category, playerIndex, e.target.value)
                      }
                    }}
                  />
                ) : (
                  scores[category]?.[playerIndex] ?? ""
                )}
              </div>
            )
          })}
        </Fragment>
      ))}
    </div>
  </div>
);
}
export default Scoreboard