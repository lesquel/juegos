const centerSprite = (tileSize, spriteSize) => (tileSize - spriteSize) / 2;
const calculateScore = (timeLeft, deathsNo) => {
    const timeScoreRatio = 1 - ((13.00 - timeLeft) / 13.00);
    const timeScore = Math.round(100 * (1 + timeScoreRatio));
    const deathsScore = deathsNo < 10 ? Math.round(100 - (deathsNo * 10)) : 0;
    
    return deathsScore + timeScore;
}

const setBestScore = (score) => {
    localStorage.setItem('m13e::bestScore', score);
};

const getBestScore = () => {
    return localStorage.getItem('m13e::bestScore');
};

export {
    setBestScore,
    getBestScore,    
    calculateScore,
    centerSprite
};
