import { config } from 'dotenv'
import { Client, Guild } from 'discord.js';

// read from the env file 
config();

const client = new Client({ intents: ['Guilds', 'GuildMessages'] })
client.login(process.env.BOT_TOKEN);