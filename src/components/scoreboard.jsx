import { useState, Fragment } from "react"
import { calculateUpperTotal, calculateBonus, calculateGrandTotal } from "../utils/calculateScores"
import confetti from "canvas-confetti"


const Scoreboard = ({ players, categories, scores, setScores }) => {
  const [editingCell, setEditingCell] = useState(null)

  // Blocks already filled cells. If a value already exists -> block editing
  // If the score is null or undefined -> allow editing
  const handleCellClick = (category, playerIndex) => {
    if (!players[playerIndex]) return
    if (category === "TOTAL" || category === "BONUS" || category === "TOTAL SCORE") return
    if (scores[category]?.[playerIndex] != null) return

    setEditingCell({ category, playerIndex })
  }

  // Saves the value entered by the user and updates the scores state
  const saveValue = (category, playerIndex, value) => {
    const points = Number(value)
    if (isNaN(points)) return

    const newScores = { ...scores }

    if (!newScores[category]) {
      newScores[category] = [null, null, null, null]
    }

    newScores[category][playerIndex] = points
    setScores(newScores)

    if (category === "Yatzy" && points === 50) {
      miniConfetti()
    }
    console.log(`Clicked on category: ${category}, player index: ${playerIndex}`)
    setEditingCell(null)
  }


  // Helper function to get the value to display in each cell, including calculated totals and bonuses
  const getCellValue = (category, playerIndex) => {
    if (category === "TOTAL") {
      return calculateUpperTotal(scores, playerIndex)
    }

    if (category === "BONUS") {
      const total = calculateUpperTotal(scores, playerIndex)
      return calculateBonus(total)
    }

    if (category === "TOTAL SCORE") {
      return calculateGrandTotal(scores, playerIndex)
    }

    return scores[category]?.[playerIndex] ?? ""
  }

  // launches small confetti when player scores a Yatzy
  function miniConfetti() {
    confetti({
      particleCount: 50,
      spread: 70,
      scalar: 0.8,
      origin: { y: 0.9, x: 0.25 }
    })
  }


  return (
    <div>
      <div className="grid-table">
        <div className="cell header">Category</div>
        <div className="cell header">{players[0]}</div>
        <div className="cell header">{players[1]}</div>
        <div className="cell header">{players[2]}</div>
        <div className="cell header">{players[3]}</div>

        {categories.map((category) => (
          <Fragment key={category}>
            <div className={`cell category ${category === "TOTAL" || category === "BONUS" || category === "TOTAL SCORE" ? "calculated" : ""}`}>
              {category}
            </div>

            {players.map((_, playerIndex) => {
              const isActivePlayer = players[playerIndex]

              const isEditing =
                editingCell?.category === category &&
                editingCell?.playerIndex === playerIndex

              return (
                <div
                  key={playerIndex}
                  className={`cell 
                    ${!players[playerIndex] ? "disabled" : ""}
                    ${category === "TOTAL" || category === "BONUS" || category === "TOTAL SCORE" ? "calculated" : ""}
                  `}
                  onClick={() => {
                    if (!isActivePlayer) return
                    if (!isEditing) handleCellClick(category, playerIndex)
                  }}
                  onDoubleClick={() => {
                    if (!isActivePlayer) return
                    if (category === "TOTAL" || category === "BONUS" || category === "TOTAL SCORE") return
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