const getValidTime = (solve) => {
    if (solve.penalty === 'DNF') return null;
    if (solve.penalty === 'PLUS_TWO') return solve.time + 2000;
    return solve.time;
};

const getValidSolves = (solves) => {
    return solves
        .map(s => ({ ...s, validTime: getValidTime(s) }))
        .filter(s => s.validTime !== null);
};

const formatTime = (ms) => {
    if (ms === null) return null;
    return Number((ms / 1000).toFixed(3));
};

const calculatePB = (solves) => {
    const valid = getValidSolves(solves);
    if (valid.length === 0) return null;
    return formatTime(Math.min(...valid.map(s => s.validTime)));
};

const calculateMean = (solves) => {
    const valid = getValidSolves(solves);
    if (valid.length === 0) return null;
    const sum = valid.reduce((acc, curr) => acc + curr.validTime, 0);
    return formatTime(Math.round(sum / valid.length));
};

const calculateAoX = (solves, x) => {
    const valid = getValidSolves(solves);
    if (valid.length < x) return null;
    const latest = valid.slice(-x).map(s => s.validTime);
    latest.sort((a, b) => a - b);
    const middle = latest.slice(1, -1);
    const sum = middle.reduce((acc, curr) => acc + curr, 0);
    return formatTime(Math.round(sum / middle.length));
};

const calculateAO5 = (solves) => calculateAoX(solves, 5);
const calculateAO12 = (solves) => calculateAoX(solves, 12);

module.exports = {
    getValidTime,
    getValidSolves,
    calculatePB,
    calculateMean,
    calculateAO5,
    calculateAO12
};
