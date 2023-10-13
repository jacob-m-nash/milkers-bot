#!/usr/bin/env node
const tmi = require('tmi.js');
const fs = require('fs');
require('dotenv').config()

const milkQueue = [];
const windowLength = 30000;

const copyPastaPt1 = "In the sprawling digital landscape of Twitch, a civil war has been raging, unbeknownst to those who navigate its front page. This is the bitter strife between the milkers, who choose to brand themselves with a lowercase 'm,' and the Milkers, who opt for the majesty of an uppercase 'M.' These two factions, once united in spamming in chat, have grown divided.";
const copyPastaPt2 = " Employing a barrage of emotes, chat messages, and ban commands, they have turned the digital paradise of Twitch chat into a war-torn battleground, seemingly ignorant of the larger threat looming over them. This threat is none other than the Juicers, currently the most dominant and expansive army on Twitch, wielding an overwhelming influence over algorithms and viewer counts."
const copyPastaPt3 = "The milkers and Milkers must recognize that their petty disputes are but skirmishes in the face of this monolithic foe. Now is the time to unite under a single banner; only through unity can they muster the strength to overthrow the Juicers and restore balance to their digital realm."
let receivedMessages = 0;
let sentMessages = 0;

const options = {
  identity: {
    username: process.env.ACCOUNT,
    password:  process.env.PASSWORD
  },
  channels: [process.env.CHANNEL]
};

const client = new tmi.client(options);

client.on('connected', (address, port) => {
  console.log(`Bot connected to ${address}:${port}`);
});

client.on('message', (channel, user, message, self) => {
  if (self) return; 
  receivedMessages++;

  const currentTime = Date.now();
  const milkOccurrences = (message.match(/milk/gi) || []).length;

  for (let i = 0; i < milkOccurrences; i++) {
    milkQueue.push(currentTime);
  }
  while (milkQueue.length > 0 && (currentTime - milkQueue[0]) > windowLength) {
    milkQueue.shift();
  }
  if (user['display-name'] == "Luigi401" && message == "Milk")
  {
    client.say(channel, `${user['display-name']} fricc`);
  }

  const msgLower = message.toLowerCase();
  switch (msgLower) {
    case '!hello':
      client.say(channel, `Hello, ${user['display-name']}-chan AYAYA !`);
      sentMessages++;
      break;
    case '!mpm':
      const milksPerMinute = (milkQueue.length / 0.5).toFixed();
      client.say(channel, `${user['display-name']}. Chat currently running at: ${milksPerMinute}  milks per minute.`);
      sentMessages++;
      break;
    case '!war':
        client.say(channel,"https://twitter.com/tawnniee/status/1701183522248196359");
    case '!milk':
        client.say(channel, `Got milk ${user['display-name']}?`);
    case '!glass':
      // TODO: random if someone is glass half full or half empty 
    case '!bane':
      client.say(channel, ` ${user['display-name']} Ah you think milk is your ally? You merely adopted the milk. I was born in it, molded by it.`);
    case '!dad':
      const year = Math.floor(Math.random() * 18);
      client.say(channel, `${user['display-name']} Dad left to get milk from the shops ${year} years ago, but he will be back soon.`);
    case '!supply':
      client.say(channel, `———————————————————————— TwitchVotes Daily supply of Milk has arrived!————————————————————————`);
    default:
      // Default behavior, if needed
      break;
  }
  
});

setInterval(() => {
    const totalRate = receivedMessages + sentMessages;

    if(totalRate > 0){
        // Logging message rate to a file
        const logData = `${new Date().toISOString()}, Received Messages: ${receivedMessages}, Sent Messages: ${sentMessages}, Total rate: ${totalRate}\n`;
        fs.appendFile('message_rate_log.txt', logData, (err) => {
        if (err) console.error('Failed to write to log:', err);
        });
    }
  
    // Resetting the counters
    receivedMessages = 0;
    sentMessages = 0;
  
  }, 30000); // Update every 30 seconds

client.connect();

//TODO: Idea, mpm fills a cup that can be shown on screen
