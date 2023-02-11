const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, Colors } = require('discord.js');

// eslint-disable-next-line no-unused-vars

module.exports = {
	name: 'transparencyperms',
	description: 'Learn about why I need permissions.',
	data: new SlashCommandBuilder()
		.setName('transparencyperms')
		.setDescription('Learn about why I need permissions.'),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const embed = new EmbedBuilder()
			.setColor(Colors.Blurple)
			.setTitle('📖   Permission Transparency   📖')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.addFields(
				{ name: 'Send Messages', value: 'In order to send confirmations on streaks, the bot must send messages to users in the health channel. It provides communication and allows morality boost and motivation increase for those who seek it with this program.', inline: false },
				{ name: 'Read Messages', value: 'When a streak is registered, the id of the message starred is recorded to prevent duplication and allow mods to locate it if they wish to unmark it as a streak message.', inline: false },
				{ name: 'External Emojis', value: 'For certain criteras, the bot has some emojis that were made to fit those messages and events.', inline: false },
				{ name: 'Embed Link and Attach Files', value: 'To perform the best and tightest design, embedded messages are used to give off a professional look. Some functions also use image generation which require files to be attached to show off to users.', inline: false },
				{ name: 'Add Reactions', value: 'As part of the confirmation, the bot reacts to any messages that are marked as stars or denys made by users or mods.', inline: false },
				{ name: 'Manage Roles', value: 'The bot features a role control function that adds and removes roles that are used as an incentive to users who regularly use the bot. It is also used to create roles that are set up with the **/setup** function which allows those incentives to be easily setup on the server.', inline: false },
			)
			.setFooter({ text: 'For any questions/concerns please visit the official TheKWitt server! https://discord.gg/ZNpCNyNubU' });

		try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Bot Reply'));}
		catch (err) {client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + ' Command', 'Reply Denied');}
	},
};