import fourLetterWords from "@/wordlist/fourl";
import React, { useState, useEffect } from "react";

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
    setLives: (lives: number) => void
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

    }

    useEffect(() => {
        const interval = setInterval(() => {
            const word = fourLetterWords[Math.floor(Math.random() * fourLetterWords.length)];
            const x = Math.random() * 60;
            const y = Math.random() * 60;
            const newBubble = { id: Date.now(), word, size: 10, x, y, color:"white", opacity:1, fadeOut: false};
            setBubbles(bubbles => [...bubbles, newBubble]);
        }, timer);

        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        const interval = setInterval(() => {
            setBubbles(bubbles => bubbles.map(bubble => {
                if (bubble.size < 70) {
                    return { ...bubble, size: bubble.size + 1 };
                } else if (!bubble.fadeOut) {
                    // Start the fade-out by setting a flag and changing color to red
                    return { ...bubble, color: "red", fadeOut: true };
                }
                return bubble;
            }));

            // Remove bubbles that have completed the fade-out
            return bubbles.filter(bubble => !bubble.fadeOut || bubble.opacity > 0);
        }, speed / 100);

        // Additional interval to decrement opacity for fading out
        const fadeOutInterval = setInterval(() => {
            setBubbles(bubbles => bubbles.map(bubble => {
                if (bubble.fadeOut && bubble.opacity > 0) {
                    return { ...bubble, opacity: bubble.opacity - 0.05 }; // Decrease opacity gradually
                }
                return bubble;
            }));
        }, 50); // Adjust the interval for how quickly the fade-out occurs

        return () => {
            clearInterval(interval);
            clearInterval(fadeOutInterval);
        };
    }, [speed, setBubbles]); // Only include dependencies directly used in the effect


    const checkBubble = (word: string) => {
        setBubbles(bubbles => bubbles.filter(bubble => bubble.word !== word));
    };

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