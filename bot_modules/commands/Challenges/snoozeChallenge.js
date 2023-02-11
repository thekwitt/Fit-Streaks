const { SlashCommandBuilder } = require('discord.js');

// eslint-disable-next-line no-unused-vars

function addMonths(date, months) {
	const d = date.getDate();
	date.setMonth(date.getMonth() + +months);
	if (date.getDate() != d) {
		date.setDate(0);
	}
	return 	Math.floor(date.getTime() / 1000.0);
}

function addWeeks(date, days) {
	const result = new Date(date);
	result.setDate(result.getDate() + days * 7);
	return 	Math.floor(result.getTime() / 1000.0);
}

function addDays(date, days) {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return 	Math.floor(result.getTime() / 1000.0);
}

function addHours(date, hours) {
	date.setHours(date.getHours() + hours);
	return 	Math.floor(date.getTime() / 1000.0);
}

function addMinutes(date, minutes) {
	date.setMinutes(date.getMinutes() + minutes);
	return 	Math.floor(date.getTime() / 1000.0);
}

module.exports = {
	name: 'snoozechallenge',
	description: 'Change when you want the challenge to be set to!',
	data: new SlashCommandBuilder()
		.setName('snoozechallenge')
		.setDescription('Change when you want the challenge to be set to!')
		.addStringOption(option => option.setName('description').setRequired(true).setDescription('The challenge description.').setAutocomplete(true))
		.addStringOption(option => option.setName('remindertype').setDescription('What type of time do you want to specify').addChoices({ name: 'Minutes', value: '0' }, { name: 'Hours', value: '1' }, { name: 'Days', value: '2' }, { name: 'Weeks', value: '3' }, { name: 'Months', value: '4' }).setRequired(true))
		.addIntegerOption(option => option.setName('remindertime').setDescription('How much of that time do you want to set?').setRequired(true)),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const guild = interaction.guild;
		const description = interaction.options.getString('description');
		const reminderType = interaction.options.getString('remindertype');
		const reminderTime = interaction.options.getInteger('remindertime');

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

		const timestamp = reminderType == '0' ? addMinutes(new Date(), reminderTime) : reminderType == '1' ? addHours(new Date(), reminderTime) : reminderType == '2' ? addDays(new Date(), reminderTime) : reminderType == '3' ? addWeeks(new Date(), reminderTime) : addMonths(new Date(), reminderTime);

		const ds = description.split('|');

		await client.pool.query('UPDATE challenge_data SET reminder_ts = $2, reminded = true WHERE challenge_id = $1;', [Number(ds[0]), timestamp]);

		try{await interaction.reply({ content: 'The challenge has been snoozed! You will now be reminded at <t:' + timestamp + '> to complete it.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Bot Reply'));}
		catch (err) {client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + ' Command', 'Reply Denied');}
	},
};