class Functions {
    //constructor
    constructor(name) {
        this.name = name;
    }

    //helper function to see if some key was found in an array
    finder(word, arr) {
        for (i in arr) {
            if (arr[i] == word) {
                return true;
            }
        }
        return false;
    }

    //takes a string and returns the index right before a seperating space
    tokenizer(str, startIdx, endIdx) {
        var blanksArr = [];
        var tokenArr = [];
        blanksArr.push(startIdx);
        for (var i = startIdx; i < endIdx; i++) {
            if (str[i] == ' ') {
                blanksArr.push(i + 1);
            }
        }
        /*
        console.log("the indinces after blank spaces are ");
        for (var spot in blanksArr)
            console.log(blanksArr[spot] + " ");

        console.log("\nthe actual tokens are..")
        */
        for (var word = 0; word < blanksArr.length; word++) {
            var start = blanksArr[word];
            var end = blanksArr[word + 1];
            //console.log(str.substring(start, end));
            if (end > start)
                tokenArr.push(str.substring(start, end-1));
            else
            tokenArr.push(str.substring(start, end));
        }   
        return tokenArr;
    }
}

//used to keep progress from previous games
function storeCard() {
    //look into using json or some other storage type
}

module.exports = Functions;