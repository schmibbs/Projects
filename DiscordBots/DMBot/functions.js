class Functions {
    //constructor
    constructor(name) {
        console.log("launched functions obj");
        this.name = name;
    }
}
//generates a positive random number given some upper limit
function randNum(upperLim) {
    return Math.random() * upperLim;
}

//test to see which Math function to apply to random result
function randNumTest(upperLim) {
    console.log('RES using floor(): ' + Math.floor(this.randNum(upperLim)));
    console.log('RES using ceiling(): ' + Math.ceil(this.randNum(upperLim)));
}

//used to keep progress from previous games
function storeCard() {
    //look into using json or some other storage type
}

module.exports = Functions, randNum, randNumTest;