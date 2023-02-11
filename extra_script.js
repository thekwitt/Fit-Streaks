function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const timezones = ['Pacific/Midway', 'America/Adak', 'America/Anchorage', 'Pacific/Gambier', 'America/Dawson_Creek', 'America/Ensenada', 'America/Los_Angeles', 'America/Chihuahua', 'America/Denver', 'America/Belize', 'America/Cancun', 'America/Chicago', 'Chile/EasterIsland', 'America/Bogota', 'America/Havana', 'America/New_York', 'America/Campo_Grande', 'America/Glace_Bay', 'America/Goose_Bay', 'America/Santiago', 'America/La_Paz', 'America/Argentina/Buenos_Aires', 'America/Montevideo', 'America/Araguaina', 'America/Godthab', 'America/Miquelon', 'America/Sao_Paulo', 'America/Noronha', 'Atlantic/Cape_Verde', 'Europe/Belfast', 'Africa/Abidjan', 'Europe/Dublin', 'Europe/Lisbon', 'Europe/London', 'Africa/Algiers', 'Africa/Windhoek', 'Atlantic/Azores', 'Atlantic/Stanley', 'Europe/Amsterdam', 'Europe/Belgrade', 'Europe/Brussels', 'Africa/Cairo', 'Africa/Blantyre', 'Asia/Beirut', 'Asia/Damascus', 'Asia/Gaza', 'Asia/Jerusalem', 'Africa/Addis_Ababa', 'Europe/Minsk', 'Asia/Dubai', 'Asia/Yerevan', 'Europe/Moscow', 'Asia/Tashkent', 'Asia/Dhaka', 'Asia/Yekaterinburg', 'Asia/Bangkok', 'Asia/Novosibirsk', 'Asia/Hong_Kong', 'Asia/Krasnoyarsk', 'Australia/Perth', 'Australia/Eucla', 'Asia/Irkutsk', 'Asia/Seoul', 'Asia/Tokyo', 'Australia/Brisbane', 'Australia/Hobart', 'Asia/Yakutsk', 'Australia/Lord_Howe', 'Asia/Vladivostok', 'Asia/Anadyr', 'Asia/Magadan', 'Pacific/Auckland', 'Pacific/Chatham', 'Pacific/Tongatapu', 'Pacific/Kiritimati'];

const emojis = ['Liftin 🏋️', 'Gymnastical 🤸', 'Ballin ⛹️', 'Runnin 🏃‍♂️', 'Holin 🏌️', 'Meditatin 🧘', 'Throwin 🤾', 'Swimmin 🏊', 'Climbin 🧗', 'Bikin 🚴', 'Rowin 🚣', 'Surfin 🏄', 'Vibin 🚶', 'Winnin 🏆', 'Trainin 🥋', 'Fightin 🥊', 'Pumpin 💥', 'Burnin 🔥', 'Goalin 🎯', 'Perfectin 💯'];

const properTimezones = [{
	'name': 'Pacific/Midway',
	'value': 'Pacific/Midway',
}, {
	'name': 'America/Adak',
	'value': 'America/Adak',
}, {
	'name': 'America/Anchorage',
	'value': 'America/Anchorage',
}, {
	'name': 'Pacific/Gambier',
	'value': 'Pacific/Gambier',
}, {
	'name': 'America/Dawson_Creek',
	'value': 'America/Dawson_Creek',
}, {
	'name': 'America/Ensenada',
	'value': 'America/Ensenada',
}, {
	'name': 'America/Los_Angeles',
	'value': 'America/Los_Angeles',
}, {
	'name': 'America/Chihuahua',
	'value': 'America/Chihuahua',
}, {
	'name': 'America/Denver',
	'value': 'America/Denver',
}, {
	'name': 'America/Belize',
	'value': 'America/Belize',
}, {
	'name': 'America/Cancun',
	'value': 'America/Cancun',
}, {
	'name': 'America/Chicago',
	'value': 'America/Chicago',
}, {
	'name': 'Chile/EasterIsland',
	'value': 'Chile/EasterIsland',
}, {
	'name': 'America/Bogota',
	'value': 'America/Bogota',
}, {
	'name': 'America/Havana',
	'value': 'America/Havana',
}, {
	'name': 'America/New_York',
	'value': 'America/New_York',
}, {
	'name': 'America/Campo_Grande',
	'value': 'America/Campo_Grande',
}, {
	'name': 'America/Glace_Bay',
	'value': 'America/Glace_Bay',
}, {
	'name': 'America/Goose_Bay',
	'value': 'America/Goose_Bay',
}, {
	'name': 'America/Santiago',
	'value': 'America/Santiago',
}, {
	'name': 'America/La_Paz',
	'value': 'America/La_Paz',
}, {
	'name': 'America/Argentina/Buenos_Aires',
	'value': 'America/Argentina/Buenos_Aires',
}, {
	'name': 'America/Montevideo',
	'value': 'America/Montevideo',
}, {
	'name': 'America/Araguaina',
	'value': 'America/Araguaina',
}, {
	'name': 'America/Godthab',
	'value': 'America/Godthab',
}, {
	'name': 'America/Miquelon',
	'value': 'America/Miquelon',
}, {
	'name': 'America/Sao_Paulo',
	'value': 'America/Sao_Paulo',
}, {
	'name': 'America/Noronha',
	'value': 'America/Noronha',
}, {
	'name': 'Atlantic/Cape_Verde',
	'value': 'Atlantic/Cape_Verde',
}, {
	'name': 'Europe/Belfast',
	'value': 'Europe/Belfast',
}, {
	'name': 'Africa/Abidjan',
	'value': 'Africa/Abidjan',
}, {
	'name': 'Europe/Dublin',
	'value': 'Europe/Dublin',
}, {
	'name': 'Europe/Lisbon',
	'value': 'Europe/Lisbon',
}, {
	'name': 'Europe/London',
	'value': 'Europe/London',
}, {
	'name': 'Africa/Algiers',
	'value': 'Africa/Algiers',
}, {
	'name': 'Africa/Windhoek',
	'value': 'Africa/Windhoek',
}, {
	'name': 'Atlantic/Azores',
	'value': 'Atlantic/Azores',
}, {
	'name': 'Atlantic/Stanley',
	'value': 'Atlantic/Stanley',
}, {
	'name': 'Europe/Amsterdam',
	'value': 'Europe/Amsterdam',
}, {
	'name': 'Europe/Belgrade',
	'value': 'Europe/Belgrade',
}, {
	'name': 'Europe/Brussels',
	'value': 'Europe/Brussels',
}, {
	'name': 'Africa/Cairo',
	'value': 'Africa/Cairo',
}, {
	'name': 'Africa/Blantyre',
	'value': 'Africa/Blantyre',
}, {
	'name': 'Asia/Beirut',
	'value': 'Asia/Beirut',
}, {
	'name': 'Asia/Damascus',
	'value': 'Asia/Damascus',
}, {
	'name': 'Asia/Gaza',
	'value': 'Asia/Gaza',
}, {
	'name': 'Asia/Jerusalem',
	'value': 'Asia/Jerusalem',
}, {
	'name': 'Africa/Addis_Ababa',
	'value': 'Africa/Addis_Ababa',
}, {
	'name': 'Europe/Minsk',
	'value': 'Europe/Minsk',
}, {
	'name': 'Asia/Dubai',
	'value': 'Asia/Dubai',
}, {
	'name': 'Asia/Yerevan',
	'value': 'Asia/Yerevan',
}, {
	'name': 'Europe/Moscow',
	'value': 'Europe/Moscow',
}, {
	'name': 'Asia/Tashkent',
	'value': 'Asia/Tashkent',
}, {
	'name': 'Asia/Dhaka',
	'value': 'Asia/Dhaka',
}, {
	'name': 'Asia/Yekaterinburg',
	'value': 'Asia/Yekaterinburg',
}, {
	'name': 'Asia/Bangkok',
	'value': 'Asia/Bangkok',
}, {
	'name': 'Asia/Novosibirsk',
	'value': 'Asia/Novosibirsk',
}, {
	'name': 'Asia/Hong_Kong',
	'value': 'Asia/Hong_Kong',
}, {
	'name': 'Asia/Krasnoyarsk',
	'value': 'Asia/Krasnoyarsk',
}, {
	'name': 'Australia/Perth',
	'value': 'Australia/Perth',
}, {
	'name': 'Australia/Eucla',
	'value': 'Australia/Eucla',
}, {
	'name': 'Asia/Irkutsk',
	'value': 'Asia/Irkutsk',
}, {
	'name': 'Asia/Seoul',
	'value': 'Asia/Seoul',
}, {
	'name': 'Asia/Tokyo',
	'value': 'Asia/Tokyo',
}, {
	'name': 'Australia/Brisbane',
	'value': 'Australia/Brisbane',
}, {
	'name': 'Australia/Hobart',
	'value': 'Australia/Hobart',
}, {
	'name': 'Asia/Yakutsk',
	'value': 'Asia/Yakutsk',
}, {
	'name': 'Australia/Lord_Howe',
	'value': 'Australia/Lord_Howe',
}, {
	'name': 'Asia/Vladivostok',
	'value': 'Asia/Vladivostok',
}, {
	'name': 'Asia/Anadyr',
	'value': 'Asia/Anadyr',
}, {
	'name': 'Asia/Magadan',
	'value': 'Asia/Magadan',
}, {
	'name': 'Pacific/Auckland',
	'value': 'Pacific/Auckland',
}, {
	'name': 'Pacific/Chatham',
	'value': 'Pacific/Chatham',
}, {
	'name': 'Pacific/Tongatapu',
	'value': 'Pacific/Tongatapu',
}, {
	'name': 'Pacific/Kiritimati',
	'value': 'Pacific/Kiritimati',
}];

async function deleteMessageAfterTime(client, message, time)
{
	setTimeout(async () => {

		if(message == undefined) return;

		if(message.channel == undefined) return;

		if (message.deleted === false)
		{
			try { await message.delete(); }
			catch { return; }
		}
	}, time);
}

async function addGuildStuff(guildid, client) {
	await client.pool.query('INSERT INTO guild_settings (Guild_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [guildid]);
}

function sortFunction(a, b) {
	if (a[1] === b[1]) {
		return 0;
	}
	else {
		return (a[1] > b[1]) ? -1 : 1;
	}
}

async function getBiggestRole(client, member, guild) {
	const role_raw = await client.pool.query('SELECT * FROM role_data WHERE guild_id = $1', [guild.id]);
	const role_data = role_raw.rows;

	if(role_data.length == 0) return undefined;

	const raw_user = await client.pool.query('SELECT * FROM user_data WHERE Guild_ID = $1 AND Member_ID = $2;', [guild.id, member.id]);
	const user_data = raw_user.rows[0];

	// Check if have lower roles

	const filteredLower = role_data.filter(r => r.stars_required <= user_data.stars);

	const newFilteredLower = [];

	for(let i = 0; i < filteredLower.length; i++) {
		newFilteredLower.push([filteredLower[i].role_id, filteredLower[i].stars_required]);
	}

	const sorted = newFilteredLower.sort(sortFunction);
	return guild.roles.cache.get(sorted.shift());
}

async function roleManagement(client, member, guild) {
	await rmPartOne(client, member, guild);
	await rmPartTwo(client, member, guild);
}

async function rmPartOne(client, member, guild) {
	const role_raw = await client.pool.query('SELECT * FROM role_data WHERE guild_id = $1 AND type = 0', [guild.id]);
	const role_data = role_raw.rows;

	if(role_data.length == 0) return;

	const raw_user = await client.pool.query('SELECT * FROM user_data WHERE Guild_ID = $1 AND Member_ID = $2;', [guild.id, member.id]);
	const user_data = raw_user.rows[0];

	// Check if have lower roles

	const filteredLower = role_data.filter(r => r.stars_required <= user_data.stars);

	const newFilteredLower = [];

	for(let i = 0; i < filteredLower.length; i++) {
		newFilteredLower.push([filteredLower[i].role_id, filteredLower[i].stars_required]);
	}

	const sorted = newFilteredLower.sort(sortFunction);
	const biggest = sorted.shift();

	for(let i = 0; i < sorted.length; i++) {
		if(member.roles.cache.has(sorted[i][0])) {
			try{ await member.roles.remove(sorted[i][0]); }
			catch{ ; }
		}
	}
	// Check if biggest low role is added

	if(biggest != undefined && !member.roles.cache.has(biggest[0])) {
		try{ await member.roles.add(biggest[0]); }
		catch{ ; }
	}
}

async function rmPartTwo(client, member, guild) {
	const role_raw = await client.pool.query('SELECT * FROM role_data WHERE guild_id = $1 AND type = 1', [guild.id]);
	const role_data = role_raw.rows;

	if(role_data.length == 0) return;

	const raw_user = await client.pool.query('SELECT * FROM user_data WHERE Guild_ID = $1 AND Member_ID = $2;', [guild.id, member.id]);
	const user_data = raw_user.rows[0];

	// Check if have lower roles

	const filteredLower = role_data.filter(r => r.stars_required <= user_data.challenges);

	const newFilteredLower = [];

	for(let i = 0; i < filteredLower.length; i++) {
		newFilteredLower.push([filteredLower[i].role_id, filteredLower[i].stars_required]);
	}

	const sorted = newFilteredLower.sort(sortFunction);
	const biggest = sorted.shift();

	for(let i = 0; i < sorted.length; i++) {
		if(member.roles.cache.has(sorted[i][0])) {
			try{ await member.roles.remove(sorted[i][0]); }
			catch{ ; }
		}
	}
	// Check if biggest low role is added

	if(biggest != undefined && !member.roles.cache.has(biggest[0])) {
		try{ await member.roles.add(biggest[0]); }
		catch{ ; }
	}
}

// eslint-disable-next-line no-unused-vars

function nFormatter(num, digits) {
	const lookup = [
		{ value: 1, symbol: '' },
		{ value: 1e3, symbol: 'k' },
		{ value: 1e6, symbol: 'M' },
		{ value: 1e9, symbol: 'B' },
		{ value: 1e12, symbol: 'T' },
		{ value: 1e15, symbol: 'P' },
		{ value: 1e18, symbol: 'E' },
	];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	// eslint-disable-next-line no-shadow
	const item = lookup.slice().reverse().find(function(item) {
		return num >= item.value;
	});
	return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
}

function zfill(number, digits) {
	if (number > 0) {
		return number.toString().padStart(digits, '0');
	} else {
		return '-' + Math.abs(number).toString().padStart(digits, '0');
	}
}

function shuffle(array) {
	let currentIndex = array.length, randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}
	return array;
}

function simple_log(logger, message) {
	logger.write('\ufeff' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' | ' + message + '\n');
}

function log(logger, guild, message) {
	try {
		logger.write('\ufeff' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' | ' + guild.name + ' [' + guild.memberCount + '] (' + guild.id.toString() + ') ' + ' - ' + message + '\n');
	} catch {
		simple_log(logger, message);
	}
}

function log_error(logger, guild, message) {
	try {
		logger.write('\ufeff' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' | 🔸 ERROR ' + guild.name + ' [' + guild.memberCount + '] (' + guild.id.toString() + ') ' + ' - ' + message + '\n');
	} catch {
		simple_log(logger, message);
	}
}

function log_g(logger, guild, message, group) {
	try{
		logger.write('\ufeff' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' | ' + guild.name + ' [' + guild.memberCount + '] (' + guild.id.toString() + ') ' + ' - ' + group + ': ' + message + '\n');
	} catch {
		simple_log(logger, message);
	}
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function log_error_g(logger, guild, message, group) {
	try {
		logger.write('\ufeff' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' | 🔸 ERROR ' + guild.name + ' [' + guild.memberCount + '] (' + guild.id.toString() + ') ' + ' - ' + group + ': ' + message + '\n');
	} catch {
		simple_log(logger, message);
	}
}

function getMemberFromGuild(guild, userid) {
	return guild.members.cache.get(userid);
}

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const getRandom = (items) => items[Math.floor(Math.random() * items.length)];

module.exports = { onlyUnique, emojis, timezones, properTimezones, sortFunction, getBiggestRole, roleManagement, getMemberFromGuild, addGuildStuff, log, log_error, log_g, log_error_g, simple_log, nFormatter, getRandom, shuffle, random, sleep, zfill, deleteMessageAfterTime };