require('dotenv').config()

const Discord = require('discord.js')
const fs = require('fs')
// const SQLite = require('better-sqlite3')
// const sql = new SQLite('./IDK.sqlite')

const client = new Discord.Client()

client.commands = new Discord.Collection()
const cooldowns = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
// const musiccommandFiles = fs.readdirSync('./music-commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}
/*for (const file of musiccommandFiles) {
  const musiccommand = require(`./music-commands/${file}`)
  client.musiccommands.set(musiccommand.name, musiccommand)
}*/

let roles_channel_id = '666028190191452243'
let roleselect_message_id = '721377411110797372'
const reactionRoleEmoji = require('./emojiRoleMap.json')

client.on('ready', () => {
  console.log(`Logged in and ready to be used.. use "${process.env.PREFIX}help".`)
  client.user.setActivity('with JavaScript')

  client.channels.cache.get(roles_channel_id).messages.fetch(roleselect_message_id).then(m => {
    console.log('Cached reaction message.')
  }).catch(e => {
    console.error('Error loading message.')
    console.error(e)
  })
})

client.on('message', message => {
  if (!message.content.startsWith(process.env.PREFIX)) return
  if (!message.id == roleselect_message_id) {
    message.delete({ timeout: 1000, reason: 'It had to be done.' })
    message.author.bot   
  }

  const args = message.content.slice(process.env.PREFIX.length).split(/ +/)
  const commandName = args.shift().toLowerCase()

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

  if (!command) return

  if (!command.botAllowed && message.author.bot) {
    return message.reply('Bots cant execute this command')
      .then(msg => {
        msg.delete({ timeout: 5000, reason: 'It had to be done.' })
      })
      
  }

  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply('I can\'t execute that command inside DMs!')
      .then(msg => {
        msg.delete({ timeout: 5000, reason: 'It had to be done.' })
      })
  }

  if (command.adminOnly && !message.member.roles.cache.some(role => role.name === 'seb')) {
    return message.reply('No PERMS')
      .then(msg => {
        msg.delete({ timeout: 5000, reason: 'It had to be done.' })
      })
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${process.env.PREFIX}${command.name} ${command.usage}\``
    }

    return message.channel.send(reply)
      .then(msg => {
        msg.delete({ timeout: 5000, reason: 'It had to be done.' })
      })
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection())
  }

  const now = Date.now()
  const timestamps = cooldowns.get(command.name)
  const cooldownAmount = (command.cooldown || 3) * 1000

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
        .then(msg => {
          msg.delete({ timeout: 5000, reason: 'It had to be done.' })
        })
    }
  }

  timestamps.set(message.author.id, now)
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

  try {
    command.execute(message, args)
  } catch (error) {
    console.error(error)
    message.reply('there was an error trying to execute that command!')
      .then(msg => {
        msg.delete({ timeout: 5000, reason: 'It had to be done.' })
      })
  }
})

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === 'welcome')
  // Do nothing if the channel wasn't found on this server
  if (!channel) return
  // Send the message, mentioning the member
  channel.send(`Welcome ${member}`)
})

client.on('messageReactionAdd', (reaction, user) => {
  if(reaction.message.id === roleselect_message_id) {
    const member = reaction.message.guild.member(user)
    let reactionRole = reaction.message.guild.roles.cache.find(role => role.name === reactionRoleEmoji[reaction.emoji.name])

    if (reactionRole) {
      member.roles.add(reactionRole, 'Add reaction role')
    } else {
      console.info(`Reaction "${reaction.name} ${reaction.id}" was added to the message and does not have an assigned role.`)
    }
  }
})

client.on('messageReactionRemove', (reaction, user) => {
  if(reaction.message.id === roleselect_message_id) {
    const member = reaction.message.guild.member(user)
    let reactionRole = reaction.message.guild.roles.cache.find(role => role.name === reactionRoleEmoji[reaction.emoji.name])

    if (reactionRole) {
      member.roles.remove(reactionRole, 'Remove reaction role')
    } else {
      console.info(`Reaction "${reaction.name} ${reaction.id}" was removed from message and does not have an assigned role.`)
    }
  }
})

client.login(process.env.TOKEN)