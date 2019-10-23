const Discord = require('discord.js');              //create a variable (using kw 'const') to get node modules from discord.js
const FuncOBJ = require('./functions.js');
const DieOBJ = require('./die.js');
const { prefix, token} = require('./config.json');  //puts properties from config so that you can use the values defined there
const client = new Discord.Client(); 
const funcs = new FuncOBJ("testName");
const die_1 = new DieOBJ(1, 6);
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
    else if (message.content.startsWith(prefix + "roll")) {
        
        /*
        if (basicLimit == NaN || basicLimit == null){
            message.channel.send("Would you like to use multiple dies?");
            if (message.content.startsWith("y", 0) || message.content.startsWith("Y", 0)) {
                message.channel.send("Enter the amount of dies, interval, and top limit of those dies seperated by spaces and seperate sets with commas." +
                "\n\nEX 2 1 6, 1 10 100 will make 2 standard dies and 1 that goes to 100 in intervals of 10");

                var amt;
                var interval;
                var limit;
                for (var i = 0; i < message.content.length; i++) {
                    //set the amount of die
                    //set the interval
                    //set the upper limit
                    //push to dieArr
                    //look for comma to see if there are more die
                    //restart from top o/w done setting die and can roll the set
                }
            }
            else {
                message.channel.send("Set the upper limit of what to roll from");
                basicLimit = parseInt(message.content);
            }
        }
        */
        var rollRes = die_1.standardRoll(basicLimit);
        message.channel.send("You rolled: " + rollRes);
        if (rollRes == 20)
            message.channel.send(critResponses[Math.floor(Math.random() * critResponses.length)]);
        else if (rollRes == 1)
            message.channel.send(lossResponses[Math.floor(Math.random() * lossResponses.length)]);
    }
})

//actually logging in; can use token property instead of inputting it here; safer
client.login(token);    