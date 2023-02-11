const { SlashCommandBuilder } = require('discord.js');

function isNum(val) {
	return !isNaN(val);
}

module.exports = {
	name: 'phrasemanagement',
	description: 'Update the phrases users get from streaks.',
	data: new SlashCommandBuilder()
		.setName('phrasemanagement')
		.setDescription('Update the phrases users get from streaks.')
		.addSubcommandGroup(group =>
			group
				.setName('first_star_phrases')
				.setDescription('Manage the phrases users get when they collect their very first star.')
				.addSubcommand(subcommand =>
					subcommand
						.setName('add_phrase')
						.setDescription('Add a first star phrase (Up to 5)')
						.addStringOption(option => option.setName('phrase').setDescription('The message the user will get.').setMinLength(10).setRequired(true)))
				.addSubcommand(subcommand =>
					subcommand
						.setName('remove_phrase')
						.setDescription('Remove one of the first star phrases.')
						.addStringOption(option => option.setName('phrase').setDescription('The message the user will get.').setRequired(true).setAutocomplete(true))))
		.addSubcommandGroup(group =>
			group
				.setName('streak_phrases')
				.setDescription('Manage the phrases users get when they collect a star.')
				.addSubcommand(subcommand =>
					subcommand
						.setName('add_phrase')
						.setDescription('Add a streak phrase (Up to 5)')
						.addStringOption(option => option.setName('phrase').setDescription('The message the user will get.').setMinLength(10).setRequired(true)))
				.addSubcommand(subcommand =>
					subcommand
						.setName('remove_phrase')
						.setDescription('Remove one of the streak phrases.')
						.addStringOption(option => option.setName('phrase').setDescription('The message the user will get.').setRequired(true).setAutocomplete(true))))
		.addSubcommandGroup(group =>
			group
				.setName('start_over_phrases')
				.setDescription('Manage the phrases users get when they start a new streak. (Users who already posted before)')
				.addSubcommand(subcommand =>
					subcommand
						.setName('add_phrase')
						.setDescription('Add a start over phrase (Up to 5)')
						.addStringOption(option => option.setName('phrase').setDescription('The message the user will get.').setMinLength(10).setRequired(true)))
				.addSubcommand(subcommand =>
					subcommand
						.setName('remove_phrase')
						.setDescription('Remove one of the start over phrases.')
						.addStringOption(option => option.setName('phrase').setDescription('The message the user will get.').setRequired(true).setAutocomplete(true)))),
	permission: 'MANAGE_CHANNELS',
	async execute(interaction, client) {
		const phrase_val = interaction.options.getString('phrase');
		const guild = interaction.guild;

		const command = interaction.options._group;
		const type = interaction.options._subcommand;

		const raw_guild = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guildId]);
		const guild_data = raw_guild.rows[0];


		switch(command) {
		case 'first_star_phrases':
			if(type === 'add_phrase') {
				if(guild_data.first_time_phrases.length >= 5) {
					try { return await interaction.reply('Looks like you already have five phrases for first time users. Please remove one of them before you add another one.').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
					catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
				}

				guild_data.first_time_phrases.push(phrase_val);
				await client.pool.query('UPDATE guild_settings SET first_time_phrases = $1 WHERE Guild_ID = $2', [guild_data.first_time_phrases, interaction.guild.id]);

				try { return await interaction.reply('Phrase added.').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
				catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }

			} else if (type === 'remove_phrase') {
				if(guild_data.first_time_phrases.length == 0) {
					try { return await interaction.reply('You have no phrases to get rid of.').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
					catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
				}

				if(!isNum(phrase_val)) {
					try { return await interaction.reply('Oops that phrase wasn\'t right. Make sure not to make any edits to the auto fill selection.').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
					catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
				}

				const num = Number(phrase_val);
				guild_data.first_time_phrases.splice(num, 1);

				await client.pool.query('UPDATE guild_settings SET first_time_phrases = $1 WHERE Guild_ID = $2', [guild_data.first_time_phrases, interaction.guild.id]);
				try { return await interaction.reply('Phrase removed.').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
				catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
			}
			break;

		case 'streak_phrases':
			if(type === 'add_phrase') {
				if(guild_data.streak_phrases.length >= 5) {
					try { return await interaction.reply('Looks like you already have five phrases for regular streak users. Please remove one of them before you add another one.').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
					catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
				}

				guild_data.streak_phrases.push(phrase_val);
				await client.pool.query('UPDATE guild_settings SET streak_phrases = $1 WHERE Guild_ID = $2', [guild_data.streak_phrases, interaction.guild.id]);

				try { return await interaction.reply('Phrase added.').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
				catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
			} else if (type === 'remove_phrase') {
				if(guild_data.streak_phrases.length == 0) {
					try { return await interaction.reply('You have no phrases to get rid of.').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
					catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
				}

				if(!isNum(phrase_val)) {
					try { return await interaction.reply('Oops that phrase wasn\'t right. Make sure not to make any edits to the auto fill selection.').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
					catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
				}

				const num = Number(phrase_val);
				guild_data.streak_phrases.splice(num, 1);

				await client.pool.query('UPDATE guild_settings SET streak_phrases = $1 WHERE Guild_ID = $2', [guild_data.streak_phrases, interaction.guild.id]);
				try { return await interaction.reply('Phrase removed.').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
				catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
			}
			break;

		case 'start_over_phrases':
			if(type === 'add_phrase') {
				if(guild_data.start_over_phrases.length >= 5) {
					try { return await interaction.reply('Looks like you already have five phrases for users who start over their streak. Please remove one of them before you add another one.').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
					catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
				}

				guild_data.start_over_phrases.push(phrase_val);
				await client.pool.query('UPDATE guild_settings SET start_over_phrases = $1 WHERE Guild_ID = $2', [guild_data.start_over_phrases, interaction.guild.id]);

				try { return await interaction.reply('Phrase added.').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
				catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
			} else if (type === 'remove_phrase') {
				if(guild_data.start_over_phrases.length == 0) {
					try { return await interaction.reply('You have no phrases to get rid of.').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
					catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
				}

				if(!isNum(phrase_val)) {
					try { return await interaction.reply('Oops that phrase wasn\'t right. Make sure not to make any edits to the auto fill selection.').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
					catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
				}

				const num = Number(phrase_val);
				guild_data.start_over_phrases.splice(num, 1);

				await client.pool.query('UPDATE guild_settings SET start_over_phrases = $1 WHERE Guild_ID = $2', [guild_data.start_over_phrases, interaction.guild.id]);
				try { return await interaction.reply('Phrase removed.').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
				catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
			}
			break;
		}
	},
};