const { calculatePB, calculateMean } = require('./kpis');

const calculateRecentSessions = (sessions) => {
    const sorted = [...sessions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return sorted.map((session) => {
        const originalIndex = sessions.findIndex(s => s.id === session.id);
        const name = session.name || `Session ${originalIndex + 1}`;
        
        return {
            sessionId: session.id,
            sessionName: name,
            puzzleType: session.puzzleType,
            solveCount: session.solves.length,
            best: calculatePB(session.solves),
            average: calculateMean(session.solves),
            createdAt: session.createdAt
        };
    });
};

module.exports = {
    calculateRecentSessions
};
