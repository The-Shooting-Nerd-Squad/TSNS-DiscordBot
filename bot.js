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
    switch (reaction.emoji.id) {
      case '666420467904675840':
        member.roles.add(member.guild.roles.cache.find(role => role.name === 'Overwatch'), 'Reason')
        break
      case '666423599803924490':
        member.roles.add(member.guild.roles.cache.find(role => role.name === 'Minecraft'), 'Reason')
        break
      case '666420999436107791':
        member.roles.add(member.guild.roles.cache.find(role => role.name === 'League of Legends'), 'Reason')
        break
      case '666547875517431858':
        member.roles.add(member.guild.roles.cache.find(role => role.name === 'Beat Saber'), 'Reason')
        break
      case '721362159405105243':
        member.roles.add(member.guild.roles.cache.find(role => role.name === 'ESO'), 'Reason')
        break
      case '721343162953760842':
        member.roles.add(member.guild.roles.cache.find(role => role.name === 'Valorant'), 'Reason')
        break
      case '721355270726615061':
        member.roles.add(member.guild.roles.cache.find(role => role.name === 'Snow Runner'), 'Reason')
        break
      case '721348257392885781':
        member.roles.add(member.guild.roles.cache.find(role => role.name === 'Terraria'), 'Reason')
        break
      case '721346143807733904':
        member.roles.add(member.guild.roles.cache.find(role => role.name === 'Fortnite'), 'Reason')
        break
      case '666420991379111936':
        member.roles.add(member.guild.roles.cache.find(role => role.name === 'CSGO'), 'Reason')
        break
      case '666421078079569959':
        member.roles.add(member.guild.roles.cache.find(role => role.name === 'Rainbow 6 Siege'), 'Reason')
        break
      case '666423818633347075':
        member.roles.add(member.guild.roles.cache.find(role => role.name === 'GTA'), 'Reason')
        break
      case '666547836866789377':
        member.roles.add(member.guild.roles.cache.find(role => role.name === 'Battlefield'), 'Reason')
        break
      case '721342494226251849':
        member.roles.add(member.guild.roles.cache.find(role => role.name === 'PUBG'), 'Reason')
        break
      case '721344687448784898':
        member.roles.add(member.guild.roles.cache.find(role => role.name === 'Rocket League'), 'Reason')
        break
      case '721347526854443018':
        member.roles.add(member.guild.roles.cache.find(role => role.name === 'Arma'), 'Reason')
        break
    }
  }
})

client.on('messageReactionRemove', (reaction, user) => {
  if(reaction.message.id === roleselect_message_id) {
    const member = reaction.message.guild.member(user)
    switch (reaction.emoji.id) {
      case '666420467904675840':
        member.roles.remove(member.guild.roles.cache.find(role => role.name === 'Overwatch'), 'Reason')
        break
      case '666423599803924490':
        member.roles.remove(member.guild.roles.cache.find(role => role.name === 'Minecraft'), 'Reason')
        break
      case '666420999436107791':
        member.roles.remove(member.guild.roles.cache.find(role => role.name === 'League of Legends'), 'Reason')
        break
      case '666547875517431858':
        member.roles.remove(member.guild.roles.cache.find(role => role.name === 'Beat Saber'), 'Reason')
        break
      case '721362159405105243':
        member.roles.remove(member.guild.roles.cache.find(role => role.name === 'ESO'), 'Reason')
        break
      case '721343162953760842':
        member.roles.remove(member.guild.roles.cache.find(role => role.name === 'Valorant'), 'Reason')
        break
      case '721355270726615061':
        member.roles.remove(member.guild.roles.cache.find(role => role.name === 'Snow Runner'), 'Reason')
        break
      case '721348257392885781':
        member.roles.remove(member.guild.roles.cache.find(role => role.name === 'Terraria'), 'Reason')
        break
      case '721346143807733904':
        member.roles.remove(member.guild.roles.cache.find(role => role.name === 'Fortnite'), 'Reason')
        break
      case '666420991379111936':
        member.roles.remove(member.guild.roles.cache.find(role => role.name === 'CSGO'), 'Reason')
        break
      case '666421078079569959':
        member.roles.remove(member.guild.roles.cache.find(role => role.name === 'Rainbow 6 Siege'), 'Reason')
        break
      case '666423818633347075':
        member.roles.remove(member.guild.roles.cache.find(role => role.name === 'GTA'), 'Reason')
        break
      case '666547836866789377':
        member.roles.remove(member.guild.roles.cache.find(role => role.name === 'Battlefield'), 'Reason')
        break
      case '721342494226251849':
        member.roles.remove(member.guild.roles.cache.find(role => role.name === 'PUBG'), 'Reason')
        break
      case '721344687448784898':
        member.roles.remove(member.guild.roles.cache.find(role => role.name === 'Rocket League'), 'Reason')
        break
      case '721347526854443018':
        member.roles.remove(member.guild.roles.cache.find(role => role.name === 'Arma'), 'Reason')
        break
    }
  }
})

client.login(process.env.TOKEN)