class Functions {
    //constructor
    constructor(name) {
        this.name = name;
    }

    //generates a positive random number given some upper limit
    randNum(upperLim) {
        return Math.floor(Math.random() * upperLim) + 1;
    }
}

//used to keep progress from previous games
function storeCard() {
    //look into using json or some other storage type
}

module.exports = Functions;