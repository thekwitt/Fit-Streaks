module.exports = {
	name: 'messageDelete',
	async execute(message, client) {
		if(message.author == undefined) return;

		const raw_user = await client.pool.query('SELECT * FROM user_data WHERE Guild_ID = $1 AND Member_ID = $2;', [message.guildId, message.author.id]);
		const user = raw_user.rows;

		if(user[0] == undefined) return;

		const raw_guild = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1;', [message.guildId]);
		const guild_data = raw_guild.rows;

		if (guild_data.streak_protection_protocol == false) return;

		if (user[0] == undefined || user[0].streaks[user[0].streaks.length - 1] != message.id) return;

		if(user[0].sent_condition == true) {
			await client.pool.query('UPDATE user_data SET sent_condition = FALSE, stars = stars - 1, streaks = array_remove(streaks, $1) WHERE Guild_ID = $2 AND Member_ID = $3', [user[0].streaks[user[0].streaks.length - 1], message.guildId, message.author.id]);
			await client.pool.query('UPDATE user_stats SET stars_collected = stars_collected - 1 WHERE Guild_ID = $1 AND Member_ID = $2', [message.guildId, message.author.id]);

			try{await message.channel.send({ content: 'Uh oh! <@' + message.author.id + '>. Looks like you deleted one of your streak posts. Post it again or another one and react to it with a star!' }).then(client.extra.log_g(client.logger, message.guild, 'Get Star Event', 'Bot Reply'));}
			catch{client.extra.log_error_g(client.logger, message.guild, 'Get Star Event', 'Reply Denied');}
		} else {
			try{ return await message.channel.send({ content: 'This user hasn\'t done their streak post today.', ephemeral: true }).then(client.extra.log_g(client.logger, message.guild, this.name + ' Command', 'Confirm Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, message.guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
		}

	},
};