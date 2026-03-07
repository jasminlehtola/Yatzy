import { useState, Fragment } from "react"

// TODO: lisää muokkausmahdollisuus (tuplaklikkauksella?) soluihin, joissa on jo arvo (jos menee vahingossa väärin)
// TODO: muuta myöhemmin Player-otsikot päivittymään pelaajien syöttämillä nimillä

const Scoreboard = ({ players, categories, scores, setScores }) => {
  const [editingCell, setEditingCell] = useState(null)


  const handleCellClick = (category, playerIndex) => {
    // Block already filled cells. If a value already exists -> block editing
    // If the score is null or undefined -> allow editing
    if (category === "TOTAL" || category === "BONUS") return
    if (scores[category]?.[playerIndex] != null) return

    setEditingCell({ category, playerIndex })

  }

  const saveValue = (category, playerIndex, value) => {
    const points = Number(value)
    if (isNaN(points)) return

    const newScores = { ...scores }

    if (!newScores[category]) {
      newScores[category] = [null, null, null, null]
    }

    newScores[category][playerIndex] = points
    setScores(newScores)
    console.log(`Clicked on category: ${category}, player index: ${playerIndex}`)
    setEditingCell(null)
  }


  // Helper function to calculate the total score for the upper section for a given player
  const calculateUpperTotal = (scores, playerIndex) => {
    let total = 0
    total += scores["Ones"]?.[playerIndex] || 0
    total += scores["Twos"]?.[playerIndex] || 0
    total += scores["Threes"]?.[playerIndex] || 0
    total += scores["Fours"]?.[playerIndex] || 0
    total += scores["Fives"]?.[playerIndex] || 0
    total += scores["Sixes"]?.[playerIndex] || 0
    return total
  }

  // Helper function to calculate the bonus points if player has 63 or more points in the upper section
  const calculateBonus = (total) => {
    return total >= 63 ? 50 : 0
  }


  // Helper function to get the value to display in each cell, including calculated totals and bonuses
  const getCellValue = (category, playerIndex) => {
    // TOTAL row
    if (category === "TOTAL") {
      return calculateUpperTotal(scores, playerIndex)
    }

    // BONUS row
    if (category === "BONUS") {
      const total = calculateUpperTotal(scores, playerIndex)
      return calculateBonus(total)
    }

    // Normal categories
    return scores[category]?.[playerIndex] ?? ""
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
            <div className={`cell category ${category === "TOTAL" || category === "BONUS" ? "calculated" : ""}`}>
              {category}
            </div>

            {players.map((_, playerIndex) => {
              const isEditing =
                editingCell?.category === category &&
                editingCell?.playerIndex === playerIndex

              return (
                <div
                  key={playerIndex}
                  className={`cell ${category === "TOTAL" || category === "BONUS" ? "calculated" : ""}`}
                  onClick={() => {
                    if (!isEditing) handleCellClick(category, playerIndex)
                  }}
                  onDoubleClick={() => {
                    if (category === "TOTAL" || category === "BONUS") return
                    setEditingCell({ category, playerIndex })
                  }}
                >
                  {isEditing ? (
                    <input
                      type="number"
                      defaultValue={scores[category]?.[playerIndex] ?? ""}
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
                    getCellValue(category, playerIndex)
                  )}
                </div>
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
export default Scoreboard