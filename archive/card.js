const { registerFont, createCanvas, loadImage } = require('canvas');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js');


module.exports = {
	name: 'card',
	description: 'View the user\'s egg card.',
	category: 'Profile',
	demo: '/card',
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('card')
		.setDescription('View the user\'s egg card.')
		.addUserOption(option => option.setName('target').setDescription('The card of that user.')),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const guildId = interaction.guildId;
		const target = interaction.options.getUser('target');
		let user = interaction.user;
		if (target != undefined) {user = target;}
		// Get User Index

		if (target && !target.bot)
		{
			const raw_guild = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [guildId]);
			const guild_data = raw_guild.rows[0];

			user = target;
			const dateTS = Math.floor(new Date(new Date().toLocaleDateString('en-US', { timeZone: guild_data.default_timezone, timeZoneName: 'short' })).getTime() / 1000.0);
			await client.pool.query('INSERT INTO user_data (Guild_ID, Member_ID, Timezone, New_Day_TS) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;', [interaction.guildId, user.id, guild_data.default_timezone, dateTS]);
			await client.pool.query('INSERT INTO user_stats (Guild_ID, Member_ID) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [interaction.guildId, user.id]);
		}
		else if (target && target.bot) {
			try{return await interaction.reply({ content: target.username + ' is a bot. It is optimized 1000% already!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'No Present Warning Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Card Command', 'Reply Denied');}
		}

		const raw_user = await client.pool.query('SELECT * FROM user_data WHERE Member_ID = $1 AND Guild_ID = $2;', [user.id, interaction.guildId]);
		const user_data = raw_user.rows[0];

		const raw_stats = await client.pool.query('SELECT * FROM user_stats WHERE Member_ID = $1 AND Guild_ID = $2;', [user.id, interaction.guildId]);
		const user_stats = raw_stats.rows[0];

		registerFont('./card/Count.ttf', { family: 'name' });
		registerFont('./card/Points.ttf', { family: 'points' });
		registerFont('./card/Rank.ttf', { family: 'ranks' });
		registerFont('./card/Title.ttf', { family: 'title' });
		registerFont('./card/LB.ttf', { family: 'server' });

		const canvas = createCanvas(1200, 500);
		const context = canvas.getContext('2d');
		const background = await loadImage('./card/Card.png');

		context.drawImage(background, 0, 0, canvas.width, canvas.height);

		context.fillStyle = '#c5e7e4';
		context.font = '60px title';
		context.fillText(user.username, 185, 88);

		const role = await client.extra.getBiggestRole(client, user, interaction.guild, client.extra.random());

		if(role != undefined) {
			context.fillStyle = '#74ccd1';
			context.font = '32px "ranks"';
			context.fillText(role.name, 185, 143);
		}

		context.fillStyle = '#80c4b8';
		context.font = '50px points';
		context.fillText('Collected Net Stars - ' + user_stats.collected_stars, 40, 390);

		context.fillStyle = '#53adbc';
		context.font = '50px points';
		context.fillText('Highest Streak - ' + user_stats.highest_streak, 40, 460);

		context.fillStyle = '#FFFFFF';
		context.strokeStyle = 'black';
		context.textAlign = 'center';

		context.fillStyle = '#60c5e8';
		context.textAlign = 'end';
		context.font = '60px name';
		context.fillText('Stars: ' + user_data.stars, 1175, 468);

		context.beginPath();
		context.arc(95, 95, 65, 0, Math.PI * 2, true);
		context.closePath();
		context.clip();
		console.log(1);
		const avatar = await loadImage(interaction.user.displayAvatarURL({ extension: 'jpg' }));
		console.log(1);
		context.drawImage(avatar, 30, 30, 130, 130);
		console.log(1);
		// End
		const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: user.username + '_' + Date.now().toString() + '.png' });
		console.log(1);
		try{await interaction.reply({ files: [attachment] }).then(client.extra.log_g(client.logger, interaction.guild, 'Card Command', 'Bot Reply'));}
		catch(e) { client.extra.log_error_g(client.logger, interaction.guild, String(e) + ' - Card Command', 'Reply Denied'); }

	},
};