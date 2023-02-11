// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'setstatus',
	description: 'Set your status to show off on your /journey',
	data: new SlashCommandBuilder()
		.setName('setstatus')
		.setDescription('Set your status to show off on your /journey')
		.addStringOption(option =>
			option.setName('status')
				.setDescription('The status of what mood you are in.').setRequired(true)
				.setAutocomplete(true)),
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */

	async execute(interaction, client) {
		const emojis = client.extra.emojis;
		const emoji = interaction.options.getString('status');

		const guild = await interaction.guild;

		if(emojis.includes(emoji) != true) {
			try { return await interaction.reply({ content: 'Opps that status wasn\'t right. Make sure not to make any edits to the auto fill selection.', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
		}

		await client.pool.query('UPDATE user_data SET status = $1 WHERE Guild_ID = $2 AND Member_ID = $3', [emoji, interaction.guild.id, interaction.member.id]);
		try{ return await interaction.reply({ content: emoji + ' is now your status! Check out with **/journey**', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Confirm Reply')); }
		catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + ' Command', 'Reply Denied'); }
	},
};