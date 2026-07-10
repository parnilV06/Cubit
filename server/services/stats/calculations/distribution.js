const { getValidTime } = require('./kpis');

const calculateTimeDistribution = (solves) => {
    const buckets = {
        '<6': 0,
        '6-8': 0,
        '8-10': 0,
        '10-12': 0,
        '>12': 0,
        'DNF': 0
    };
    
    solves.forEach(solve => {
        if (solve.penalty === 'DNF') {
            buckets['DNF']++;
            return;
        }
        
        const time = getValidTime(solve);
        const timeInSeconds = time / 1000;
        
        if (timeInSeconds < 6) buckets['<6']++;
        else if (timeInSeconds < 8) buckets['6-8']++;
        else if (timeInSeconds < 10) buckets['8-10']++;
        else if (timeInSeconds < 12) buckets['10-12']++;
        else buckets['>12']++;
    });
    
    return Object.keys(buckets).map(key => ({
        range: key,
        count: buckets[key]
    }));
};

module.exports = {
    calculateTimeDistribution
};
