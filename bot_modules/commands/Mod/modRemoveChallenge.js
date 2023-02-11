const { SlashCommandBuilder } = require('discord.js');

// eslint-disable-next-line no-unused-vars

module.exports = {
	name: 'modremovechallenge',
	description: 'Remove a challenge from any user!',
	data: new SlashCommandBuilder()
		.setName('modremovechallenge')
		.setDescription('Remove a challenge from any user!')
		.addUserOption(option => option.setName('user').setRequired(true).setDescription('The user you want to remove a challenge from.'))
		.addStringOption(option => option.setName('description').setRequired(true).setDescription('The challenge description.').setAutocomplete(true)),
	permission: 'MANAGE_CHANNELS',
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const guild = interaction.guild;
		const description = interaction.options.getString('description');

		const raw_challenge = await client.pool.query('SELECT * FROM challenge_data WHERE Member_ID = $1 AND Guild_ID = $2;', [interaction.user.id, interaction.guildId]);
		const challenge_data = raw_challenge.rows;

		const c_rows = [];

		for(let i = 0; i < challenge_data.length; i++) {
			c_rows.push(challenge_data[i].challenge_id + '|' + interaction.guildId + '|' + interaction.user.id);
		}

		if(!c_rows.includes(description)) {
			try { return await interaction.reply('Oops that challenge wasn\'t right. Make sure not to make any edits to the auto fill selection.').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
		}

		const ds = description.split('|');

		await client.pool.query('DELETE from challenge_data WHERE challenge_id = $1;', [Number(ds[0])]);

		try{return await interaction.reply({ content: 'Challenge has been removed.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Bot Reply'));}
		catch (err) {client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + ' Command', 'Reply Denied');}
	},
};