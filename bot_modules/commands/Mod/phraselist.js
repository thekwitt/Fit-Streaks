// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder } = require('@discordjs/builders');
const { Colors, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'phraselist',
	description: 'List of all the phrases for streak.',
	data: new SlashCommandBuilder()
		.setName('phraselist')
		.setDescription('List of all the phrases for streak.'),
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */

	async execute(interaction, client) {
		const raw_guild = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guildId]);
		const guild_data = raw_guild.rows[0];

		const embed = new EmbedBuilder().setFooter({ text: '⠀\nAll of these phrases are chosen at random.' });

		embed
			.setColor(Colors.Red)
			.setTitle('💬   Streak Phrases   💬\n⠀')
		// eslint-disable-next-line spaced-comment
		//.setThumbnail(user.defaultAvatarURL)
			.addFields(
				{ name: 'First Star Phrases', value: guild_data.first_time_phrases.join('\n\n') + '', inline: false },
				{ name: '⠀\nStreak Phrases', value: guild_data.streak_phrases.join('\n\n') + '', inline: false },
				{ name: '⠀\nStart Over Phrases', value: guild_data.start_over_phrases.join('\n\n') + '', inline: false },
			);
		try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', ' Overview Reply'));}
		catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', 'Overview Reply Denied');}
	},
};