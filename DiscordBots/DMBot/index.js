const Discord = require('discord.js');              //create a variable (using kw 'const') to get node modules from discord.js
const FuncOBJ = require('./functions.js');
const DieOBJ = require('./die.js');
const { prefix, token} = require('./config.json');  //puts properties from config so that you can use the values defined there
const skrim = require('./GamesData/SkyrimVillager.json');
const client = new Discord.Client(); 
const funcs = new FuncOBJ("testName");
const d20 = new DieOBJ(1, 20);
const d12 = new DieOBJ(1, 12);
const d10 = new DieOBJ(1, 10);
const d8  = new DieOBJ(1, 8);
const d6  = new DieOBJ(1, 6);
const d4  = new DieOBJ(1, 4);
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
    console.log(input[2]);
    
    if(input.substring(0, 5) == prefix + "msg" || message.content.startsWith(prefix + "msg")) {
        message.channel.send("printing generic test message");
    }

    if (message.content.startsWith(prefix + "roll")) {
        var rollRes = d20.standardRoll(basicLimit);
        message.channel.send("You rolled: " + rollRes);
        if (rollRes == 20)
            message.channel.send(critResponses[Math.floor(Math.random() * critResponses.length)]);
        else if (rollRes == 1)
            message.channel.send(lossResponses[Math.floor(Math.random() * lossResponses.length)]);
    }

    if (input.substring(0, 5) == prefix + "d20") {
        var rollRes = d20.standardRoll(20);
        message.channel.send("You rolled: " + rollRes);
        if (rollRes == d20.getLimit())
            message.channel.send(critResponses[Math.floor(Math.random() * critResponses.length)]);
        else if (rollRes == 1)
            message.channel.send(lossResponses[Math.floor(Math.random() * lossResponses.length)]);
    }

    if (input.substring(0, 5) == prefix + "d12") {
        var rollRes = d12.standardRoll(12);
        message.channel.send("You rolled: " + rollRes);
        if (rollRes == d12.getLimit())
            message.channel.send(critResponses[Math.floor(Math.random() * critResponses.length)]);
        else if (rollRes == 1)
            message.channel.send(lossResponses[Math.floor(Math.random() * lossResponses.length)]);
    }

    if (input.substring(0, 5) == prefix + "d10") {
        var rollRes = d10.standardRoll(10);
        message.channel.send("You rolled: " + rollRes);
        if (rollRes == d10.getLimit())
            message.channel.send(critResponses[Math.floor(Math.random() * critResponses.length)]);
        else if (rollRes == 1)
            message.channel.send(lossResponses[Math.floor(Math.random() * lossResponses.length)]);
    }

    if (input.substring(0, 4) == prefix + "d8") {
        var rollRes = d8.standardRoll(8);
        message.channel.send("You rolled: " + rollRes);
        if (rollRes == d8.getLimit())
            message.channel.send(critResponses[Math.floor(Math.random() * critResponses.length)]);
        else if (rollRes == 1)
            message.channel.send(lossResponses[Math.floor(Math.random() * lossResponses.length)]);
    }

    if (input.substring(0, 4) == prefix + "d6") {
        var rollRes = d6.standardRoll(6);
        message.channel.send("You rolled: " + rollRes);
        if (rollRes == d6.getLimit())
            message.channel.send(critResponses[Math.floor(Math.random() * critResponses.length)]);
        else if (rollRes == 1)
            message.channel.send(lossResponses[Math.floor(Math.random() * lossResponses.length)]);
    }

    if (input.substring(0, 4) == prefix + "d4") {
        var rollRes = d4.standardRoll(4);
        message.channel.send("You rolled: " + rollRes);
        if (rollRes == d4.getLimit())
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

    if (message.content.startsWith(prefix + "setav")) {
        var player = message.content.substring(8);
        var val = message.content.substring(9);
        var woody = "there is a snake in my boot";
        console.log(funcs.tokenizer(woody, 0, woody.length));
        skrim.players[0].healthStatus = 1;
    }
})

//actually logging in; can use token property instead of inputting it here; safer
client.login(token);    