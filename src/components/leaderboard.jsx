const saved = localStorage.getItem("yatzyLeaderboard")
const leaderboard = saved ? JSON.parse(saved) : []



const Leaderboard = () => {
    return (
        <div>
            <p>Showing top 5 best results:</p>
            <p> test </p>

        </div>
    )
}

export default Leaderboard