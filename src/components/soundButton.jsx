import { useRef, useEffect } from "react"
import buttonclick from "../assets/buttonclick.mp3"

const SoundButton = ({ onClick, children, ...props }) => {
    const clickSoundRef = useRef(new Audio(buttonclick))

    useEffect(() => {
        clickSoundRef.current.volume = 0.2
    }, [])

    const handleClick = (e) => {
        const audio = clickSoundRef.current
        audio.currentTime = 0
        audio.play()

        onClick?.(e)
    }

    return (
        <button {...props}
            onClick={handleClick}>
            {children}
        </button>
    )
}

export default SoundButton