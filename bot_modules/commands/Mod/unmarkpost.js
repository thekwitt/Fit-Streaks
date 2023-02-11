// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'unmarkpost',
	description: 'Unmark a post from a user.',
	data: new SlashCommandBuilder()
		.setName('unmarkpost')
		.setDescription('Unmark a post from a user.')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The User to Unmark.').setRequired(true)),
	permission: 'MANAGE_CHANNELS',
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */

	async execute(interaction, client) {

		const u = interaction.options.getUser('user');

		const guildId = interaction.guildId;

		const raw_user = await client.pool.query('SELECT * FROM user_data WHERE Guild_ID = $1 AND Member_ID = $2;', [guildId, u.id]);
		const user = raw_user.rows;

		if(user[0] == undefined) {
			try{ return await interaction.reply({ content: 'This user hasn\'t done their streak post today.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Confirm Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
		} else if(user[0].sent_condition == true) {
			await client.pool.query('UPDATE user_data SET sent_condition = FALSE, stars = stars - 1, streaks = array_remove(streaks, $1) WHERE Guild_ID = $2 AND Member_ID = $3', [user[0].streaks[user[0].streaks.length - 1], guildId, u.id]);
			await client.pool.query('UPDATE user_stats SET stars_collected = stars_collected - 1 WHERE Guild_ID = $1 AND Member_ID = $2', [guildId, u.id]);

			try{await interaction.reply({ content: 'Uh oh! <@' + u.id + '>. Looks like a mod rejected your streak post! Be sure to post something that is on topic and react to it with a star.' }).then(client.extra.log_g(client.logger, interaction.guild, 'Get Star Event', 'Bot Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Get Star Event', 'Reply Denied');}
		} else {
			try{ return await interaction.reply({ content: 'This user hasn\'t done their streak post today.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Confirm Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
		}
	},
};