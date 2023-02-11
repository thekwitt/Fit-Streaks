const { SlashCommandBuilder, Colors, EmbedBuilder } = require('discord.js');

// eslint-disable-next-line no-unused-vars

module.exports = {
	name: 'viewchallenges',
	description: 'View challenges!',
	data: new SlashCommandBuilder()
		.setName('viewchallenges')
		.setDescription('View challenges')
		.addUserOption(option => option.setName('target').setDescription('The user you want to view challenges from.')),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const guild = interaction.guild;
		const target = interaction.options.getUser('target');
		let user = interaction.user;
		if (target != undefined) {user = target;}
		// Get User Index

		if (target && !target.bot)
		{
			const raw_guild = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guildId]);
			const guild_data = raw_guild.rows[0];

			user = target;
			const dateTS = Math.floor(new Date(new Date().toLocaleDateString('en-US', { timeZone: guild_data.default_timezone, timeZoneName: 'short' })).getTime() / 1000.0);
			await client.pool.query('INSERT INTO user_data (Guild_ID, Member_ID, Timezone, New_Day_TS) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;', [interaction.guildId, user.id, guild_data.default_timezone, dateTS]);
			await client.pool.query('INSERT INTO user_stats (Guild_ID, Member_ID) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [interaction.guildId, user.id]);
		}
		else if (target && target.bot) {
			try{return await interaction.reply({ content: target.username + ' is a bot. It is optimized 1000% already!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'No Present Warning Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Card Command', 'Reply Denied');}
		}

		const raw_challenge = await client.pool.query('SELECT * FROM challenge_data WHERE Member_ID = $1 AND Guild_ID = $2;', [user.id, interaction.guildId]);
		const challenge_data = raw_challenge.rows;

		const raw_user = await client.pool.query('SELECT * FROM user_data WHERE Member_ID = $1 AND Guild_ID = $2;', [user.id, interaction.guildId]);
		const user_data = raw_user.rows;

		const embed = new EmbedBuilder()
			.setColor(Colors.Blurple)
			.setTitle('🎯   ' + user.username + ' Challenge / Goal List!   🎯')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.setFooter({ text: 'This user has ' + (challenge_data.length) + ' challenge' + (user_data.challenges + 1 != 1 ? 's' : '') + ' completed so far!' });

		for(let i = 0; i < challenge_data.length; i++) {
			if(challenge_data[i].reminder_ts > Math.floor(Date.now() / 1000)) embed.addFields({ name: 'Challenge: "' + challenge_data[i].description + '"', value: 'Expiration: <t:' + challenge_data[i].reminder_ts + '>', inline: false });
			else embed.addFields({ name: 'Challenge: "' + challenge_data[i].description + '"', value: '**Due Now!**', inline: false });
		}

		try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Bot Reply'));}
		catch (err) {client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + ' Command', 'Reply Denied');}
	},
};