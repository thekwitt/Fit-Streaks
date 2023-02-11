const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

// eslint-disable-next-line no-unused-vars

module.exports = {
	name: 'support',
	description: 'Get the link to the support server.',
	data: new SlashCommandBuilder()
		.setName('support')
		.setDescription('Get the link to the support server.'),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {

		const row = new ActionRowBuilder()
			.addComponents([
				new ButtonBuilder()
					.setLabel('Support Server')
					.setStyle(ButtonStyle.Link)
					.setURL('https://discord.com/api/oauth2/authorize?client_id=1002235075359940738&permissions=268823616&scope=bot%20applications.commands'),
			]);

		const embed = new EmbedBuilder().setFooter({ text: 'For any questions/concerns please visit the official TheKWitt server! https://discord.gg/ZNpCNyNubU' });

		embed.setColor(Colors.DarkButNotBlack)
			.setTitle('🔗   Invite Link!   🔗')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.setDescription('⠀\nClick the button below to invite your bot!\n⠀');

		try{return await interaction.reply({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'Invite Command', 'Bot Reply'));}
		catch (err) {client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' Command', 'Reply Denied');}
	},
};