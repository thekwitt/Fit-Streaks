/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('discord.js');
const { MessageActionRow, MessageButton, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
	name: 'settings',
	description: 'Get or Set Settings for the bot on your server!',
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Get or Set Settings for the bot on your server!')
		.addSubcommandGroup(group =>
			group
				.setName('basic')
				.setDescription('Settings for managing the bot.')
				.addSubcommand(subcommand =>
					subcommand
						.setName('set_delete_overtime')
						.setDescription('Set Star Messages to delete over time (0 - Doesn\'t Delete)')
						.addIntegerOption(option => option.setName('minutes').setDescription('Number of Minutes Each Star Message Lasts').setMinValue(0).setMaxValue(5).setRequired(true)))
				.addSubcommand(subcommand =>
					subcommand
						.setName('set_protect_streaks_protocol')
						.setDescription('Enable or disable users losing streak on latest post if deleted.')
						.addBooleanOption(option => option.setName('protect').setDescription('Enable or Disable').setRequired(true))))
		.addSubcommand(subcommand =>
			subcommand
				.setName('get_settings')
				.setDescription('Get a list of all your settings.')),
	permission: 'MANAGE_CHANNELS',
	async execute(interaction, client) {
		const protect = interaction.options.getBoolean('protect');
		const minutes = interaction.options.getInteger('minutes');

		const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guildId]);
		const setting = data.rows[0];

		if(minutes != undefined) {
			await client.pool.query('UPDATE guild_settings SET Delete_OT = $1 WHERE Guild_ID = $2', [minutes, interaction.guild.id]);
			try { return await interaction.reply((minutes == 0 ? 'Star Messages will no longer delete over time' : 'Star messages will delete after ' + minutes + ' minutes')).then(client.extra.log_g(client.logger, interaction.guild, 'Settings 1 Command', 'Confirm Reply')); }
			catch (err) { (client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - Settings 1 Command', String(err) + ' - Reply Denied')); }
		} else if(protect != undefined) {
			await client.pool.query('UPDATE guild_settings SET Streak_Protection_Protocol = $1 WHERE Guild_ID = $2', [protect, interaction.guild.id]);
			try { return await interaction.reply('Streak Protection Protocol Activation is now set to: ' + protect).then(client.extra.log_g(client.logger, interaction.guild, 'Settings 2 Command', 'Confirm Reply')); }
			catch (err) { (client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - Settings 2 Command', 'Reply Denied')); }
		} else {
			const embed =
				new EmbedBuilder()
					.setColor(Colors.DarkAqua)
					.setTitle(interaction.guild.name + '\'s Settings')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\n\
					Star Messages will be deleted after: **' + (setting.delete_ot == 0 ? 'Star Messages will no longer delete over time' : 'Star messages will delete after ' + setting.delete_ot + ' minutes') + '**\n\n\
					Streak Protection Protocol Activation is set to: **' + setting.streak_protection_protocol + '**\n\n\
					Default Server Timezone is: **' + setting.default_timezone + '**\n\n\
					Fitness Channel: **<#' + setting.channel_id + '>**\n\
					\n⠀')
					.setFooter({ text: 'Use the help command to if you need help to change any of these settings.' });

			try{ await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Get Settings Command', 'Confirm Reply')); }
			catch (err) {client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - Get Settings Command', 'Reply Denied'); }
		}
	},
};