// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'setpersonaltimezone',
	description: 'Set your personal timezone! (VIA Timezone or Clock)',
	data: new SlashCommandBuilder()
		.setName('setpersonaltimezone')
		.setDescription('Set your personal timezone! (VIA Timezone or Clock)')
		.addStringOption(option =>
			option.setName('timezone')
				.setDescription('Enter your personal timezone or the time.').setRequired(true)
				.setAutocomplete(true)),
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */

	async execute(interaction, client) {
		const timezones = client.extra.timezones;
		const time = interaction.options.getString('timezone');

		const guild = await interaction.guild;

		if(timezones.includes(time) != true) {
			try { return await interaction.reply({ content: 'Opps that timezone wasn\'t right. Make sure not to make any edits to the auto fill selection.', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
		}

		const dateTS = Math.floor(new Date(new Date().toLocaleDateString('en-US', { timeZone: time, timeZoneName: 'short' })).getTime() / 1000.0);

		await client.pool.query('UPDATE user_data SET timezone = $1 WHERE Guild_ID = $2 AND Member_ID = $3', [time, interaction.guild.id, interaction.member.id]);
		try{ return await interaction.reply({ content: time + ' is now your personal timezone! Your refresh will now be at <t:' + dateTS + ':t>.', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Confirm Reply')); }
		catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
	},
};