class Functions {
    //constructor
    constructor(name) {
        this.name = name;
    }

    //generates a positive random number given some upper limit
    randNum(upperLim) {
        return Math.floor(Math.random() * upperLim) + 1;
    }

    waitPls(str, desiredResponse) {
        if (str == desiredResponse) {
            return true;
        }
        else {
            return false;
        }
    }

    //takes a string and returns the index right before a seperating space
    tokenizer(str, startIdx, endIdx) {
        var blanksArr = [];
        for (var i = startIdx; i < endIdx; i++) {
            if (str[i] == ' ') {
                blanksArr.push(i+1);
            }
        }

        console.log("the indinces after blank spaces are ");
        for (var spot in blanksArr)
            console.log(blanksArr[spot] + " ");

        console.log("\nthe actual tokens are..")
        var start = 0
        var end = blanksArr[0];
        for (var word in blanksArr) {
            console.log(str.substring(start, end));
            start = end;
            end = blanksArr[word];
        }
        return 0;
    }
}

//used to keep progress from previous games
function storeCard() {
    //look into using json or some other storage type
}

module.exports = Functions;