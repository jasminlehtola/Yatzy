import { useState } from "react";

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
      {value || "?"}
    </div>
  );
}

