const Leaderboard = () => {
    const saved = localStorage.getItem("yatzyLeaderboard")
    const leaderboard = saved ? JSON.parse(saved) : []

    return (
        <div>
            <p>Showing top 5 best results:</p>
            {leaderboard.length === 0 ? (
                <p>No results yet</p>
            ) : (
                leaderboard.map((entry, index) => (
                    <div key={index}>
                        {index + 1}. {entry.name} — {entry.score}
                    </div>
                ))
            )}
        </div>
    )
}

export default Leaderboard