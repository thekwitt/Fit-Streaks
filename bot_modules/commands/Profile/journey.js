const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, Colors } = require('discord.js');

// eslint-disable-next-line no-unused-vars

module.exports = {
	name: 'journey',
	description: 'Get details about a user\'s workout journey.',
	data: new SlashCommandBuilder()
		.setName('journey')
		.setDescription('Get details about a user\'s workout journey.')
		.addUserOption(option => option.setName('target').setDescription('The user\'s journey you want to view.')),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const guildId = interaction.guildId;
		const target = interaction.options.getUser('target');
		let user = interaction.user;
		if (target != undefined) {user = target;}
		// Get User Index

		if (target && !target.bot)
		{
			const raw_guild = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [guildId]);
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

		const raw_user = await client.pool.query('SELECT * FROM user_data WHERE Member_ID = $1 AND Guild_ID = $2;', [user.id, interaction.guildId]);
		const user_data = raw_user.rows[0];

		const raw_stats = await client.pool.query('SELECT * FROM user_stats WHERE Member_ID = $1 AND Guild_ID = $2;', [user.id, interaction.guildId]);
		const user_stats = raw_stats.rows[0];

		const temp = user_stats.highest_streak;
		const embed = new EmbedBuilder()
			.setColor(Colors.Gold)
			.setThumbnail(user.displayAvatarURL({ extension: 'jpg' }))
			.setDescription('\n\u200B')
			.setTitle('👊   ' + user.username + '\'s Journey   👊')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.addFields({ name: 'Current Streak', value: '⭐ ' + user_data.stars, inline: true },
				{ name: 'Collected Stars', value: '⭐ ' + user_stats.stars_collected, inline: true },
				{ name: 'Challenges Completed', value: '🎯 ' + user_data.challenges, inline: true },
				{ name: 'Status', value: (user_data.sick_mode == true ? 'Sick Mode 🤒' : (user_data.rest_mode == true ? 'Rest Mode 😴' : (user_data.vaca_mode == true ? 'Vacation Mode 😎' : user_data.status))) },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Highest Streak', value: temp + '', inline: true },
				{ name:  'Timezone', value: user_data.timezone, inline: true })
			.setFooter({ text: 'See your card with **/journey**' });

		try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Bot Reply'));}
		catch (err) {client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + ' Command', 'Reply Denied');}
	},
};