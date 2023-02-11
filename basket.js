const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

// eslint-disable-next-line no-unused-vars
function duplicates(arr, id) {
	let count = 0;
	for(let i = 0; i < arr.length; i++)
	{
		if (arr[i] === id) count++;
	}
	return count;
}

module.exports = {
	name: 'getstreaks',
	description: 'Get the User\'s Streaks!',
	data: new SlashCommandBuilder()
		.setName('getstreaks')
		.setDescription('Get the User\'s Streaks!')
		.addUserOption(option => option.setName('target').setDescription('The streaks of that user.')),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		let user = interaction.user;
		const target = interaction.options.getUser('target');
		if (target && !target.bot)
		{
			const raw_guild = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [guildId]);
			const guild_data = raw_guild.rows[0];
			
			user = target;
			const dateTS = Math.floor(new Date(new Date().toLocaleDateString('en-US', { timeZone: guild_data.default_timezone, timeZoneName: 'short' })).getTime() / 1000.0);
			await client.pool.query('INSERT INTO user_data (Guild_ID, Member_ID, Timezone, New_Day_TS) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;', [reaction.message.guildId, user.id, guild_data.default_timezone, dateTS]);
			await client.pool.query('INSERT INTO user_stats (Guild_ID, Member_ID) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [reaction.message.guildId, user.id]);
		}
		else if (target && target.bot) {
			try{return await interaction.reply(target.username + ' is a bot. It doesn\'t like candy.').then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Duplicate Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, this.name + ' Command', 'Reply Denied');}
		}

		const raw_user = await client.pool.query('SELECT * FROM user_data WHERE Member_ID = $1 AND Guild_ID = $2;', [user.id, interaction.guildId]);
		const user_data = raw_user.rows[0];

		try{if(user_data.streaks.length == 0) return await interaction.reply({ content: 'This user has no streaks! Post something or tell them to post something and star it first.', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Empty Reply'));}
		catch{client.extra.log_error_g(client.logger, interaction.guild, this.name + ' Command', 'Reply Denied');}

		const data = [...new Set(user_bag)].sort();
		let page = 0;

		const streaks = [];
		for(let i = 0; i < data.length; i++)
		{
			streaks.push('⭐ ' + (i + 1) + ' | [' + new Date(new Date().toLocaleDateString('en-US', { timeZone: guild_data.default_timezone, timeZoneName: 'short' })).toISOString().split('T')[0] + '](' +  + ')');
		}

		// eslint-disable-next-line prefer-const
		let counts = [];
		for(let i = 0; i < eggs.length; i++)
		{
			counts.push(duplicates(user_bag, Number(eggs[i].id)));
		}


		const max_page = parseInt((counts.length - 1) / 25);

		let string = '⠀\n';
		let count = 0;
		for(let i = page * 25; i < 25 + (25 * page); i++) {
			if (eggs[i] == undefined) break;
			count++;
			string += eggs[i].emoji + ' x `' + counts[i].toString().padStart(3, '0') + '`⠀';
			if(count == 5) {
				count = 0;
				string += '\n\n';
			}
		}
		let embed = new MessageEmbed()
			.setColor(client.colors[0][0])
			.setTitle('🥚  ' + user.username + '\'s Egg Basket  🥚')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.setDescription('⠀\nEgg Basket: `' + length + ' / ' + client.extra.eggCapacity(u.basket_level) + '`⠀\n\n\n' + string + (page == max_page ? '\n\n' : '') + '\n⠀⠀')
			.setFooter('Page ' + (page + 1) + '/' + (max_page + 1) + ' | Use Arrows to switch pages/rank');

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('Left')
					.setLabel('⬅️')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('Right')
					.setLabel('➡️')
					.setStyle('PRIMARY'),
			);

		try{await interaction.reply({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Duplicate Reply'));}
		catch{client.extra.log_error_g(client.logger, interaction.guild, this.name + ' Command', 'Reply Denied');}
		let reply = undefined;
		try{ reply = await interaction.fetchReply().then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Fetch Reply')).catch(client.extra.log_error_g(client.logger, interaction.guild, this.name + ' Command', 'Fetch Reply Denied')); }
		catch{client.extra.log_error_g(client.logger, interaction.guild, this.name + ' Command', 'Fetch Reply Denied');}
		if(reply == undefined) return ;
		const filter = f => {
			return f.user.id == interaction.user.id && f.message.id == reply.id;
		};
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });
		collector.on('collect', async f => {
			if(f.customId === 'Left') {
				if(page != 0) {
					page--;
					string = '⠀\n';
					count = 0;
					for(let i = page * 25; i < 25 + (25 * page); i++) {
						if (eggs[i] == undefined) break;
						count++;
						string += eggs[i].emoji + ' x `' + counts[i].toString().padStart(3, '0') + '`⠀';
						if(count == 5) {
							count = 0;
							string += '\n\n';
						}
					}
					embed = new MessageEmbed()
						.setColor(client.colors[0][0])
						.setTitle('🥚  ' + user.username + '\'s Egg Basket   🥚')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\nEgg Basket: `' + length + ' / ' + client.extra.eggCapacity(u.basket_level) + '`⠀\n\n\n' + string + (page == max_page ? '\n\n' : '') + '\n⠀⠀')
						.setFooter('Page ' + (page + 1) + '/' + (max_page + 1) + ' | Use Arrows to switch pages/rank');
					try{await f.update({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Update Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, this.name + ' Command', 'Update Edit Denied');}

				} else {
					try{await f.reply({ content: 'You are already on the first page!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'First Page Bag Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, this.name + ' Command', 'Reply Denied'); }
				}

			} else if(f.customId === 'Right') {
				if(page != max_page) {
					page++;
					string = '⠀\n';
					count = 0;
					for(let i = page * 25; i < 25 + (25 * page); i++) {
						if (eggs[i] == undefined) break;
						count++;
						string += eggs[i].emoji + ' x `' + counts[i].toString().padStart(3, '0') + '`⠀';
						if(count == 5) {
							count = 0;
							string += '\n\n';
						}
					}
					embed = new MessageEmbed()
						.setColor(client.colors[0][0])
						.setTitle('🥚  ' + user.username + '\'s Egg Basket  🥚')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\nEgg Basket: `' + length + ' / ' + client.extra.eggCapacity(u.basket_level) + '`⠀\n\n\n' + string + (page == max_page ? '\n\n' : '') + '\n⠀⠀')
						.setFooter('Page ' + (page + 1) + '/' + (max_page + 1) + ' | Use Arrows to switch pages/rank');
					try{await f.update({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Update Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, this.name + ' Command', 'Update Edit Denied');}
				} else {
					try{await f.reply({ content: 'You are already on the last page!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'Last Page Bag Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, this.name + ' Command', 'Reply Denied'); }
				}
			}
		});
		collector.on('end', async () => {
			const finished_row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('Left')
						.setLabel('⬅️')
						.setStyle('PRIMARY')
						.setDisabled(true),
				)
				.addComponents(
					new MessageButton()
						.setCustomId('Right')
						.setLabel('➡️')
						.setStyle('PRIMARY')
						.setDisabled(true),
				);
			try{await reply.edit({ embed: embed, components: [finished_row] }).then(client.extra.log_g(client.logger, interaction.guild, this.name + ' Command', 'End Bag Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, this.name + ' Command', 'Edit Denied');}
		});
	},
};