import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Card = ({ cardImage, isVisible }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        if (isVisible) {
            // Start the flip animation when the card becomes visible
            cardRef.current.classList.add('flip');
            setTimeout(() => {
                cardRef.current.classList.remove('flip');
            }, 1000); // Adjust the timing based on your animation duration
        }
    }, [isVisible]);

    return (
        <div className="card-container">
            <motion.div
                ref={cardRef}
                className="card"
            >
                <img src={cardImage} alt="Card" className="card-image" />
            </motion.div>
        </div>
    );
};

export default Card;
