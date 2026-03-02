

// muuta myöhemmin Player-otsikot päivittymään pelaajien syöttämillä nimillä
const Scoreboard = ({ players, categories, scores, setScores }) => {

    const handleCellClick = (category, playerIndex) => {
        const newScores = { ...scores }
        if (!newScores[category]) {
            newScores[category] = [null, null, null, null]
        }
        if (newScores[category][playerIndex] !== null) return

        newScores[category][playerIndex] = 10
        setScores(newScores)
        console.log(`Clicked on category: ${category}, player index: ${playerIndex}`)
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
                    <>
                        <div className="cell category">{category}</div>

                        {players.map((_, playerIndex) => (
                            <div
                                key={playerIndex}
                                className="cell"
                                onClick={() => handleCellClick(category, playerIndex)}
                            >
                                {scores[category]?.[playerIndex] ?? ''}
                            </div>
                        ))}
                    </>
                ))}
            </div>
        </div>
    )
}



export default Scoreboard