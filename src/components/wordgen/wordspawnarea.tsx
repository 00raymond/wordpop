import fourLetterWords from "@/wordlist/fourl";
import React, {useState, useEffect, useRef} from "react";

interface Bubble {
    id: number;
    word: string;
    size: number;
    x: number;
    y: number;
    color: string;
    opacity: number;
    fadeOut: boolean;
}

interface SpawnAreaProps {
    inVal : string
    lives: number
    setLives: (lives: number | ((lives: number) => number)) => void;
    gameStarted: boolean
    setInVal: (inVal: string) => void
}

export default function SpawnArea({ gameStarted, setLives, lives, inVal, setInVal }: SpawnAreaProps) {
    const [timer, setTimer] = useState<number>(3000);
    const [speed, setSpeed] = useState<number>(7000);
    const [bubbles, setBubbles] = useState<Bubble[]>([]);

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (gameStarted) {
            // perform actions on the passed inVal instead of extracting from e.target.value.
            setInVal("")
        }

    }

    const endGame = () => {
        // destroy all bubbles, cancel timer, and end game
        if (bubbleInterval.current !== null) clearInterval(bubbleInterval.current);
        if (sizeInterval.current !== null) clearInterval(sizeInterval.current);
        if (fadeOutInterval.current !== null) clearInterval(fadeOutInterval.current);

        setBubbles([]);
        setLives(0);
    }

    const bubbleInterval = useRef<NodeJS.Timeout | null>(null);
    const sizeInterval = useRef<NodeJS.Timeout | null>(null);
    const fadeOutInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {

        bubbleInterval.current = setInterval(() => {
            const word = fourLetterWords[Math.floor(Math.random() * fourLetterWords.length)];
            const x = Math.random() * 60;
            const y = Math.random() * 60;
            const newBubble = { id: Date.now(), word, size: 10, x, y, color:"white", opacity:1, fadeOut: false};
            setBubbles(bubbles => [...bubbles, newBubble]);
        }, timer);

        return () => { if (bubbleInterval.current) clearInterval(bubbleInterval.current); }
    }, [timer]);

    useEffect(() => {
        sizeInterval.current = setInterval(() => {
            setBubbles(currentBubbles => {
                return currentBubbles.map(bubble => {
                    if (bubble.size < 70) {
                        return {...bubble, size: bubble.size + 1};
                    } else if (!bubble.fadeOut) {
                        setLives(prevLives => {
                            if (prevLives - 0.5 <= 0) {
                                console.log("game ended.")
                                endGame();
                            }
                            return prevLives - 0.5;
                        });
                        return {...bubble, color: "red", fadeOut: true, opacity: 0.99};
                    }
                    return bubble;
                }).filter(bubble => !bubble.fadeOut || bubble.opacity > 0);
            });
        }, speed / 100);

        return () => {
            if (sizeInterval.current) clearInterval(sizeInterval.current);
        };
    }, [speed, setLives]);


    useEffect (() => {
    // Additional interval to decrement opacity for fading out
    fadeOutInterval.current = setInterval(() => {
        setBubbles(bubbles => bubbles.map(bubble => {
            if (bubble.fadeOut && bubble.opacity > 0) {
                return { ...bubble, opacity: bubble.opacity - 0.05 }; // Decrease opacity gradually
            }
            return bubble;
        }));
    }, 50); // Adjust the interval for how quickly the fade-out occurs
    return () => {
        if (fadeOutInterval.current) clearInterval(fadeOutInterval.current);
    };
}, [setBubbles])

    return (
        <div className="fixed flex flex-col justify-center items-center space-y-4" style={{ height: "100vh", width: "100vw" }}>
            <div className={"relative flex flex-col justify-center items-center space-y-4"} style={{ width: "75vw", height: "75vh", overflow: "hidden"}}>
            {bubbles.map(bubble => (
                <div key={bubble.id} style={{
                    position: 'absolute',
                    top: `${bubble.y}vh`,
                    left: `${bubble.x}vw`,
                    fontSize: `${bubble.size}px`,
                    transition: 'font-size 0.1s ease',
                    color: `${bubble.color}`,
                    opacity: `${bubble.opacity}`,
                }}>
                    {bubble.word}
                </div>
            ))}
            </div>
        </div>
    );
}