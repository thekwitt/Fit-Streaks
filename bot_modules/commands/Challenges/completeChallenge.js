const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, Colors } = require('discord.js');

// eslint-disable-next-line no-unused-vars

module.exports = {
	name: 'completechallenge',
	description: 'Complete a challenge!',
	data: new SlashCommandBuilder()
		.setName('completechallenge')
		.setDescription('Remove a challenge!')
		.addStringOption(option => option.setName('description').setDescription('The challenge description.').setRequired(true).setAutocomplete(true)),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const guild = interaction.guild;
		const description = interaction.options.getString('description');

		const raw_user = await client.pool.query('SELECT * FROM user_data WHERE Member_ID = $1 AND Guild_ID = $2;', [interaction.user.id, interaction.guildId]);
		const user_data = raw_user.rows[0];

		const raw_challenge = await client.pool.query('SELECT * FROM challenge_data WHERE Member_ID = $1 AND Guild_ID = $2;', [interaction.user.id, interaction.guildId]);
		const challenge_data = raw_challenge.rows;

		const filtered = challenge_data.map(c => c.challenge_id + '|' + interaction.guildId + '|' + interaction.user.id);

		if(!filtered.includes(description)) {
			try { return await interaction.reply('Oops that challenge wasn\'t right. Make sure not to make any edits to the auto fill selection.').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
		}

		const ds = description.split('|');

		await client.extra.roleManagement(client, interaction.member, guild);

		if(ds[2] != interaction.user.id) {
			try { return await interaction.reply('Oops that challenge wasn\'t right. Make sure not to make any edits to the auto fill selection.').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
		}

		await client.pool.query('DELETE from challenge_data WHERE challenge_id = $1;', [Number(ds[0])]);
		await client.pool.query('UPDATE user_data SET challenges = challenges + 1 WHERE member_id = $1 AND guild_id = $2', [interaction.user.id, interaction.guildId]);

		const role_raw = await client.pool.query('SELECT * FROM role_data WHERE guild_id = $1 AND Type = 1;', [guild.id]);
		const role_data = role_raw.rows;

		let role_capture = undefined;

		for(let i = 0; i < role_data.length; i++) {
			if(role_data[i].stars_required == user_data.challenges + 1 && user_data.challenges + 1 != 1) {
				role_capture = role_data[i];
			}
		}

		const newrow = raw_challenge.rows;
		for(let i = 0; i < challenge_data.length; i++) {

			if(newrow[i].challenge_id == ds[0]) {
				const embed = new EmbedBuilder()
					.setColor(Colors.Green)
					.setTitle('🎯   ' + interaction.user.username + ' completed a challenge!   🎯')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nAfter a lot of hard work, they completed a die hard challenge!\n\nThe challenge was **"' + newrow[i].description + '!"**\n\nIn total, they have completed ' + (user_data.challenges + 1) + ' challenge' + (user_data.challenges.challenges + 1 != 1 ? 's' : '') + '!' + (role_capture != undefined ? '\n\nHoly smokes! You\'ve been doing so well you deserve a new role! You now have the <@&' + role_capture.role_id + '> role for completing ' + role_capture.stars_required + ' challenges! Keep on going!' : '') + '\n⠀')
					.setFooter({ text: 'They now have ' + (challenge_data.length - 1) + ' challenge' + (user_data.challenges + 1 != 1 ? 's' : '') + ' left.' });

				try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Bot Reply'));}
				catch (err) {client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + ' Command', 'Reply Denied');}
			}
		}
	},
};