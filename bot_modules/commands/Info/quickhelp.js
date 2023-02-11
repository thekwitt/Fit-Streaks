// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'quickhelp',
	description: 'Quick Overview for Users and Mods',
	data: new SlashCommandBuilder()
		.setName('quickhelp')
		.setDescription('Quick Overview for Users and Mods'),
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */

	async execute(interaction, client) {

		const raw_user = await client.pool.query('SELECT * FROM user_data WHERE Guild_ID = $1 AND Member_ID = $2;', [interaction.guildId, interaction.user.id]);
		const user = raw_user.rows;

		const dateTS = Math.floor(new Date(new Date().toLocaleDateString('en-US', { timeZone: user.timezone, timeZoneName: 'short' })).getTime() / 1000.0);

		try{ return await interaction.reply({ content: '**__Users__**\n\nTo get started, simply post in the health channel and react to it with a star. The bot will take that message and record it then give you an actual star and start a streak for you! This streak can grow as long as you post every day to show your progress in anything that is part of your journey! It can be as simple as a gym log, what you did activity wise, what health foods you cooked, step counter, research and etc.\n\nThe end of the day is dependent on your timezone is. It looks like the end of your day is <t:' + dateTS + ':t>. You can change that by changing your time zone with **/setpersonaltimezone**.\n\nOne last thing, if you ever feel like you can\'t continue for another day, use the **/restmode** command to give yourself a rest day! You have up to 2 at a time that will restore after you post again. To see what other commands you can use, check out **/help commands**.\n\n\n**__Mods__**\n\nTo get started with your server, use the **/setup** command on a channel that you would like to have streaks posted! The command will ask for a channel, the main timezone of all your community members and if you want to setup the star streak role automatically.\n\nModerators can do a couple things to control the bot. To get rid of a streak that it\'s off topic or you feel does not represent, react to a message with the star on it with 🚫. The message will be marked with the same emoji and will be removed as a streak. The user of the message will be prompted to repost again.\n\nYou can also change a couple settings, like if you want to change the channel, the timezones, messages from the bot to delete overtime and add roles that will be automatically given to people with a set amount of stars.\n\nTo see these tools, check out **/help commands**.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Confirm Reply')); }
		catch (err) { client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
	},
};