// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	name: 'setdefaultstarroles',
	description: 'Set the star roles on the bot to the default roles.',
	data: new SlashCommandBuilder()
		.setName('setdefaultstarroles')
		.setDescription('Set the star roles on the bot to the default roles.')
		.addBooleanOption(option =>
			option.setName('deleteroles')
				.setDescription('Delete the roles registered in the bot')
				.setRequired(true)),
	permission: 'MANAGE_CHANNELS',
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */

	async execute(interaction, client) {
		const guildPermCheck = interaction.guild.members.me.permissions.has([PermissionFlagsBits.ManageRoles]);

		if(guildPermCheck == false) {
			try { return await interaction.reply({ content: 'Looks like the bot doesn\'t have the correct perms. Make sure it has perms to manage roles to use this command.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Not Text Reply')); }
			catch (err) { client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
		}

		const deleteroles = interaction.options.getBoolean('deleteroles');

		if (deleteroles == true) {
			const role_raw = await client.pool.query('SELECT * FROM role_data WHERE guild_id = $1 AND type = 0', [interaction.guildId]);
			const role_data = role_raw.rows;

			for(let i = 0; i < role_data.length; i++) {
				await interaction.guild.roles.delete(role_data[i].role_id, 'The Star Role Default Command was used.').then(() => console.log('Deleted the role')).catch(console.error);
			}
		}

		const roles_objs = [];
		try{ roles_objs.push(await interaction.guild.roles.create({ name: 'Fitness Starter', color: '#ffbf00' })); } catch { ; }
		try{ roles_objs.push(await interaction.guild.roles.create({ name: 'Fitness Conqueror', color: '#ffca32' })); } catch { ; }
		try{ roles_objs.push(await interaction.guild.roles.create({ name: 'Fitness Crusher', color: '#ffd96d' })); } catch { ; }
		try{ roles_objs.push(await interaction.guild.roles.create({ name: 'Fitness Legend', color: '#ffe597' })); } catch { ; }
		try{ roles_objs.push(await interaction.guild.roles.create({ name: 'Fitness Bro', color: '#ffedc0' })); } catch { ; }

		await client.pool.query('DELETE from role_data WHERE Guild_ID = $1 and Type = 0;', [interaction.guildId]);

		for(let i = 0; i < roles_objs.length; i++) {
			await client.pool.query('INSERT INTO role_data (Guild_ID, Role_ID, stars_required, type) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;', [interaction.guildId, roles_objs[i].id, [1, 5, 10, 25, 50][i], 0]);
		}

		try{ return await interaction.reply({ content: 'The roles have been reset in the bot\'s database. You may need to check if the old roles have been deleted or not.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Confirm Reply')); }
		catch (err) { client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' - ' + this.name + 'Command', 'Reply Denied'); }
	},
};