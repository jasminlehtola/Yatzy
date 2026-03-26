import { useState } from "react";
import { motion } from "framer-motion";
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

function Die({ value, held, onClick, rolling }) {
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
    <motion.div
      className={`die ${held ? "held" : ""}`}
      onClick={value === 0 ? undefined : onClick}

      animate={
        rolling && !held
          ? { rotate: [0, 2200] }
          : { rotate: 0 }
      }
      transition={
        rolling && !held
          ? {
            duration: 3.2,
            ease: "linear"
          }
          : {
            duration: 0.5,
            ease: "easeOut",
          }
      }
    >

      {value >= 1 && value <= 6 && (
        <img
          src={diceImages[value]}
          alt={`noppa näyttää ${value}`}
          className="dice"
        />
      )}
    </motion.div>
  )


  /*onClick={onClick}>
    <img src={dice} className="dice" />
  </div>*/

}

export default Die