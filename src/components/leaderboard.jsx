const existing = JSON.parse(localStorage.getItem("leaderboard")) || []


return (
    <div>
        <p>Showing top 5 best results:</p>
        <p> {existing.length > 0 ? existing.slice(0, 5).join(", ") : "No results found."} </p>
    </div>
)

export default Leaderboard