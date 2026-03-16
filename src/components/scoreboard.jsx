import { useState, Fragment } from "react"

// TODO: muuta myöhemmin Player-otsikot päivittymään pelaajien syöttämillä nimillä
// TODO: tallenna peli localstorageen
// TODO: lisää hover info bonuksen päälle, joka kertoo pistemäärästä 63 tai enemmän

const Scoreboard = ({ players, categories, scores, setScores }) => {
  const [editingCell, setEditingCell] = useState(null)

  // Blocks already filled cells. If a value already exists -> block editing
  // If the score is null or undefined -> allow editing
  const handleCellClick = (category, playerIndex) => {
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
    console.log(`Clicked on category: ${category}, player index: ${playerIndex}`)
    setEditingCell(null)
  }


  // Helper function to calculate the total score for the upper section for a given player
  const calculateUpperTotal = (scores, playerIndex) => {
    let upperTotal = 0
    upperTotal += scores["Ones"]?.[playerIndex] || 0
    upperTotal += scores["Twos"]?.[playerIndex] || 0
    upperTotal += scores["Threes"]?.[playerIndex] || 0
    upperTotal += scores["Fours"]?.[playerIndex] || 0
    upperTotal += scores["Fives"]?.[playerIndex] || 0
    upperTotal += scores["Sixes"]?.[playerIndex] || 0

    return upperTotal
  }

  // Helper function to calculate the bonus points if player has 63 or more points in the upper section
  const calculateBonus = (total) => {
    return total >= 63 ? 50 : 0
  }

  // Helper function to calculate the grand total score for a given player
  const calculateGrandTotal = (scores, playerIndex) => {
    const upperTotal = calculateUpperTotal(scores, playerIndex)
    const bonus = calculateBonus(upperTotal)

    let lowerTotal = 0
    lowerTotal += scores["Pair"]?.[playerIndex] || 0
    lowerTotal += scores["Two pair"]?.[playerIndex] || 0
    lowerTotal += scores["Three of a kind"]?.[playerIndex] || 0
    lowerTotal += scores["Four of a kind"]?.[playerIndex] || 0
    lowerTotal += scores["Small straight"]?.[playerIndex] || 0
    lowerTotal += scores["Large straight"]?.[playerIndex] || 0
    lowerTotal += scores["Full house"]?.[playerIndex] || 0
    lowerTotal += scores["Chance"]?.[playerIndex] || 0
    lowerTotal += scores["Yatzy"]?.[playerIndex] || 0

    return upperTotal + bonus + lowerTotal
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
            <div className={`cell category ${category === "TOTAL" || category === "BONUS" || category === "TOTAL SCORE" ? "calculated" : ""}`}>
              {category}
            </div>

            {players.map((_, playerIndex) => {
              const isEditing =
                editingCell?.category === category &&
                editingCell?.playerIndex === playerIndex

              return (
                <div
                  key={playerIndex}
                  className={`cell ${category === "TOTAL" || category === "BONUS" || category === "TOTAL SCORE" ? "calculated" : ""}`}
                  onClick={() => {
                    if (!isEditing) handleCellClick(category, playerIndex)
                  }}
                  onDoubleClick={() => {
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