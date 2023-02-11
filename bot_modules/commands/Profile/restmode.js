const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, Colors } = require('discord.js');

// eslint-disable-next-line no-unused-vars

module.exports = {
	name: 'restmode',
	description: 'Take a day off with no worries!',
	data: new SlashCommandBuilder()
		.setName('restmode')
		.setDescription('Take a day off with no worries!'),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {

		const raw_user = await client.pool.query('SELECT * FROM user_data WHERE Member_ID = $1 AND Guild_ID = $2;', [interaction.user.id, interaction.guildId]);
		const user_data = raw_user.rows[0];


		if(user_data.rest_mode == true) {
			try { return await interaction.reply({ content: 'Don\'t worry! You are already in rest mode. Focus on getting rest first before getting back out there!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Not Text Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + ' Command', 'Reply Denied'); }
		}

		if(user_data.rest_days <= 0) {
			try { return await interaction.reply({ content: 'Woah there, looks like you used up all your rest days! Post something minimal like step counter, healthy food intake or something small related to your goals! Remember anything can be a post as long as it is a part of your journey.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Not Text Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + ' Command', 'Reply Denied'); }
		}

		const embed = new EmbedBuilder().setFooter({ text: 'Can\'t wait to see you when you return!' });

		embed.setColor(Colors.Greyple)
			.setTitle('💤   ' + interaction.user.username + ' is resting today!   💤')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.setDescription('⠀\nYou worked so hard so far, you deserve a rest! Come back tomorrow refreshed and ready for more!\n⠀');

		await client.pool.query('UPDATE user_data SET sick_mode = FALSE, rest_mode = TRUE, vaca_mode = FALSE, rest_days = rest_days - 1 WHERE Guild_ID = $1 AND Member_ID = $2', [interaction.guildId, interaction.user.id]);

		try{ await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Bot Reply'));}
		catch (err) {client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + ' Command', 'Reply Denied');}

		try { return await interaction.followUp({ content: 'You\'re streak is now frozen at ' + user_data.stars + ' streak stars for today. The number of rest days you have is now ' + (user_data.rest_days - 1) + '. To gain a rest day back, simply post and star like normal tomorrow.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Not Text Reply')); }
		catch (err) { client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + ' Command', 'Reply Denied'); }
	},
};