// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: 'rolelist',
	description: 'List of all the star roles on the server.',
	data: new SlashCommandBuilder()
		.setName('rolelist')
		.setDescription('List of all the star roles on the server.'),
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */

	async execute(interaction, client) {
		const role_raw = await client.pool.query('SELECT * FROM role_data WHERE guild_id = $1;', [interaction.guildId]);
		const role_data = role_raw.rows;

		const string = [];

		for(let i = 0; i < role_data.length; i++) {
			if(role_data[i].type == 0) string.push('<@&' + role_data[i].role_id + '> | **Requires a ' + role_data[i].stars_required + ' Star Streak**');
			else string.push('<@&' + role_data[i].role_id + '> | **Requires a ' + role_data[i].stars_required + ' Challenges Completed**');
		}

		try { await interaction.reply({ content: (string.length == 0 ? 'No roles have been currently added' : string.join('\n')), ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Not Text Reply')); }
		catch (err) { client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
	},
};