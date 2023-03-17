const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const queue = [];
let matchCreated = false;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', msg => {
    if (msg.content === '!!join') {
      if (!queue.includes(msg.author.id)) {
        queue.push(msg.author.id);
        const position = queue.length
        msg.reply(`You have been added to the queue. Your position in the queue is ${position}`);
      } else {
        msg.reply('You are already in the queue.');
      }
    } else if (msg.content === '!!leave') {
      const index = queue.indexOf(msg.author.id);
      if (index >= 0) {
        if (index === 0 || index === 1) {
          queue.splice(index, 1);
          msg.reply('You have been removed from the queue.');
          matchCreated = false; // Set matchCreated to false if the user leaves
        } else {
          queue.splice(index, 1);
          msg.reply('You have been removed from the queue.');
        }
      } else {
        msg.reply('You are not in the queue.');
      }
    } else if (msg.content === '!!who') {
      if (queue.length > 0) {
        let reply = 'The following users are in the queue:\n';
        for (const userId of queue) {
          const user = client.users.cache.get(userId);
          reply += `- ${user.username}\n`;
        }
        msg.channel.send(reply);
      } else {
        msg.reply('The queue is currently empty.');
      }
    } else if (msg.content === '!!gg') {
        const index = queue.indexOf(msg.author.id);
        if (index >= 0) {
          if (index === 0 || index === 1) {
            queue.splice(index, 1);
            queue.push(msg.author.id);
            msg.reply('Good game! You have been sent to the back of the queue.');
            matchCreated = false;
          } else {
            msg.reply('You are not playing in the current match.');
          }
        } else {
          msg.reply('You are not in the queue.');
        }
      } else if (msg.content === '!!clear') {
        if (msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          queue.length = 0;
          matchCreated = false;
          msg.reply('The queue has been cleared.');
        } else {
          msg.reply('You do not have permission to use this command.');
        }
      } else if (msg.content.startsWith('!!remove')) {
        if (msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          const index = parseInt(msg.content.split(' ')[1], 10) - 1;
          if (isNaN(index) || index < 0 || index >= queue.length) {
            msg.reply(`No one is in that position! Use !!who to see who is in the queue.`);
          } else {
            const user = client.users.cache.get(queue[index]);
            queue.splice(index, 1);
            msg.reply(`${user.username} has been removed from the queue.`);
            matchCreated = false; // Reset matchCreated flag if the queue is modified
          }
        } else {
          msg.reply('You do not have permission to use this command.');
        }

      } else if (msg.content === '!!skip') {
        if (msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          if (queue.length >= 2) {
            const userToSkip = client.users.cache.get(queue[1]);
            queue.splice(1, 1);
            queue.splice(2, 0, userToSkip.id);
            msg.reply(`${userToSkip.username} has been skipped.`);
            matchCreated = false;
          } else {
            msg.reply('There are not enough people in the queue to use this command.');
          }
        } else {
          msg.reply('You do not have permission to use this command.');
        }
      }

       else if (msg.content === '!!help') {
        const reply = 'Here are the available commands:\n\n' +
          '!!join - Join the queue\n' +
          '!!leave - Leave the queue\n' +
          '!!who - See who is in the queue\n' +
          '!!gg - Say "Good Game!" and move to the back of the queue\n' +
          '!!clear - Clear the queue (admin only)\n' +
          '!!skip - Skips the second person in the queue, sending them back by 1 position (admin only)\n' +
          '!!remove [position] - Remove a user from the queue by position (admin only)\n' +
          '!!link - Sends a discord invite link to the Dry Games on Parsec EU Discord server\n' +
          '!!list - Sends a list of everyone currently in the queue straight to your DMs!\n' +
          '!!donate - Sends a donation link if you would like to support the server! (´｡• ᵕ •｡`) ♡ ';
        msg.channel.send(reply);

      } else if (msg.content === '!!donate') {
        msg.channel.send('If you are enjoying these Dry Games, then feel free to support us here! https://www.paypal.com/donate/?hosted_button_id=T5NZ8XMTQTVML');

      } else if (msg.content === '!!link') {
      msg.channel.send('Here is the link to join the Dry Games on Parsec EU discord server: https://discord.gg/5hECnNmm6n');

    } else if (msg.content === '!!dopl') {
      msg.channel.send("Doplghost, you're my new Firebrand hero. Your full mastery of his movement and Luminous Body combos are just so beautiful to watch, it's like art in motion. I don't think I'd ever be brave enough to run him anchor, but you make me want to dust of the stick and get back in the lab.");

    } else if (msg.content === '!!list') {
      if (queue.length > 0) {
        let reply = 'The following users are in the queue:\n';
        for (const userId of queue) {
          const user = client.users.cache.get(userId);
          reply += `- ${user.username}\n`;
        }
        msg.author.send(reply);
      } else {
        msg.reply('The queue is currently empty.');
      }

    } else if (msg.content === '!!esler') {
      msg.channel.send('winky stays on.');
    }

    if (queue.length > 1 && !matchCreated) {
      const user1 = client.users.cache.get(queue[0]);
      const user2 = client.users.cache.get(queue[1]);
      if (queue.length < 7) {
        msg.channel.send(`${user1.toString()} and ${user2.toString()}, your set is ready. The format is First to 5 matches.`);
      } else {
        msg.channel.send(`${user1.toString()} and ${user2.toString()}, your set is ready. The format is First to 3 matches.`);
      }
      matchCreated = true;
    }
  });

client.login('token');
