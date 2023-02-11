/* eslint-disable max-statements-per-line */
const fs = require('fs');
const { Client, GatewayIntentBits, Collection, Partials, ActivityType, EmbedBuilder, Colors } = require('discord.js');
const { token, top_gg, db_pass, db_user } = require('./token.json');
const { Pool } = require('pg');
const extra = require('./extra_script');

const client = new Client({ intents: [GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers], partials: [Partials.Guilds, Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember, Partials.User] });

client.logger = fs.createWriteStream('./logs/' + Date.now() + '.txt', { flags : 'w' });
client.commands = new Collection();
client.commands_array = [];
client.ready = [false, false];
client.extra = extra;
client.stars = 0;

const { AutoPoster } = require('topgg-autoposter');
const ap = new AutoPoster(top_gg, client);

const pool = new Pool({
	database: 'fitstreaks',
	user: db_user,
	password: db_pass,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});

client.pool = pool;

['Commands'].forEach(handler => {
	require('./bot_modules/handlers/' + handler)(client, token);
});


// Events
fs.readdirSync('./bot_modules/events/').forEach((dir) => {
	const eventFiles = fs
		.readdirSync(`./bot_modules/events/${dir}/`)
		.filter((file) => file.endsWith('.js'));
	eventFiles.forEach(async (file) => {
		const event = require(`./bot_modules/events/${dir}/${file}`);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, client));
		} else {
			client.on(event.name, (...args) => event.execute(...args, client));
		}
	});
});
/*
// Commands
fs.readdirSync('./bot_modules/commands/').forEach((dir) => {
	const commandFiles = fs
		.readdirSync(`./bot_modules/commands/${dir}/`)
		.filter((file) => file.endsWith('.js'));
	commandFiles.forEach(async (file) => {
		const command = require(`./bot_modules/commands/${dir}/${file}`);
		commands.push(command.data.toJSON());
		client.commands.set(command.data.name, command);
	});
});
*/

function convertTZ(date, tzString) {
	return new Date((typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', { timeZone: tzString }));
}

async function status() {

	const data = await client.pool.query('SELECT SUM(Stars_Collected) AS sum_stars FROM user_stats;');
	const stats = data.rows[0];

	let firstPart = client.guilds.cache.size + ' servers';
	if(client.extra.random(0, 100) % 3 == 1) firstPart = client.extra.nFormatter(client.guilds.cache.reduce((sum, g) => sum + g.memberCount, 0)).toString() + ' members ';


	try{ await client.user.setActivity(firstPart + ' collect ' + extra.nFormatter(stats.sum_stars) + ' stars!', { type: ActivityType.Watching });} catch {console.error;}
}

async function checkChallenges() {
	const raw_challenge = await client.pool.query('SELECT * FROM challenge_data WHERE Reminder_TS < $1 AND Reminded = FALSE;', [Math.floor(Date.now() / 1000)]);
	const challenge_data = raw_challenge.rows;

	await client.pool.query('UPDATE challenge_data SET Reminded = TRUE WHERE Reminder_TS < $1 AND Reminded = FALSE;', [Math.floor(Date.now() / 1000)]);


	//Get guild ids
	const guild_ids = [];
	for(let i = 0; i < challenge_data.length; i++) {
		guild_ids.push(challenge_data[i].guild_id);
	}
	
	if(guild_ids.length == 0) return;
	
	const filtered_ids = guild_ids.filter(extra.onlyUnique);

	// Send Message
	for(let i = 0; i < filtered_ids; i++)
	{
		const user_ids = [];

		const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [filtered_ids[i]]);
		const setting = data.rows[0];

		for(let j = 0; j < challenge_data.length; j++) {
			if(challenge_data[j].guild_id == filtered_ids[i]) {
				user_ids.push(challenge_data[j].member_id);
			}
		}

		const filtered_users = user_ids.filter(extra.onlyUnique);

		const channel =  await client.channels.fetch(setting.channel_id);

		const embed = new EmbedBuilder()
			.setColor(Colors.Green)
			.setTitle('🎯   Challenge Alarm!   🎯')
		// eslint-disable-next-line spaced-comment
		//.setThumbnail(user.defaultAvatarURL)
			.setDescription('⠀\nLooks like ' + filtered_users.map(u => '<@' + u + '>') + ' has a challenge that needs to be reviewed!\n\nTime to check your challenges!\n⠀')
			.setFooter({ text: 'Check your challenges using /viewchallenges!' });
		try{return await channel.send({ embeds: [embed] });}
		catch (err) {client.extra.simple_log(client.logger, filtered_ids[i].guild_id + ' - Alarm Denied\n' + String(err));}
	}
}

async function checkGuildTime() {
	const timezones = extra.timezones;

	for(let i = 0; i < timezones.length; i++) {
		try {
			const timezone = timezones[i];

			const date = new Date();
			const time = convertTZ(date, timezone);
			if(time.getHours() == 0 && time.getMinutes() == 0) {
				const dateTS = Math.floor(new Date(new Date().toLocaleDateString('en-US', { timeZone: timezone, timeZoneName: 'short' })).getTime() / 1000.0);

				// eslint-disable-next-line curly
				if(dateTS == undefined || isNaN(dateTS)) console.log('bad timezone: ' + timezone);
				else {
					await pool.query('UPDATE user_data SET Stars = 0, New_Day_TS = $1 WHERE Timezone = $2 AND sent_condition = FALSE AND rest_mode = FALSE AND sick_mode = FALSE And vaca_mode = FALSE;', [dateTS, timezone]);
					await pool.query('UPDATE user_data SET sent_condition = FALSE, rest_mode = FALSE, New_Day_TS = $1 WHERE Timezone = $2;', [dateTS, timezone]);
					console.log('good timezone: ', timezone);
				}
			}
		} catch (e) {
			console.log(e.stack);
		}
	}
	// Double Check
	await pool.query('UPDATE user_data SET Stars = 0, New_Day_TS = New_Day_TS + 86400 WHERE New_Day_TS < $1 AND sent_condition = FALSE AND rest_mode = FALSE AND sick_mode = FALSE and vaca_mode = FALSE;', [Math.floor(Date.now() / 1000) - 86400]);
	await pool.query('UPDATE user_data SET sent_condition = FALSE, rest_mode = FALSE, New_Day_TS = New_Day_TS + 86400 WHERE New_Day_TS < $1;', [Math.floor(Date.now() / 1000) - 86400]);
}

ap.on('posted', () => {
	client.extra.simple_log(client.logger, 'Top.gg stats posted!');
});

setInterval(async function() {checkGuildTime();}, 60000);

setInterval(async function() {status();}, 60000);

setInterval(async function() {checkChallenges();}, 60000);

client.login(token);