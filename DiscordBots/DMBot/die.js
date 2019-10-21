class Die {
    //constructor
    constructor(interval, limit) {
        this.interval = interval;
        this.limit = limit;
    }

    //used when you are rolling a number from 1..n in single digit increments
    standardRoll(limit){
        return Math.floor(Math.random() * limit) + 1;
    }

    //used when you are rolling a number with some interval > 1
    //works by generating a random num lower than the limit, dividing by the limit, flooring the result
    //and multiplying by the limit to properly scale it 
    intervalRoll(interval, limit){
        var initialRandNum = (Math.floor(Math.random() * limit) + 1) / interval;  
        return Math.floor(initialRandNum) * interval;   
    }
}

module.exports = Die;