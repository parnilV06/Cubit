const { calculatePB } = require('./kpis');

const calculateBestProgress = (sessions) => {
    let currentPB = Infinity;
    return sessions.map((session, index) => {
        const name = session.name || `Session ${index + 1}`;
        const sessionPB = calculatePB(session.solves);
        
        if (sessionPB !== null && sessionPB < currentPB) {
            currentPB = sessionPB;
        }
        
        return {
            sessionId: session.id,
            sessionName: name,
            bestTime: currentPB === Infinity ? null : currentPB
        };
    }).filter(s => s.bestTime !== null);
};

module.exports = {
    calculateBestProgress
};
