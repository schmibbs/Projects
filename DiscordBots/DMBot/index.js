const Discord = require('discord.js');              //create a variable (using kw 'const') to get node modules from discord.js
const FuncOBJ = require('./functions.js');
const DieOBJ = require('./die.js');
const { prefix, token} = require('./config.json');  //puts properties from config so that you can use the values defined there
const client = new Discord.Client(); 
const funcs = new FuncOBJ("testName");
const die_1 = new DieOBJ(1, 20);
const critResponses = ["https://i.imgur.com/dhMeAzK.gif", "C R I T", "Critical Roll!!", "less goooooooooo"];
const lossResponses = [":b:ruh", "i cri everytiem", "I can't believe you've done this", "get rekt"];
var basicLimit = 20;
var dieArr = [];
var response;

//boot msg
client.once('ready', () => {
    console.log('DM is ready!')
})

//reads messages people put into text channels
client.on('message', message => {
    //console.log(message.content);   //just prints it to the console

    if(message.content.startsWith(prefix + "msg")) {
        message.channel.send("printing generic test message");
    }

    if (message.content.startsWith(prefix + "roll")) {
        var rollRes = die_1.standardRoll(basicLimit);
        message.channel.send("You rolled: " + rollRes);
        if (rollRes == 20)
            message.channel.send(critResponses[Math.floor(Math.random() * critResponses.length)]);
        else if (rollRes == 1)
            message.channel.send(lossResponses[Math.floor(Math.random() * lossResponses.length)]);
    }

    if (message.content.startsWith(prefix + "setdie")) {
        var argIndex = 9;
        //console.log("Len--> " + message.content.length);
        if (message.content.length - argIndex <= 0) {
            message.channel.send("You need to tell me what you want! Enter die like this..\n\nAmount interval max, Amount interval max, Amou..");
        }
        else {
            var arg = message.content.substring(argIndex);
            console.log("\nDie data\n--------\nAmount: " + parseInt(arg) + "\nInterval: " + parseInt(arg.substring(2)) + "\nLimit: " + parseInt(arg.substring(4)));
            for (argIndex; argIndex < message.content.length; argIndex++) {
                //arg = message.content.substring(argIndex);
                console.log(arg);
                //just iterate past the comma
                if (arg[argIndex] == ',') {
                    if (arg[argIndex + 1] == ' ') {
                        argIndex++;
                    }
                }        
                //check if index is at an number and parse the arguments if so
                else if (!isNaN(message.content[argIndex])){    
                    var amtOfDiceToMake = parseInt(arg);
                    var interval = parseInt(arg.substring(2));
                    var limit = parseInt(arg.substring(4));
                    for (var i = 0; i < amtOfDiceToMake; i++) {
                        dieArr.push(new DieOBJ(interval, limit));
                    }
                    //move to the final digit to get ready for the next batch of args
                    var j = 0;
                    while (arg[j] != ',' && j < message.content.length)
                        j++;
                    if (arg[j+1] == ' ')
                        j++;
                    j++;
                    arg = arg.substring(j);
                    argIndex += j;
                }
            }
            message.channel.send("Finished creating the dice!");
        }
    }

    if (message.content.startsWith(prefix + "checkDie")) {
        message.channel.send("The following dies are in play");
        if (dieArr[0] == null) {
            message.channel.send("There are no dice. Add some by typing this\n\">>setdie amount interval max, amount interval max, amo..\"");
        }
        else {
            for (die in dieArr)
                message.channel.send("Die number " + (+die + 1) + ": (" + dieArr[die].getInterval() + ", " + dieArr[die].getLimit() + ")");
            message.channel.send("Finished listing all of the dice in play");
        }
    }
})

//actually logging in; can use token property instead of inputting it here; safer
client.login(token);    