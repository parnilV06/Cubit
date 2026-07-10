const { calculatePB, calculateMean, calculateAO5, calculateAO12 } = require('./kpis');

const calculateSolveTrend = (sessions) => {
    return sessions.map((session, index) => {
        const name = session.name || `Session ${index + 1}`;
        return {
            sessionId: session.id,
            sessionName: name,
            pb: calculatePB(session.solves),
            mean: calculateMean(session.solves),
            ao5: calculateAO5(session.solves),
            ao12: calculateAO12(session.solves)
        };
    });
};

module.exports = {
    calculateSolveTrend
};
