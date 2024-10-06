import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';

// Import sound files
import dealSound from '../sounds/deal.wav';  
import flipSound from '../sounds/flip.wav';  
import winSound from '../sounds/win.mp3';    

const GameTable = () => {
    const [player1, setPlayer1] = useState(null);
    const [player2, setPlayer2] = useState(null);
    const [roundResult, setRoundResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [winner, setWinner] = useState(null); 
    const [showWinNotification, setShowWinNotification] = useState(false);
    const [firstPlayerCardInfo, setFirstPlayerCardInfo] = useState('');
    const [secondPlayerCardInfo, setSecondPlayerCardInfo] = useState('');
    const [showFirstCardBack, setShowFirstCardBack] = useState(true); // Track first card state
    const [showSecondCardBack, setShowSecondCardBack] = useState(true); // Track second card state

    // Load sounds
    const dealSoundEffect = new Howl({ src: [dealSound] });
    const flipSoundEffect = new Howl({ src: [flipSound] });
    const winSoundEffect = new Howl({ src: [winSound] });

    // Fetch the initial deal
    const dealCards = async () => {
        setLoading(true);
        const response = await fetch('https://card-war-game-be.onrender.com/api/Deck/deal');
        const data = await response.json();
        
        dealSoundEffect.play();
        setPlayer1(data[0]);
        setPlayer2(data[1]);
        setLoading(false);
    };

    // Play a round and draw new cards
    const playRound = async () => {
        setLoading(true);
        flipSoundEffect.play();

        const response = await fetch('https://card-war-game-be.onrender.com/api/Deck/play', { method: 'POST' });
        const result = await response.json();

        const [firstPlayerCardRank, firstPlayerCardSuit] = result.firstPlayerCard.split(' of ');
        const [secondPlayerCardRank, secondPlayerCardSuit] = result.secondPlayerCard.split(' of ');

        const formatSuit = (suit) => suit[0];
        const formatRank = (rank) => (rank === '10' ? '0' : rank[0]);

        setFirstPlayerCardInfo(`${formatRank(firstPlayerCardRank)}${formatSuit(firstPlayerCardSuit)}`);
        setSecondPlayerCardInfo(`${formatRank(secondPlayerCardRank)}${formatSuit(secondPlayerCardSuit)}`);

        setPlayer1(result.players[0]);
        setPlayer2(result.players[1]);

        if (result.message.includes('First player wins')) {
            setWinner('Player 1');
        } else if (result.message.includes('Second player wins')) {
            setWinner('Player 2');
        } else {
            setWinner(null);
        }

        setRoundResult(result.message);
        setLoading(false);

        if (winner) {
            setShowWinNotification(true);
            setTimeout(() => {
                setShowWinNotification(false);
            }, 2000);  

            setTimeout(() => {
                winSoundEffect.play();
            }, 1000);
        }
    };

    const toggleFirstCard = () => {
        setShowFirstCardBack(!showFirstCardBack);
    };

    const toggleSecondCard = () => {
        setShowSecondCardBack(!showSecondCardBack);
    };

    useEffect(() => {
        dealCards();
    }, []);

    if (loading) return <div className="flex justify-center items-center"><ClipLoader color={"#ffffff"} size={50} /></div>;

    return (
        <div className="game-board container mx-auto p-6 text-center bg-gradient-to-b from-blue-500 to-indigo-700 h-1/2 flex flex-col items-center justify-center">
            <h1 className="text-5xl font-extrabold text-white mb-8 tracking-wide">War Card Game</h1>
    
            {/* Game Board */}
            <div className="flex justify-around mb-8 w-full max-w-3xl bg-white shadow-xl rounded-lg p-6">
                {/* Player 1's Info */}
                <div className="player-area flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Player 1</h2>
                    <p>Cards left: {player1?.deck.cards.length}</p>
                    {player1?.deck.cards.length === 0 && <p className="text-red-500">Player 1 has no cards!</p>}
                    <motion.img
                        src={showFirstCardBack ? 'https://www.deckofcardsapi.com/static/img/back.png' : `https://www.deckofcardsapi.com/static/img/${firstPlayerCardInfo}.png`}
                        alt="Player 1's card"
                        onClick={toggleFirstCard}
                        className="w-24 h-32 mt-2 transform hover:scale-105 transition-transform cursor-pointer"
                    />
                </div>

                {/* VS Divider */}
                <div className="flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">VS</span>
                </div>

                {/* Player 2's Info */}
                <div className="player-area flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Player 2</h2>
                    <p>Cards left: {player2?.deck.cards.length}</p>
                    {player2?.deck.cards.length === 0 && <p className="text-red-500">Player 2 has no cards!</p>}
                    <motion.img
                        src={showSecondCardBack ? 'https://www.deckofcardsapi.com/static/img/back.png' : `https://www.deckofcardsapi.com/static/img/${secondPlayerCardInfo}.png`}
                        alt="Player 2's card"
                        onClick={toggleSecondCard}
                        className="w-24 h-32 mt-2 transform hover:scale-105 transition-transform cursor-pointer"
                    />
                </div>
            </div>
    
            {/* Play Round Button */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex justify-center"
            >
                <button
                    onClick={playRound}
                    className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform"
                >
                    Play Round
                </button>
            </motion.div>
    
            {/* Round Result */}
            <motion.div
                className="round-result mt-4 bg-white shadow-lg rounded-lg p-4 text-xl font-semibold text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <p>{roundResult}</p>
            </motion.div>

            {/* Win Notification Modal */}
            {showWinNotification && (
                <motion.div
                    initial={{ opacity: 0, translateX: 100 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    exit={{ opacity: 0, translateX: 100 }}
                    className="absolute top-4 right-4 bg-green-500 text-white text-lg font-bold py-2 px-4 rounded-md shadow-md"
                >
                    {winner} Wins the Round!
                </motion.div>
            )}
        </div>
    );
};

export default GameTable;
