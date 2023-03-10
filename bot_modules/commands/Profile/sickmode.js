const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, Colors } = require('discord.js');

// eslint-disable-next-line no-unused-vars

module.exports = {
	name: 'sickmode',
	description: 'Freeze your streak if you are sick.',
	data: new SlashCommandBuilder()
		.setName('sickmode')
		.setDescription('Freeze your streak if you are sick.'),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {

		const raw_user = await client.pool.query('SELECT * FROM user_data WHERE Member_ID = $1 AND Guild_ID = $2;', [interaction.user.id, interaction.guildId]);
		const user_data = raw_user.rows[0];


		if(user_data.sick_mode == true) {
			try { return await interaction.reply({ content: 'Don\'t worry! You are already in sick mode. Focus on getting rest first before getting back out there!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Not Text Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + ' Command', 'Reply Denied'); }
		}

		const embed = new EmbedBuilder().setFooter({ text: 'Can\'t wait to see you when you return!' });

		embed.setColor(Colors.DarkBlue)
			.setTitle('🦠   ' + interaction.user.username + ' is taking a break   🦠')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.setDescription('⠀\nKodos to you for putting your health first fit goer! Make sure to take plenty of rest before getting back out there.\n⠀');

		await client.pool.query('UPDATE user_data SET sick_mode = TRUE, rest_mode = FALSE, vaca_mode = FALSE WHERE Guild_ID = $1 AND Member_ID = $2', [interaction.guildId, interaction.user.id]);

		try{ await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Invite Command', 'Bot Reply'));}
		catch (err) {client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' Command', 'Reply Denied');}

		try { return await interaction.followUp({ content: 'You\'re streak is now frozen at ' + user_data.stars + ' streak stars. When you are ready to resume sending streaks, simply star your next post like normal.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Not Text Reply')); }
		catch (err) { client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + ' Command', 'Reply Denied'); }
	},
};