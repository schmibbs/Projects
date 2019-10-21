const Discord = require('discord.js');              //create a variable (using kw 'const') to get node modules from discord.js
const FuncOBJ = require('./functions.js');
const { prefix, token} = require('./config.json');  //puts properties from config so that you can use the values defined there
const client = new Discord.Client(); 
const funcs = new FuncOBJ("testName");
const dummyVal = -777;

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
        for (i in 5) {
            message.channel.send("test:" + i + "you rolled: " + funcs.randNumTest(20));
        }
    }
})

//actually logging in; can use token property instead of inputting it here; safer
client.login(token);    