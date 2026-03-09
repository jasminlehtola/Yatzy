import { useState } from "react";
import dice1 from '../assets/dice-six-faces-one.png';
import dice2 from '../assets/dice-six-faces-two.png';
import dice3 from '../assets/dice-six-faces-three.png';
import dice4 from '../assets/dice-six-faces-four.png';
import dice5 from '../assets/dice-six-faces-five.png';
import dice6 from '../assets/dice-six-faces-six.png'

/*const Die = (props) => {

  return (
    <p>The dice value: {props.diceValue}</p>
  )

}*/
export default function Die({ value, held, onClick }) {
  const styles = {
    /*backgroundColor: held ? "#f0c674" : "#eee",
    width: "60px",
    height: "60px",
    fontSize: "2.4rem",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #333",
    borderRadius: "8px",
    cursor: "pointer",
    userSelect: "none",
    boxShadow: held ? "0 0 10px rgba(0,0,0,0.4)" : "none",
    */

  };

  return (
    <div style={styles} onClick={onClick}>
      <img src={dice6} className="dice" />
    </div>
  );
}

