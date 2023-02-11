// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder } = require('discord.js');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
	name: 'rolemanage',
	description: 'Add or Remove Star or Challenge Roles',
	data: new SlashCommandBuilder()
		.setName('rolemanage')
		.setDescription('Add or Remove Star or Challenge Roles')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a role to the bot.')
				.addRoleOption(option => option.setName('role').setDescription('The role you want to add.').setRequired(true))
				.addIntegerOption(option => option.setName('amount').setDescription('How many stars?').setMinValue(1).setMaxValue(5000).setRequired(true))
				.addStringOption(option => option.setName('type').setDescription('Challenge role or star role?').addChoices({ name: 'Star Role', value: '0' }, { name: 'Challenge Role', value: '1' }).setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('update')
				.setDescription('Update a role from the bot.')
				.addRoleOption(option => option.setName('role').setDescription('The role you want to update.').setRequired(true))
				.addIntegerOption(option => option.setName('amount').setDescription('How many stars?').setMinValue(1).setMaxValue(5000).setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove a role from the bot.')
				.addRoleOption(option => option.setName('role').setDescription('The role you want to remove.').setRequired(true))),
	permission: 'MANAGE_CHANNELS',

	async execute(interaction, client) {

		const subcommand = interaction.options.getSubcommand('subcommand');
		const amount = interaction.options.getInteger('amount');
		const role = interaction.options.getRole('role');
		const type = interaction.options.getString('type');

		const guild = await interaction.guild;

		const data = await client.pool.query('SELECT * FROM role_data WHERE role_id = $1', [(role != undefined ? role.id : 0)]);
		const r = data.rows[0];

		const role_raw = await client.pool.query('SELECT * FROM role_data WHERE guild_id = $1 AND type = $1', [guild.id], Number(type));
		const role_data = role_raw.rows;

		const guildPermCheck = guild.members.me.permissions.has([PermissionFlagsBits.ManageRoles]);

		if(guildPermCheck == false) {
			try { return await interaction.reply({ content: 'Looks like the bot doesn\'t have the correct perms. Make sure it has perms to manage roles.', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
		}

		if(subcommand === 'add') {
			const botPos = guild.members.me.roles.highest.position;

			const rolePos = role.rawPosition;
			if (botPos < rolePos || botPos === rolePos) {
				try { return await interaction.reply({ content: 'The role you attached is higher than the any of the roles this bot has. Please put the bot role or another role with perms higher than that role.', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
				catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
			}

			if(role_data.length >= 5) {
				try { return await interaction.reply({ content: 'It looks like you already have five roles registered in the bot. Due to limitations, there can only be five roles per server registered in the bot. If you would like to add a new one, please remove it with this same command then add the new role.', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
				catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
			}

			if(r != undefined) {
				try { return await interaction.reply({ content: 'This role is already registered in the bot. If you want to update it, please select the **roleupdate** function of the command.', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
				catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
			}

			try { await interaction.reply({ content: 'The ' + role.name + ' role is now attached to the bot and will be given to members when they reach ' + amount + ' stars.', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }

			await client.pool.query('INSERT INTO role_data (Guild_ID, Role_ID, stars_required, type) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;', [guild.id, role.id, amount, Number(type)]);
		} else if(subcommand === 'update') {
			if(r == undefined) {
				try { return await interaction.reply({ content: 'This role is not in the bot yet. If you want to add it, please select the **roleadd** function of the command.', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
				catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
			}

			try { await interaction.reply({ content: 'The ' + role.name + ' role is now updated and will be given to members when they reach ' + amount + ' stars.', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }

			await client.pool.query('UPDATE role_data SET stars_required = $2 WHERE role_id = $1;', [role.id, amount]);
		} else if (subcommand === 'remove') {
			if(r == undefined) {
				try { return await interaction.reply({ content: 'This role is not in the bot.', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
				catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
			}

			try { await interaction.reply({ content: 'The ' + role.name + ' role is now removed from the bot', ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }

			await client.pool.query('DELETE FROM role_data WHERE role_id = $1;', [role.id]);
		} else if (subcommand === 'list') {
			const string = [];

			for(let i = 0; i < role_data.length; i++) {
				string.push('<@&' + role_data[i].role_id + '> | **Requires ' + role_data[i].stars_required + ' Stars**');
			}

			try { await interaction.reply({ content: (string.length == 0 ? 'No roles have been currently added' : string.join('\n')), ephemeral: true }).then(client.extra.log_g(client.logger, guild, this.name + ' Command', 'Not Text Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
		}
	},
};