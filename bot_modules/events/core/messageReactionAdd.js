// eslint-disable-next-line no-unused-vars
const { Client, PermissionFlagsBits, Colors } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');

function checkStar(reaction) {
	if (reaction.emoji.name == '⭐') return true;
	return false;
}

function checkObjection(reaction) {
	if (reaction.emoji.name == '🚫') return true;
	return false;
}

const getRandom = (items) => items[Math.floor(Math.random() * items.length)];

function firstTimeString(condition, data) {
	if (condition == true) {
		if(data.first_time_phrases.length != 0) return getRandom(data.first_time_phrases) + '\n\n';
		else return getRandom(['Looks like this is your first time posting! Great on you for starting this journey. Remember any post is progress! What matters is the end of the journey!', 'Looks like this is your first time posting! This is it! Your first steps into a better you. We all know you can do it!', 'Looks like this is your first time posting! Remember that steady consistency is key and try not to be afraid to go hard. This is all about you.'] + '\n\n');
	}

	return '';
}

function startOverString(condition, data) {
	if (condition == true) {
		if(data.start_over_phrases.length != 0) return getRandom(data.start_over_phrases) + '\n\n';
		else return getRandom(['Welcome back fit goer! Glad to see you get right back on your goals and your journey! Remember anything you post is progress no matter how small.', 'Welcome back fit goer! Every journey may need a break but what matters is how much stronger you impact yourself once you bounce back!', 'Welcome back fit goer! Get your water, your goal and that focus because this time you will be on your way to victory! We all cannot wait to see what you are capable of now.'] + '\n\n');
	}

	return '';
}

function streakString(condition, data) {
	if (condition == true) {
		if(data.streak_phrases.length != 0) return getRandom(data.streak_phrases) + '\n\n';
		else return getRandom(['Great work taking another step up the staircase! Keep climbing higher and higher!', 'Even if you feel like you can do better. Do it on your next post! Small or large, anything makes an impact.', 'Wow! You did a great deal today! Now hydrate yourself with some water. You definitely deserve it.'] + '\n\n');
	}

	return '';
}

async function streakFunction(reaction, member, client, guild, guild_data, guildId) {
	try {
		if(guild_data.setup == false) return;

		const m = client.extra.getMemberFromGuild(guild, member.id);

		if(reaction.message.channel == guild_data.channel_id && checkStar(reaction) == true) {

			const raw_user = await client.pool.query('SELECT * FROM user_data WHERE Guild_ID = $1 AND Member_ID = $2;', [guildId, member.id]);
			const user = raw_user.rows;

			const raw_stats = await client.pool.query('SELECT * FROM user_stats WHERE Guild_ID = $1 AND Member_ID = $2;', [guildId, member.id]);
			const user_stats = raw_stats.rows[0];

			const role_raw = await client.pool.query('SELECT * FROM role_data WHERE guild_id = $1 AND Type = 0', [guild.id]);
			const role_data = role_raw.rows;

			if(Math.floor(reaction.message.createdTimestamp / 1000) < user[0].new_day_ts - 1) return;

			if(user[0].streaks.includes(reaction.message.id)) return;

			const message_cache = await reaction.message.fetch();

			const id1 = member.id;
			const id2 = message_cache.author.id;
			if(id1 != id2) return;

			if(user[0].sent_condition == false) {
				await client.pool.query('UPDATE user_data SET new_user = FALSE, sent_condition = TRUE, stars = stars + 1, vaca_mode = FALSE, sick_mode = FALSE, rest_mode = FALSE, rest_days = $4, streaks = array_append(streaks, $1) WHERE Guild_ID = $2 AND Member_ID = $3', [reaction.message.id, guildId, reaction.message.author.id, (user[0].rest_days >= 2 ? user[0].rest_days : user[0].rest_days + 1)]);
				if(user_stats.highest_streak < user[0].stars + 1) await client.pool.query('UPDATE user_stats SET highest_streak = $1, stars_collected = stars_collected + 1 WHERE Guild_ID = $2 AND Member_ID = $3', [user[0].stars + 1, guildId, reaction.message.author.id]);
				else await client.pool.query('UPDATE user_stats SET stars_collected = stars_collected + 1 WHERE Guild_ID = $1 AND Member_ID = $2', [guildId, reaction.message.author.id]);
				// Role Management
				await client.extra.roleManagement(client, message_cache.member, guild);

				// Send Message
				try{ await message_cache.react('⭐'); }
				catch { ; }

				let role_capture = undefined;

				for(let i = 0; i < role_data.length; i++) {
					if(role_data[i].stars_required == user[0].stars + 1 && user[0].stars + 1 != 1) {
						role_capture = role_data[i];
					}
				}

				let dateTS = undefined;
				if(user[0].stars == 0) dateTS = Math.floor(new Date(new Date().toLocaleDateString('en-US', { timeZone: guild_data.default_timezone, timeZoneName: 'short' })).getTime() / 1000.0);

				const bucketEmbed = new EmbedBuilder()
					.setColor(Colors.LuminousVividPink)
					.setTitle('⭐   You collected a star!   ⭐')
					.setDescription('⠀\n**' + guild_data.response_title + '**\n\n' + firstTimeString(user[0].stars == 0 && user[0].new_user == true, guild_data) + startOverString(user[0].stars == 0 && user[0].new_user != true, guild_data) + streakString(user[0].stars != 0, guild_data) + (role_capture != undefined ? 'Holy smokes! You\'ve been doing so well you deserve a new role! You now have the <@&' + role_capture.role_id + '> role for getting ' + role_capture.stars_required + ' stars! Keep on going!\n\n' : '') + (user[0].stars == 0 ? 'As a reminder, the default time for the server refreshing streaks is <t:' + dateTS + ':t>. If you want to change this, please use the **/setpersonaltimezone** command to change your timezone.\n\n' : '') + '**You now have a streak of ' + (user[0].stars + 1) + ' star' + (user[0].stars + 1 != 1 ? 's' : '') + '!**\n⠀')
					.setFooter({ text: 'Come back tomorrow to do your next post!' });
				if(guild_data.delete_ot != 0) {
					try{await reaction.message.reply({ embeds: [bucketEmbed] }).then(mess => setTimeout(() => mess.delete(), guild_data.delete_ot * 60000));
						client.extra.log_g(client.logger, guild, 'Success Reply 1', 'Bot Reply');}
					catch{client.extra.log_error_g(client.logger, guild, 'Success Reply 1', 'Reply Denied');}
				} else {
					try{await reaction.message.reply({ embeds: [bucketEmbed] });
						client.extra.log_g(client.logger, guild, 'Success Reply 1', 'Bot Reply');}
					catch{client.extra.log_error_g(client.logger, guild, 'Success Reply 1', 'Reply Denied');}
				}
			} else {
				try {
					const old_message = await message_cache.channel.messages.fetch(user[0].streaks[user[0].streaks.length - 1]);

					try{ await old_message.reactions.cache.get('⭐').remove(); }
					catch { ; }

					try{ await message_cache.react('⭐'); }
					catch { ; }

					user[0].streaks[user[0].streaks.length - 1] = reaction.message.id;
					await client.pool.query('UPDATE user_data SET vaca_mode = FALSE, sick_mode = FALSE, rest_mode = FALSE, streaks = $1 WHERE Guild_ID = $2 AND Member_ID = $3', [user[0].streaks, guildId, id2]);


					// Role Management
					await client.extra.roleManagement(client, message_cache.member, guild);

					// Send Message
					if(guild_data.delete_ot != 0) {
						try{await reaction.message.reply({ content: 'Looks like you already posted a streak for today! But we\'ll mark this message as your new streak post.' }).then(mess => setTimeout(() => mess.delete(), guild_data.delete_ot * 60000));
							client.extra.log_g(client.logger, guild, 'Success Reply 2', 'Bot Reply');}
						catch{client.extra.log_error_g(client.logger, guild, 'Success Reply 2', 'Reply Denied');}
					} else {
						try{await reaction.message.reply({ content: 'Looks like you already posted a streak for today! But we\'ll mark this message as your new streak post.' });
							client.extra.log_g(client.logger, guild, 'Success Reply 2', 'Bot Reply');}
						catch{client.extra.log_error_g(client.logger, guild, 'Success Reply 2', 'Reply Denied');}
					}

				} catch {
					try{ await message_cache.react('⭐'); }
					catch { ; }

					user[0].streaks[user[0].streaks.length - 1] = reaction.message.id;
					await client.pool.query('UPDATE user_data SET streaks = $1 WHERE Guild_ID = $2 AND Member_ID = $3', [user[0].streaks, guildId, id2]);

					// Role Management
					await client.extra.roleManagement(client, message_cache.member, guild);

					// Send Message
					if(guild_data.delete_ot != 0) {
						try{await reaction.message.reply({ content: 'Looks like you already posted a streak for today! But we\'ll mark this message as your new streak post.' }).then(mess => setTimeout(() => mess.delete(), guild_data.delete_ot * 60000));
							client.extra.log_g(client.logger, guild, 'Success Reply 3', 'Bot Reply');}
						catch{client.extra.log_error_g(client.logger, guild, 'Success Reply 3', 'Reply Denied');}
					} else {
						try{await reaction.message.reply({ content: 'Looks like you already posted a streak for today! But we\'ll mark this message as your new streak post.' });
							client.extra.log_g(client.logger, guild, 'Success Reply 3', 'Bot Reply');}
						catch{client.extra.log_error_g(client.logger, guild, 'Success Reply 3', 'Reply Denied');}
					}
				}
			}
		} else if (checkObjection(reaction) == true && m.permissions.has(PermissionFlagsBits.ManageMessages) == true) {
			const message_cache = await reaction.message.fetch();

			const id2 = message_cache.author.id;

			const raw_user = await client.pool.query('SELECT * FROM user_data WHERE Guild_ID = $1 AND Member_ID = $2;', [guild.id, id2]);
			const user = raw_user.rows;

			if(reaction.message.id == user[0].streaks[user[0].streaks.length - 1] && user[0].sent_condition == true) {

				try{ await message_cache.reactions.cache.get('⭐').remove(); }
				catch { ; }

				try{ await message_cache.react('🚫'); }
				catch { ; }

				await client.pool.query('UPDATE user_data SET sent_condition = FALSE, stars = stars - 1, streaks = array_remove(streaks, $1) WHERE Guild_ID = $2 AND Member_ID = $3', [user[0].streaks[user[0].streaks.length - 1], guildId, id2]);
				await client.pool.query('UPDATE user_stats SET stars_collected = stars_collected - 1 WHERE Guild_ID = $1 AND Member_ID = $2', [guildId, id2]);

				if(guild_data.delete_ot != 0) {
					try{await reaction.message.reply({ content: 'Uh oh! <@' + member.id + '>. Looks like a mod rejected your streak post! Be sure to post something that is on topic and react to it with a star.' }).then(mess => setTimeout(() => mess.delete(), guild_data.delete_ot * 60000));
						client.extra.log_g(client.logger, guild, 'Uh oh Event', 'Bot Reply');}
					catch{client.extra.log_error_g(client.logger, guild, 'Uh oh Event', 'Reply Denied');}
				} else {
					try{await reaction.message.reply({ content: 'Uh oh! <@' + member.id + '>. Looks like a mod rejected your streak post! Be sure to post something that is on topic and react to it with a star.' });
						client.extra.log_g(client.logger, guild, 'Uh oh Event', 'Bot Reply');}
					catch{client.extra.log_error_g(client.logger, guild, 'Uh oh Event', 'Reply Denied');}

				}
			}
		}
	} catch (error) {
		console.error('Something went wrong when fetching:', error);
		return;
	}
}

module.exports = {
	name: 'messageReactionAdd',
	async execute(reaction, member, client) {
		if(client.ready.every(v => v === true) && member.bot == false) {

			const guildId = reaction.message.guildId;
			const guild = reaction.message.guild;

			const raw_guild = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [guildId]);
			const guild_data = raw_guild.rows[0];

			if (guild_data == undefined) return;

			if(guild_data.default_timezone == '') {
				guild_data.default_timezone = 'America/New_York';
				await client.pool.query('UPDATE guild_settings SET default_timezone = $1 WHERE Guild_ID = $2', ['America/New_York', interaction.guild.id]);
			}

			const dateTS = Math.floor(new Date(new Date().toLocaleDateString('en-US', { timeZone: guild_data.default_timezone, timeZoneName: 'short' })).getTime() / 1000.0);

			await client.pool.query('INSERT INTO user_stats (Guild_ID, Member_ID) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [reaction.message.guildId, member.id]);
			await client.pool.query('INSERT INTO user_data (Guild_ID, Member_ID, Timezone, New_Day_TS) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;', [reaction.message.guildId, member.id, guild_data.default_timezone, dateTS]);
			await streakFunction(reaction, member, client, guild, guild_data, guildId);
		}
	},
};