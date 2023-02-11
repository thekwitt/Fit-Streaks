// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PermissionFlagsBits, Colors } = require('discord.js');

module.exports = {
	name: 'setup',
	description: 'Setup your server.',
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Setup your server.')
		.addChannelOption(option =>
			option.setName('text_channel')
				.setDescription('The text channel to set the bot with.').setRequired(true))
		.addStringOption(option =>
			option.setName('timezone')
				.setDescription('Enter your server\'s timezone.').setRequired(true)
				.setAutocomplete(true))
		.addBooleanOption(option =>
			option.setName('addstarroles')
				.setDescription('Automatically adds five roles for stars in the server. (Must have role perms)')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('addchallengeroles')
				.setDescription('Automatically adds five roles for challenges in the server. (Must have role perms)')
				.setRequired(true)),
	permission: 'MANAGE_CHANNELS',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */

	async execute(interaction, client) {
		const c = interaction.options.getChannel('text_channel');
		const role_star = interaction.options.getBoolean('addstarroles');
		const role_challenge = interaction.options.getBoolean('addchallengeroles');
		const timezones = client.extra.timezones;
		const time = interaction.options.getString('timezone');

		const guild = await interaction.guild;
		const me = await guild.members.fetchMe();

		if(c.type != 0) {
			try { return await interaction.reply('That channel isn\'t a text channel!').then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
		}

		const guildPermCheck = me.permissions.has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.UseExternalEmojis, PermissionFlagsBits.ManageRoles]);
		// const gPermCheckList = [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.UseExternalEmojis, PermissionFlagsBits.ManageRoles].filter(x => !me.permissions.includes(x));

		// const channelPermCheck = me.permissionsIn(c).has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.UseExternalEmojis]);

		/*
		if(channelPermCheck != true) {
			try { return await interaction.reply({ content: 'The bot is missing some perms for that channel. Please allow that channel\'s permissions for the bot to: **Send Messages**, **Attach Embedded Messages and Files** and **Use External Emojis**.', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
		}
		*/

		if(guildPermCheck != true) {
			try { return await interaction.reply({ content: 'The bot is missing some role perms. In order for the bot to fully function, please make sure the bot has a role with perms to: **Send Messages**, **Attach Embedded Messages and Files**, **Use External Emojis** and **Manage Roles**.\n\n**To understand why I need these permissions, please use /transparencyperms.**', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'No Perms Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
		}

		if(timezones.includes(time) != true) {
			try { return await interaction.reply({ content: 'Opps that timezone wasn\'t right. Make sure not to make any edits to the auto fill selection.', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
		}

		await client.pool.query('UPDATE guild_settings SET channel_id = $1, default_timezone = $2, setup = TRUE WHERE Guild_ID = $3', [c.id, time, interaction.guild.id]);
		try{await interaction.reply({ content: c.name + ' is now the channel and the default timezone will be ' + time + '.\nA message has been posted in the channel with instructions for users to follow shortly, the bot is setting everything up so give it 5 - 15 seconds.', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Confirm Reply')); }
		catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }

		const dateTS = Math.floor(new Date(new Date().toLocaleDateString('en-US', { timeZone: time, timeZoneName: 'short' })).getTime() / 1000.0);

		if(role_star == true) {
			const roles_objs = [];
			try{ roles_objs.push(await interaction.guild.roles.create({ name: 'Fitness Starter', color: '#ffbf00' })); } catch { ; }
			try{ roles_objs.push(await interaction.guild.roles.create({ name: 'Fitness Conqueror', color: '#ffca32' })); } catch { ; }
			try{ roles_objs.push(await interaction.guild.roles.create({ name: 'Fitness Crusher', color: '#ffd96d' })); } catch { ; }
			try{ roles_objs.push(await interaction.guild.roles.create({ name: 'Fitness Legend', color: '#ffe597' })); } catch { ; }
			try{ roles_objs.push(await interaction.guild.roles.create({ name: 'Fitness Bro', color: '#ffedc0' })); } catch { ; }

			await client.pool.query('DELETE from role_data WHERE Guild_ID = $1 and Type = 0;', [interaction.guildId]);

			for(let i = 0; i < roles_objs.length; i++) {
				await client.pool.query('INSERT INTO role_data (Guild_ID, Role_ID, stars_required, type) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;', [guild.id, roles_objs[i].id, [1, 5, 10, 25, 50][i], 0]);
			}
		}

		if(role_challenge == true) {
			const roles_objs = [];
			try{ roles_objs.push(await interaction.guild.roles.create({ name: 'Challenge Seeker', color: '#57b8e6' })); } catch { ; }
			try{ roles_objs.push(await interaction.guild.roles.create({ name: 'Challenge Victor', color: '#60beeb' })); } catch { ; }
			try{ roles_objs.push(await interaction.guild.roles.create({ name: 'Challenge Warrior', color: '#6fc5ed' })); } catch { ; }
			try{ roles_objs.push(await interaction.guild.roles.create({ name: 'Challenge Vanquisher', color: '#8cceed' })); } catch { ; }
			try{ roles_objs.push(await interaction.guild.roles.create({ name: 'Challenge Champion', color: '#aadbf2' })); } catch { ; }

			await client.pool.query('DELETE from role_data WHERE Guild_ID = $1 and Type = 1;', [interaction.guildId]);

			for(let i = 0; i < roles_objs.length; i++) {
				await client.pool.query('INSERT INTO role_data (Guild_ID, Role_ID, stars_required, type) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;', [guild.id, roles_objs[i].id, [10, 25, 50, 100, 250][i], 1]);
			}

		}

		const bucketEmbed = new EmbedBuilder()
			.setColor(Colors.LuminousVividPink)
			.setTitle('Fit Streaks Quick Start')
			.setDescription('⠀\nFit Streaks are a new way to log and share your fitness journey while also helping you stay focused on the goals you want to reach!\n\nSimply post something and react to it with a star. The bot will give you a star for your hard work and do the samething again the next day.\n\n**By default, the day refreshes for this server at <t:' + dateTS + ':t>.**\nYou can change your personal timezone with **/setpersonaltimezone** if this is not ideal for you.\n\nNow get to posting!\n⠀')
			.setFooter({ text: 'You can get up to 1 star per day!' });
		try{await c.send({ embeds: [bucketEmbed] }).then(client.extra.log_g(client.logger, interaction.guild, this.name, 'Quick Start Guide Reply'));}
		catch{client.extra.log_error_g(client.logger, interaction.guild, this.name, 'Reply Denied');}

	},
};