const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: 'updatestars',
	description: 'Update a user\'s star streak',
	data: new SlashCommandBuilder()
		.setName('updatestars')
		.setDescription('Update a user\'s star streak')
		.addUserOption(option => option.setName('target').setDescription('The Person you want to update.').setRequired(true))
		.addIntegerOption(option => option.setName('stars').setDescription('Number of Stars').setMinValue(1).setMaxValue(100).setRequired(true)),
	permission: 'MANAGE_CHANNELS',
	async execute(interaction, client) {
		const target = interaction.options.getUser('target');
		const stars = interaction.options.getInteger('stars');

		if(target.bot) {
			interaction.reset_cooldown = true;
			try{return await interaction.reply({ content: target.username + ' is a bot. It doesn\'t have anything in the database.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'No Present Warning Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied');}
		}

		await client.pool.query('UPDATE user_data SET stars = $1 WHERE Guild_ID = $2 AND Member_ID = $3;', [stars, interaction.guildId, target.id]);

		try { return await interaction.reply({ content: target.username + ' has been updated.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Gave ID Reply')); }
		catch{ client.extra.log_error_g(client.logger, interaction.guild, this.name + ' Command', 'Reply Denied'); }
	},
};