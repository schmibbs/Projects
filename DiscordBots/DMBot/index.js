//requires
const Discord = require('discord.js');              //create a variable (using kw 'const') to get node modules from discord.js
const FuncOBJ = require('./functions.js');
const DieOBJ = require('./die.js');
const { prefix, token} = require('./config.json');  //puts properties from config so that you can use the values defined there
const skrim = require('./GamesData/SkyrimVillager.json');
const FileSys = require('fs');

//objects 
const client = new Discord.Client(); 
const funcs = new FuncOBJ("testName");
const d20 = new DieOBJ(1, 20);
const d12 = new DieOBJ(1, 12);
const d10 = new DieOBJ(1, 10);
const d8  = new DieOBJ(1, 8);
const d6  = new DieOBJ(1, 6);
const d4  = new DieOBJ(1, 4);

//useful variables
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
    var input  = message.content.toLocaleLowerCase();   //using to help guard against users mis-typing commands
    
    if(input.substring(0, 5) == prefix + "msg" || message.content.startsWith(prefix + "msg")) {
        message.channel.send("printing generic test message");
    }

    //used to roll a standard int from 1 to whatever basic limit is set to
    if (message.content.startsWith(prefix + "roll")) {
        var rollRes = d20.standardRoll(basicLimit);
        message.channel.send("You rolled: " + rollRes);
        if (rollRes == basicLimit)
            message.channel.send(critResponses[Math.floor(Math.random() * critResponses.length)]);
        else if (rollRes == 1)
            message.channel.send(lossResponses[Math.floor(Math.random() * lossResponses.length)]);
    }

    //rolls a standard d20 die(1..20)
    if (input.substring(0, 5) == prefix + "d20") {
        var rollRes = d20.standardRoll(20);
        message.channel.send("You rolled: " + rollRes);
        if (rollRes == d20.getLimit())
            message.channel.send(critResponses[Math.floor(Math.random() * critResponses.length)]);
        else if (rollRes == 1)
            message.channel.send(lossResponses[Math.floor(Math.random() * lossResponses.length)]);
    }

    //rolls a standard d12 die(1..12)
    if (input.substring(0, 5) == prefix + "d12") {
        var rollRes = d12.standardRoll(12);
        message.channel.send("You rolled: " + rollRes);
        if (rollRes == d12.getLimit())
            message.channel.send(critResponses[Math.floor(Math.random() * critResponses.length)]);
        else if (rollRes == 1)
            message.channel.send(lossResponses[Math.floor(Math.random() * lossResponses.length)]);
    }

    //rolls a standard d10 die(1..10)
    if (input.substring(0, 5) == prefix + "d10") {
        var rollRes = d10.standardRoll(10);
        message.channel.send("You rolled: " + rollRes);
        if (rollRes == d10.getLimit())
            message.channel.send(critResponses[Math.floor(Math.random() * critResponses.length)]);
        else if (rollRes == 1)
            message.channel.send(lossResponses[Math.floor(Math.random() * lossResponses.length)]);
    }

    //rolls a standard d8 die(1..8)
    if (input.substring(0, 4) == prefix + "d8") {
        var rollRes = d8.standardRoll(8);
        message.channel.send("You rolled: " + rollRes);
        if (rollRes == d8.getLimit())
            message.channel.send(critResponses[Math.floor(Math.random() * critResponses.length)]);
        else if (rollRes == 1)
            message.channel.send(lossResponses[Math.floor(Math.random() * lossResponses.length)]);
    }

    //rolls a standard d6 die(1..6)    
    if (input.substring(0, 4) == prefix + "d6") {
        var rollRes = d6.standardRoll(6);
        message.channel.send("You rolled: " + rollRes);
        if (rollRes == d6.getLimit())
            message.channel.send(critResponses[Math.floor(Math.random() * critResponses.length)]);
        else if (rollRes == 1)
            message.channel.send(lossResponses[Math.floor(Math.random() * lossResponses.length)]);
    }

    //rolls a standard d4 die(1..4)    
    if (input.substring(0, 4) == prefix + "d4") {
        var rollRes = d4.standardRoll(4);
        message.channel.send("You rolled: " + rollRes);
        if (rollRes == d4.getLimit())
            message.channel.send(critResponses[Math.floor(Math.random() * critResponses.length)]);
        else if (rollRes == 1)
            message.channel.send(lossResponses[Math.floor(Math.random() * lossResponses.length)]);
    }

    //used to create sets of dice that may skip numbers ex. percentage can be one d00 and a d10
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

    //Lists the dice that are currently stored in dieArr
    if (message.content.startsWith(prefix + "checkdie")) {
        if (dieArr[0] == null) {
            message.channel.send("There are no dice. Add some by typing this\n\"" + prefix + "setdie amount interval max, amount interval max, amo..\"");
        }
        else {
            message.channel.send("The following dies are in play");
            for (die in dieArr)
                message.channel.send("Die number " + (+die + 1) + ": (" + dieArr[die].getInterval() + ", " + dieArr[die].getLimit() + ")");
            message.channel.send("Finished listing all of the dice in play");
        }
    }

    //Deletes the dice stored in dieArr to be reused for another set
    if (input.substring(0, 10) == prefix + "cleardie") {
        for (die in dieArr) {
            dieArr.pop();
        }
        dieArr.pop();   //clears out the last die from when the original loop exits
        message.channel.send("Finished clearing old dice. Add more with " + prefix + "setdie amt interval limit, amt.. or use a standard die to continue");
    }
    //rolls all the dice in the dieArr and send the sum to the channel from which it was called
    if (input.substring(0, 9) == prefix + "mulroll") {
        var res = 0;
        if (dieArr.length > 0) {
            for(die in dieArr) {
                res += dieArr[die].intervalRoll(dieArr[die].getInterval(), dieArr[die].getLimit());
            }
            message.channel.send("You rolled " + res);
        }
        else {
            message.channel.send("There are no special dice to roll");
        }
    }

    //used to view the stats, health, and inventory on a player
    if (message.content.startsWith(prefix + "view")) {
        var arg = message.content.substring(7);
        var found = false;  
        //used to display an incon that represents the players health(ok, bleeding, dying, dead)
        const HEALTH_STAUS = [
                "https://i.kym-cdn.com/photos/images/newsfeed/000/858/776/f2e.jpg_large",
                "https://i.kym-cdn.com/photos/images/newsfeed/000/044/032/heart-attack.jpg",
                "https://static01.nyt.com/images/2018/04/22/magazine/22mag-tip/22mag-22tip-t_CA0-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
                "https://ih1.redbubble.net/image.213630379.6425/flat,550x550,075,f.jpg",
                "https://vignette.wikia.nocookie.net/pixar/images/1/1b/Forky_Asks_a_Question_Poster.jpg/revision/latest?cb=20190823231947" 
                ];
        for (var i = 0; i < skrim.players.length; i++) {
            if (arg == skrim.players[i].name) {
                found = true;
                var embed = new Discord.RichEmbed();
                embed.setThumbnail("https://thumbs.gfycat.com/IdolizedOffensiveAfricanelephant-size_restricted.gif");
                if (skrim.players[i].healthStatus == 3) {
                    embed.setAuthor(skrim.players[i].name, HEALTH_STAUS[3]);
                }
                else if (skrim.players[i].healthStatus == 2) {
                    embed.setAuthor(skrim.players[i].name, HEALTH_STAUS[2]);
                }
                else if (skrim.players[i].healthStatus == 1) {
                    embed.setAuthor(skrim.players[i].name, HEALTH_STAUS[1]);
                }
                else if (skrim.players[i].healthStatus == 0) {
                    embed.setAuthor(skrim.players[i].name, HEALTH_STAUS[0]);
                }
                else {
                    embed.setAuthor(skrim.players[i].name, HEALTH_STAUS[4]);
                }
                embed.setColor("#031fb5");
                embed.addField("Role", skrim.players[i].role, false);
                embed.addBlankField();
                //adds physical attributes to a field
                embed.addField("Physical",  "Athleticism: " + skrim.players[i].physical[0].athleticism + 
                                            "\nAth EXP: " + skrim.players[i].physical[0].athleticismEXP +
                                            "\nDexterity: " + skrim.players[i].physical[0].dexterity +
                                            "\nDex EXP: " + skrim.players[i].physical[0].dexterityEXP +
                                            "\nInspiration: " + skrim.players[i].physical[0].inspiration, true);
                //adds cognititive attributes to a field
                embed.addField("Cognititive",   "Wisdom: " + skrim.players[i].cognitive[0].wisdom + 
                                                "\nWis EXP: " + skrim.players[i].cognitive[0].wisdomEXP + 
                                                "\nPerceptiveness: " + skrim.players[i].cognitive[0].perceptiveness + 
                                                "\nPer EXP: " + skrim.players[i].cognitive[0].perceptivenessEXP + 
                                                "\nInspiration: " + skrim.players[i].cognitive[0].inspiration, true);
                //adds personal attributes to a field 
                embed.addField("Personal",  "Compassion: " + skrim.players[i].personal[0].compassion + 
                                            "\nCmp EXP: " + skrim.players[i].personal[0].compassionEXP + 
                                            "\nCharm: " + skrim.players[i].personal[0].charm + 
                                            "\nChm EXP: " + skrim.players[i].personal[0].charmEXP + 
                                            "\nCourage: " + skrim.players[i].personal[0].courage + 
                                            "\nCrg EXP: " + skrim.players[i].personal[0].courageEXP + 
                                            "\nInspiration: " + skrim.players[i].personal[0].inspiration, true);
                
                //loop that adds players inventory to a string variable and puts it into a field
                var items = "";
                var formatCounter = 0;
                for (itemIdx in skrim.players[i].inventory[0]) {
                    items += skrim.players[i].inventory[0][itemIdx] + ", ";
                    if ((formatCounter + 1) % 3 == 0)
                        items += "\n";
                    formatCounter++;
                }
                embed.addField("Inventory", items, true);
                message.channel.send(embed);
            }
        }
        if (!found)
            message.channel.send(arg + " was not found in this game!");
    }

    //used to change values in a player card that is stored in a JSON format
    if (message.content.startsWith(prefix + "setav")) {
        var player = message.content.substring(8);
        var val = message.content.substring(9);
        const tokens = funcs.tokenizer(input, 8, input.length);
        //skrim.players[0].healthStatus = 21;
        console.log("Arr contents vvv");
        for (tok in tokens)
            console.log(tokens[tok]);

        //find the player
        var found = false;
        for (var i = 0; i < skrim.players.length; i++) {
            if (tokens[0] == skrim.players[i].name) {
                found == true;
                //find the value to change and change it     
                var keys = Object.keys("./GamesData/SkyrimVillager.json");
                for (var j = 0; j < keys.length; j++) {
                    if (tokens[1] == keys[j]) {
                        skrim.players[i].keys[j] = tokens[2];
                        //save the file for later use (consider a seperate closing method for efficiency later)
                        var toSave = JSON.stringify(skrim, null, 2);    
                        FileSys.writeFile("./GamesData/SkyrimVillager.json", toSave, done);
                
                        function done() {
                            console.log("done here");
                        }                        
                    }
                }
            }
        }
        if (!found)
            message.channel.send(tokens[0] + " was not found!");
    }

    if (input.substring(0, 3) == prefix + ".") {
        const tokens = funcs.tokenizer(input, 4, input.length);
        var a = "";
        var b = "";
        for (var i = 0; i < tokens[0].length; i++) {
            a += tokens[0].charCodeAt(i) + " ";
            b += skrim.players[0].name.charCodeAt(i)+ " ";
        }
        
        console.log(a);
        console.log(b);
        console.log(tokens[0] == skrim.players[0].name);
        console.log(tokens[1] == "health");
        console.log(tokens[2] == "2")
        
        for (a in tokens)
            console.log(tokens[a]);
    }

    //sets the basic limit. 
    if (input.substring(0, 10) == prefix + "setlimit") {
        if (input.length < 11) {
            message.channel.send("Input a positive number");
        }
        else {
            var newLimit = parseInt(Math.floor((input.substring(11))));
            if (isNaN(newLimit) || newLimit <= 1)
                message.channel.send("could not set the new limit. You tried changing it to: " + message.content.substring(11));
            else {
                basicLimit = newLimit;
                message.channel.send("The new limit is now " + basicLimit);
            }
        }
    }

    //replies to every new message on a channel (test)
    if (message.channel.name == "gen2") {
        //do a regex to check if there is a number followed by one word (1 Doc; 3 bears; 21 savage; etc)
        if (/\d+(\s*-\s*|\s)[A-z]+/.test(input)) {
            var foundDate, sender, operator, amount;
            sender = message.author.username;

            //check if date was supplied and assign it; o/w get message sent date
            if (/\d+\/\d+\/\d+/.test(input)) {
                foundDate = /\d+\/\d+\/\d+/.exec(input)[0];
            } else {
                foundDate = message.createdAt.getMonth() + "/" + message.createdAt.getDate() + "/" + message.createdAt.getFullYear();
            }

            //assign the operator
            if (/\d+ [A-z]+/.test(input)) {
                operator = (/\d+\s+[A-z]+/.exec(input)[0]).split(" ")[1];
            }

            //assign the amounts of plays to add
            amount = /\d+\s+[A-z]+/.exec(input)[0].split(" ")[0];

            console.log(foundDate + "; " + sender + "; " + amount + "; " + operator);
        }
        else {
            console.log("no number found");
        }
    }

    //creates a rich embed of DMBot's commands and sends them to the channel from which it was called
    if (input.substring(0, 6) == prefix + "help") {
        var embed = new Discord.RichEmbed();
        embed.setThumbnail("https://i.kym-cdn.com/entries/icons/original/000/016/546/hidethepainharold.jpg");
        embed.setAuthor("DM Bot");
        embed.setColor("#61edb8");
        embed.addBlankField();
        embed.addField(prefix + "d20 (or 12, 8, 6, 4)", "rolls a number from 1 to the number after d", false);
        embed.addField(prefix + "roll", "rolls a number from 1 to a max limit. Default is 20", false);
        embed.addField(prefix + "setlimit number", "changes the max default number that >>roll will work with", false);
        embed.addField(prefix + "checkDie", "lists the dice that are currently available", false);
        embed.addField(prefix + "setDie amt step max, amt step...", "adds dice by the amount, the interval between numbers, and the upper limit. Use commas to seperate sets", false);
        embed.addField(prefix + "clearDie", "Eliminates the dice that are currently in play", false);
        embed.addField(prefix + "view name", "brings up the stats for the specified player", false);

        message.channel.send(embed);
    }

    //tests the storage method from sqliteElites.py when being called as methods
    if (input.substring(0, 11) == prefix + "testStore") {
        
    }
})

//actually logging in; can use token property instead of inputting it here; safer
client.login(token);    