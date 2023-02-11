const { EmbedBuilder, Colors, SlashCommandBuilder } = require('discord.js');

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
	name: 'addchallenge',
	description: 'Add a challenge!',
	data: new SlashCommandBuilder()
		.setName('addchallenge')
		.setDescription('Add a challenge!')
		.addStringOption(option =>
			option.setName('challenge')
				.setDescription('What are you challenging yourself?').setRequired(true).setMaxLength(200).setMinLength(10))
		.addStringOption(option => option.setName('remindertype').setDescription('What type of time do you want to specify').addChoices({ name: 'Minutes', value: '0' }, { name: 'Hours', value: '1' }, { name: 'Days', value: '2' }, { name: 'Weeks', value: '3' }, { name: 'Months', value: '4' }).setRequired(true))
		.addIntegerOption(option => option.setName('remindertime').setDescription('How much of that time do you want to set?').setRequired(true)),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const guild = interaction.guild;
		const description = interaction.options.getString('challenge');
		const reminderType = interaction.options.getString('remindertype');
		const reminderTime = interaction.options.getInteger('remindertime');

		const raw_challenge = await client.pool.query('SELECT * FROM challenge_data WHERE Member_ID = $1 AND Guild_ID = $2;', [interaction.user.id, interaction.guildId]);
		const challenge_data = raw_challenge.rows;

		if(challenge_data != undefined && challenge_data.length >= 5) {
			try { return await interaction.reply({ content: 'Oops! Looks like you already have five challenges you are working on. Make sure you complete those first or **/removechallenge** them to add another one.', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Challenge Length Exceed Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
		}

		if(challenge_data != undefined) {
			for(let i = 0; i < challenge_data.length; i++) {
				if(challenge_data[i].description.toLowerCase() == description.toLowerCase()) {
					try { return await interaction.reply({ content: 'Oops! Looks like you already challenged yourself to do that.', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Challenge Length Exceed Reply')); }
					catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
				}
			}
		}

		const timestamp = reminderType == '0' ? addMinutes(new Date(), reminderTime) : reminderType == '1' ? addHours(new Date(), reminderTime) : reminderType == '2' ? addDays(new Date(), reminderTime) : reminderType == '3' ? addWeeks(new Date(), reminderTime) : addMonths(new Date(), reminderTime);

		await client.pool.query('INSERT INTO challenge_data (Guild_ID, Member_ID, description, Reminder_TS) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;', [interaction.guildId, interaction.user.id, description, timestamp]);

		try{await interaction.reply({ content: 'The challenge has been accepted! You will be reminded at <t:' + timestamp + '> to complete it.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Bot Reply'));}
		catch (err) {client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + ' Command', 'Reply Denied');}


		const embed = new EmbedBuilder()
			.setColor(Colors.Aqua)
			.setTitle('🎯   ' + interaction.user.username + ' gave themselves a new challenge!   🎯')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.setDescription('⠀\nA new milestone has been set!\n\nThey challenged themselves to **"' + description + '!"**\n\nThey set themselves to complete this challenge at <t:' + timestamp + '>\n⠀')
			.setFooter({ text: 'They now have ' + ((challenge_data != undefined ? challenge_data.length : 0) + 1) + ' challenges' });

		try{return await interaction.followUp({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Bot Reply'));}
		catch (err) {client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + ' Command', 'Reply Denied');}
	},
};