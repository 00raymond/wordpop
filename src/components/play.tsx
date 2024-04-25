import {RefObject, useEffect, useRef, useState} from "react";
import SpawnArea from "@/components/wordgen/wordspawnarea";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;

interface PlayAreaProps {
    typingFocused: boolean,
    setTypingFocused: (typingFocused: boolean) => void
    inputRef: RefObject<HTMLInputElement>
}

export default function PlayArea({typingFocused, setTypingFocused, inputRef}: PlayAreaProps) {

    const [inVal, setInVal] = useState<string>("")
    const [gameStarted, setGameStarted] = useState<boolean>(false)
    const [centerContent, setCenterContent] = useState<any>(<h1 className={"text-2xl font-semibold font-mono animate-pulse"}>Type <span className={"text-blue-300"}>start</span> to begin</h1>)
    const [lives, setLives] = useState<number>(3)

    const startGame = () => {
        console.log("setting spawn area")
        setCenterContent(<SpawnArea gameStarted={gameStarted} setInVal={setInVal} setLives={setLives} lives={lives}  inVal={inVal} />)
    }

    const handleTyping = (e: any) => {
        if(!gameStarted) {
            if (e.target.value === "start") {
                setGameStarted(true)
                setInVal("")
                startGame()
                return
            }
        }
        setInVal(e.target.value)
    }

    useEffect(() => {

        const handleKeyDown = (event: KeyboardEvent) => {
            if (inputRef.current && document.activeElement !== inputRef.current) {
                inputRef.current.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [inputRef]);


    return (
        <div className={""}>
            <div className={"w-[300px] h-[300px] justify-center items-center flex"}>
                {centerContent}
            </div>
            <div className={" flex fixed inset-x-0 justify-center bottom-0 text-center space-x- pb-16 "}>
                <input
                    ref={inputRef}
                    onFocus={() => setTypingFocused(true)}
                    onBlur={() => setTypingFocused(false)}
                    onChange={handleTyping}
                    value={inVal}
                    className={`${typingFocused ? 'bg-opacity-30' : 'bg-opacity-40'} transition-all duration-200 font-mono w-96 text-4xl p-7 bg-blue-400 rounded-lg text-white`}
                />
            </div>
        </div>
    )
}