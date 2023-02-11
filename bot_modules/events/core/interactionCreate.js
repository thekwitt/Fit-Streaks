// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, Collection, EmbedBuilder, InteractionType, Colors } = require('discord.js');
const cooldowns = new Map();

function getTime(time, mode) {
	time = Math.floor(time / 1000) + 1;
	if(mode == 1) return time % 60;
	else if (mode == 2) return Math.floor(time / 60) % 60;
	else if (mode == 3) return Math.floor(time / 3600);
}

function convertTZ(date, tzString) {
	return new Date((typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', { timeZone: tzString }));
}

module.exports = {
	name: 'interactionCreate',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */

	async execute(interaction, client) {
		if(client.ready.every(v => v === true)) {
			const raw_guild = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guildId]);
			const guild_data = raw_guild.rows[0];

			if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
				if (['setpersonaltimezone', 'setup'].includes(interaction.commandName)) {
					const focusedValue = interaction.options.getFocused();
					const choices = client.extra.properTimezones;
					const filtered = choices.filter(choice => isNaN(Math.floor(new Date(new Date().toLocaleDateString('en-US', { timeZone: choice.value, timeZoneName: 'short' })).getTime() / 1000.0)) == false && (choice.name + ' | ' + convertTZ(new Date(), choice.value).toLocaleTimeString()).toLowerCase().includes(focusedValue.toLowerCase()));
					if(filtered.length >= 25) filtered.length = 24;

					/*
					for(let i = 0; i < filtered.length; i++) {
						filtered[i].name = filteredUntouched[i].name + ' - ' + convertTZ(new Date(), filtered[i].value).toLocaleTimeString();
					}
					*/

					await interaction.respond(
						filtered.map(choice => ({ name: choice.name + ' | ' + convertTZ(new Date(), choice.value).toLocaleTimeString(), value: choice.value })),
					);
				} else if (guild_data != undefined && interaction.options._subcommand != undefined && interaction.options._subcommand == 'remove_phrase') {

					const focusedValue = interaction.options.getFocused();
					let phrases = [];

					if(interaction.options._group == 'first_star_phrases') {
						phrases = guild_data.first_time_phrases;
					} else if (interaction.options._group == 'start_over_phrases') {
						phrases = guild_data.start_over_phrases;
					} else if (interaction.options._group == 'streak_phrases') {
						phrases = guild_data.streak_phrases;
					}

					let num = 0;

					const filtered = phrases.filter(phrase => ('Phrase ' + (++num) + ': ' + phrase).toLowerCase().includes(focusedValue.toLowerCase()));

					num = 0;

					await interaction.respond(
						filtered.map(choice => ({ name: ('Phrase ' + (++num) + ': ' + choice).substring(0, 80) + '...', value: (num - 1) + '' })),
					);

				} else if (['setstatus'].includes(interaction.commandName)) {
					const focusedValue = interaction.options.getFocused();
					const choices = client.extra.emojis;
					const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()));
					if(filtered.length >= 25) filtered.length = 24;
					await interaction.respond(
						filtered.map(choice => ({ name: choice, value: choice })),
					);
				} else if (['removechallenge', 'completechallenge', 'snoozechallenge'].includes(interaction.commandName)) {
					const focusedValue = interaction.options.getFocused();

					const raw_challenge = await client.pool.query('SELECT * FROM challenge_data WHERE Member_ID = $1 AND Guild_ID = $2;', [interaction.user.id, interaction.guildId]);
					const challenge_data = raw_challenge.rows;

					let num = 0;

					const filtered = challenge_data.filter(challenge => ('Challenge ' + (++num) + ': ' + challenge.description).toLowerCase().includes(focusedValue.toLowerCase()));

					num = 0;

					await interaction.respond(
						filtered.map(choice => ({ name: ('Challenge ' + (++num) + ': ' + choice.description).substring(0, 80) + '...', value: choice.challenge_id + '|' + interaction.guildId + '|' + interaction.user.id })),
					);
				} else if (['modremovechallenge'].includes(interaction.commandName)) {
					const remove_user = interaction.options.data[0];
					const focusedValue = interaction.options.getFocused();

					if(remove_user != undefined) {
						const raw_challenge = await client.pool.query('SELECT * FROM challenge_data WHERE Member_ID = $1 AND Guild_ID = $2;', [remove_user.value, interaction.guildId]);
						const challenge_data = raw_challenge.rows;

						let num = 0;

						const filtered = challenge_data.filter(challenge => ('Challenge ' + (++num) + ': ' + challenge.description).toLowerCase().includes(focusedValue.toLowerCase()));

						num = 0;

						await interaction.respond(
							filtered.map(choice => ({ name: ('Challenge ' + (++num) + ': ' + choice.description).substring(0, 80) + '...', value: choice.challenge_id + '|' + interaction.guildId + '|' + remove_user.value })),
						); 
					}
				}

			} else if(interaction.inGuild() && interaction.guild != undefined && interaction.type === InteractionType.ApplicationCommand) {
				const guildID = interaction.guildId;

				await client.extra.addGuildStuff(guildID, client);

				if(!['setup', 'help'].includes(interaction.commandName) && (guild_data == undefined || guild_data.setup == false)) {
					const bucketEmbed = new EmbedBuilder()
						.setColor(Colors.Blurple)
						.setTitle('Looks like the bot has not been setup yet.')
						.setDescription('Have a mod use **/setup** before you start using commands. (Must have Manage Channel Perms)')
						.setFooter({ text:'If you encounter anymore problems, please join https://discord.gg/ZNpCNyNubU and tag TheKWitt!' });
					try{return await interaction.reply({ embeds: [bucketEmbed] }).then(client.extra.log_g(client.logger, interaction.guild, this.name, 'Bot Not Setup Reply Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, this.name, 'Reply Denied');}
				}

				try{
					const dateTS = Math.floor(new Date(new Date().toLocaleDateString('en-US', { timeZone: guild_data.default_timezone, timeZoneName: 'short' })).getTime() / 1000.0);

					if(dateTS != undefined) {
						await client.pool.query('INSERT INTO user_stats (Guild_ID, Member_ID) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [interaction.guildId, interaction.user.id]);
						await client.pool.query('INSERT INTO user_data (Guild_ID, Member_ID, Timezone, New_Day_TS) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;', [interaction.guildId, interaction.user.id, guild_data.default_timezone, dateTS]);
					} else {
						console.log('Couldn\'t add user routing to default');
						const dateTSS = Math.floor(new Date(new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York', timeZoneName: 'short' })).getTime() / 1000.0);
						await client.pool.query('INSERT INTO user_stats (Guild_ID, Member_ID) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [interaction.guildId, interaction.user.id]);
						await client.pool.query('INSERT INTO user_data (Guild_ID, Member_ID, Timezone, New_Day_TS) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;', [interaction.guildId, interaction.user.id, 'America/New_York', dateTSS]);
					}
				} catch {
					console.log('Couldn\'t add user routing to default 2');
					const dateTS = Math.floor(new Date(new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York', timeZoneName: 'short' })).getTime() / 1000.0);
					await client.pool.query('INSERT INTO user_stats (Guild_ID, Member_ID) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [interaction.guildId, interaction.user.id]);
					await client.pool.query('INSERT INTO user_data (Guild_ID, Member_ID, Timezone, New_Day_TS) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;', [interaction.guildId, interaction.user.id, 'America/New_York', dateTS]);
				}

				if (interaction.type != InteractionType.ApplicationCommand) return;

				const { commandName } = interaction;

				if (!client.commands.has(commandName)) return;

				if (!interaction.guild) return;

				const authorPerms = interaction.channel.permissionsFor(interaction.member).toArray();
				for(let i = 0; i < authorPerms.length; i++) {
					authorPerms[i] = authorPerms[i].toLowerCase();
				}

				// Check Channel ID
				const command = client.commands.get(interaction.commandName);

				if(!cooldowns.has(commandName)) {
					cooldowns.set(commandName, new Collection());
				}

				const current_time = Date.now();
				const time_stamps = cooldowns.get(commandName);
				const cooldown_amount = (command.cooldown) * 1000;

				// Check Member ID + Guild ID
				if(time_stamps.has(interaction.member.id + '' + guildID)) {
					const expire_time = time_stamps.get(interaction.member.id + '' + guildID) + cooldown_amount;

					if(current_time < expire_time) {
						// eslint-disable-next-line no-unused-vars
						const time_left = expire_time - current_time;
						if(getTime(time_left, 3) > 0) {
							try{return await interaction.reply({ content: 'Looks like you\'ve used this command lately! Please wait ' + getTime(time_left, 3) + ' hours ' + getTime(time_left, 2) + ' minutes ' + getTime(time_left, 1) + ' seconds!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'Cooldown Reply'));}
							catch{client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event', 'Reply Denied');}
						}
						try{return await interaction.reply({ content: 'Looks like you\'ve used this command lately! Please wait ' + getTime(time_left, 2) + ' minutes ' + getTime(time_left, 1) + ' seconds!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'Cooldown Reply'));}
						catch{client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event', 'Reply Denied');}
					}
				}

				time_stamps.set(interaction.member.id + '' + guildID, current_time);
				cooldowns.set(commandName, time_stamps);
				setTimeout(() => time_stamps.delete(interaction.member.id + '' + interaction.guildId), cooldown_amount);

				client.extra.log_g(client.logger, interaction.guild, 'Command Used: ' + interaction.commandName, interaction.user.username + ' (' + interaction.member.id + ')');

				try {
					if(interaction.member.id == 198305088203128832) {
						try{ await command.execute(interaction, client).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', commandName + ' - Execution')); }
						catch(err) {
							console.log(err.stack);
							await interaction.reply({ content: 'There was an error while executing this command Please try again!', ephemeral: true });
							time_stamps.delete(interaction.member.id + '' + guildID);
							client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event - Look Below', commandName + ' - Execution Failed ');
							client.extra.simple_log(client.logger, String(err));
						}
					} else if(command.permission) {
						if(!authorPerms || (!authorPerms.includes(command.permission.toLowerCase().replace('_', '')))) {
							const bucketEmbed = new EmbedBuilder()
								.setColor(Colors.Red)
								.setTitle('You don\'t have permission to use this command.')
								.setDescription('You need the ability to ' + command.permission + ' to use this!')
								.setFooter({ text: 'If you encounter anymore problems, please join https://discord.gg/ZNpCNyNubU and tag TheKWitt!' });
							try{await interaction.reply({ embeds: [bucketEmbed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'Invalid Perms Reply'));}
							catch{client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event', 'Reply Denied');}

						// eslint-disable-next-line max-statements-per-line
						} else {
							try{ await command.execute(interaction, client).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', commandName + ' - Execution')); }
							catch(err) {
								console.log(err.stack);
								await interaction.reply({ content: 'There was an error while executing this command Please try again!', ephemeral: true });
								time_stamps.delete(interaction.member.id + '' + guildID);
								client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event - Look Below', commandName + ' - Execution Failed ');
								client.extra.simple_log(client.logger, String(err));
							}
						}
					// eslint-disable-next-line max-statements-per-line
					} else {
						try{ await command.execute(interaction, client).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', commandName + ' - Execution')); }
						catch (err) {
							console.log(err.stack);
							await interaction.reply({ content: 'There was an error while executing this command Please try again!', ephemeral: true });
							time_stamps.delete(interaction.member.id + '' + guildID);
							client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event - Look Below', commandName + ' - Execution Failed ');
							client.extra.simple_log(client.logger, String(err));
						}
					}

					if (interaction.reset_cooldown) time_stamps.delete(interaction.member.id + '' + guildID);

				} catch (error) {
					console.log(error.stack);
					console.error(error);
					try{await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'Error Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event', 'Reply Denied');}
				}
			}
		} else {
			try{await interaction.reply({ content: 'The bot is restarting! Please wait 10 seconds.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'Restarting Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event', 'Reply Denied');}
		}
	},
};