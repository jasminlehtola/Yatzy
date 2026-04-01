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
    lowerTotal += scores["3 of a kind"]?.[playerIndex] || 0
    lowerTotal += scores["4 of a kind"]?.[playerIndex] || 0
    lowerTotal += scores["Small straight"]?.[playerIndex] || 0
    lowerTotal += scores["Large straight"]?.[playerIndex] || 0
    lowerTotal += scores["Full house"]?.[playerIndex] || 0
    lowerTotal += scores["Chance"]?.[playerIndex] || 0
    lowerTotal += scores["Yatzy"]?.[playerIndex] || 0

    return upperTotal + bonus + lowerTotal
}

export { calculateUpperTotal, calculateBonus, calculateGrandTotal }