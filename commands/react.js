module.exports = {
  name: 'react',
  aliases: ['reactions'],
  usage: '<Message>',
  description: 'React',
  adminOnly: true,
  guildOnly: true,
  args: false,
  cooldown: 5,
  execute(message) {
    message.id = '721377411110797372'
    message.react('666420467904675840')
      .then(() => message.react('666423599803924490'))
      .then(() => message.react('666420999436107791'))
      .then(() => message.react('666547875517431858'))
      .then(() => message.react('666547875517431858'))
      .then(() => message.react('721362159405105243'))
      .then(() => message.react('721343162953760842'))
      .then(() => message.react('721355270726615061'))
      .then(() => message.react('721348257392885781'))
      .then(() => message.react('721346143807733904'))
      .then(() => message.react('666420991379111936'))
      .then(() => message.react('666421078079569959'))
      .then(() => message.react('666423818633347075'))
      .then(() => message.react('666547836866789377'))
      .then(() => message.react('721342494226251849'))
      .then(() => message.react('721344687448784898'))
      .then(() => message.react('721347526854443018'))
      .catch(() => console.error('One of the emojis failed to react.'))
  },
}
