import { forwardRef, useImperativeHandle, useState, useRef, useEffect, useCallback } from "react";
import Die from "./die.jsx";

const Dice = forwardRef((_, ref) => {

  const [dice, setDice] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      value: 6,
      held: false,
    }))
  );

  const [rollsLeft, setRollsLeft] = useState(3);
  const [rolling, setRolling] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [keyboardMode, setKeyboardMode ] = useState(false);

  const dieRefs = useRef([]);   // Set ref for each die
  const containerRef = useRef(null);

  const rollDice = () => {
    if (rollsLeft <= 0) return;
    setRolling(true)
    setKeyboardMode(false);

    // changes (unheld) dice values during the animation
    const interval = setInterval(() => {
      setDice(prev =>
        prev.map(die =>
          die.held
            ? die
            : { ...die, value: Math.floor(Math.random() * 6) + 1 }
        )
      )
    }, 300)

    setTimeout(() => {
      clearInterval(interval)

      setDice(prev =>
        prev.map(die =>
          die.held
            ? die                              // True -> lock a die
            : { ...die, value: Math.floor(Math.random() * 6) + 1 } // False -> reroll
        )
      );

      setRollsLeft((prev) => prev - 1);
      setRolling(false);
      setKeyboardMode(true); 
      setFocusedIndex(0);
      if (containerRef.current){
        containerRef.current.focus();
      }
    }, 2000);
  }

  const resetDice = () => {
    setRollsLeft(3)
    setDice(
      Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        value: 6,
        held: false,
      }))
    )
    setFocusedIndex(0);
    setKeyboardMode(false);
  }

  useImperativeHandle(ref, () => ({
    roll: rollDice,
    reset: resetDice,
    isRolling: () => rolling
  })
  );

  const toggleHold = (index) => {
    if (rollsLeft === 3 || rolling) return; //Prevents to locking the dices before the first roll

    setDice((prev) =>
      prev.map((die, i) =>
        i === index ? { ...die, held: !die.held } : die
      )
    );
  }
  // Choose a die with keyboard: arrow buttons + enter
    const handleKeyDown = useCallback((event) => {
      if (rolling) return;

      if (event.key === 'ArrowLeft'||event.key === 'ArrowRight') {
        setKeyboardMode(true);
      }

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % 5);
          break;

        case 'ArrowLeft':
          event.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + 5) % 5);
          break;

        case 'Enter': //Hold a die
          event.preventDefault();
          toggleHold(focusedIndex);
          break;

        default:
          break;
      }
    }, [rolling, focusedIndex, toggleHold]);

    useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      container.tabIndex = 0;
    }

    return () => {
      if (container) {
        container.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [handleKeyDown]);

  // Siirrä fokus automaattisesti valittuun noppaan
  useEffect(() => {
    if (keyboardMode && dieRefs.current[focusedIndex]) {
      dieRefs.current[focusedIndex].focus();
  }}, [focusedIndex, keyboardMode]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div ref={containerRef} className="diceContainer" tabIndex = {0}>
        {dice.map((die, index) => (
          <Die
            key={die.id}
            ref={(el) => (dieRefs.current[index]=el)}
            value={die.value}
            held={die.held}
            onClick={() => {
              toggleHold(index);
              setKeyboardMode(false);
              }
            }
            rolling={rolling}
            isFocused={keyboardMode && index===focusedIndex}
          />
        )
        )
        }
      </div>
      <p style={{
        marginTop: "12px",
        fontWeight: "bold",
        color: rollsLeft === 0 ? "red" : "#333"
      }}>
        Rolls left: {rollsLeft} / 3
      </p>
    </div>
  );

});

export default Dice