import { useState } from "react";
import dice1 from '../assets/dice-six-faces-one.png';
import dice2 from '../assets/dice-six-faces-two.png';
import dice3 from '../assets/dice-six-faces-three.png';
import dice4 from '../assets/dice-six-faces-four.png';
import dice5 from '../assets/dice-six-faces-five.png';
import dice6 from '../assets/dice-six-faces-six.png'

const diceImages = [null, dice1, dice2, dice3, dice4, dice5, dice6];

/*const Dice = () => {

  const silmaluvut = Array.of(2,3,5,4,2);

  const nopat = silmaluvut.map((e,idx) => <Die key={idx} value={e} />)
  return (
    <div className='diceContainer'>
      {nopat}
    </div>
  )
}

const Die = (props) => {

  return (
    <p>The dice value: {props.diceValue}</p>
  )

}*/

function Die({ value, held, onClick }) {
  const styles = {
   

  };

  let dice = dice1

  if (value === 2) {
    dice = dice2;
  } else if (value === 3) {
    dice = dice3;
  } else if (value === 4) {
    dice = dice4;
  } else if (value === 5) {
    dice = dice5;
  } else if (value === 6) {
    dice = dice6;
  }


  return (
    <div className="die"
      style={{
      cursor: "pointer",
      width: "120px",
      height: "120px",
      border: held ? "6px solid #ff8c00" : "2px solid #ccc", //Oranssi reunus valitulle nopalle
    }} 
    onClick={value === 0 ? undefined : onClick} >
      
    {value >= 1 && value <= 6 && (
        <img
          src={diceImages[value]}
          alt={`noppa näyttää ${value}`}
          className="dice"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      )}
    </div>

    /*onClick={onClick}>
      <img src={dice} className="dice" />
    </div>*/
  );
}

export default Die