const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder, Colors } = require('discord.js');

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
	name: 'help',
	description: 'Get help for commands and how the bot works!',
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get help for commands and how the bot works!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('support')
				.setDescription('Get the link to the support server.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('manual')
				.setDescription('Everything you need to know here!')
				.addStringOption(option =>
					option.setName('page')
						.setDescription('What kind of help do you need?')
						.setRequired(true)
						.addChoices({ name: 'Overview of Bot', value: 'overview' }, { name: 'Overview of Stars', value: 'stars' }, { name: 'Overview of Challenges', value: 'challenges' }, { name: 'Overview of Streaks', value: 'streaks' }, { name: 'Overview of Rest Mode and Sick Mode', value: 'sick' })))
		.addSubcommand(subcommand =>
			subcommand
				.setName('faq')
				.setDescription('Commonly answered questions now at your fingertips!')
				.addStringOption(option =>
					option.setName('question')
						.setDescription('What kind of question do you have?')
						.setRequired(true)
						.addChoices({ name: 'How do I start the bot?', value: 'start' },
							{ name: 'Where are the slash commands?', value: 'slash' },
							{ name: 'I got a warning about the roles. What does that mean?', value: 'roles' },
							{ name: 'I got "Interaction Failed". What does that mean?', value: 'interaction' },
							{ name: 'What kind of posts can I post as streaks?', value: 'posts' },
							{ name: 'Can I change the language of the bot?', value: 'language' })))
		.addSubcommand(subcommand =>
			subcommand
				.setName('commands')
				.setDescription('Everything and anything about the commands!')
				.addStringOption(option =>
					option.setName('command')
						.setDescription('What command do you need explained?')
						.setRequired(true)
						.addChoices(
							{ name: 'Info Commands', value: 'info' },
							{ name: 'Profile Commands', value: 'profile' },
							{ name: 'Challenge Commands', value: 'challenge' },
							{ name: 'Settings Commands (Moderator Only)', value: 'settings' },
							{ name: 'Tool Commands (Moderator Only)', value: 'tools' }))),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const page = interaction.options.getString('page');
		const question = interaction.options.getString('question');
		const command = interaction.options.getString('command');
		const embed = new EmbedBuilder().setFooter({ text: 'See what else you can learn from the bot!' });

		if(page != undefined) {
			switch(page) {
			case 'overview':
				embed
					.setColor('0xFFA500')
					.setTitle('📙   Overview of Bot   📙')
					.addFields(
						{ name: 'What is this bot?', value: 'Fit Streaks is a fitness motivation bot that helps members of the community collaborate and send their progress of the fitness journey to each other. ' },
						{ name: 'What is the purpose of this bot?', value: 'Sometimes it is hard to better yourself and succeed in your fitness goals so that is what this bot is going to help with! It is developed to mainly provide a sense of consistency no matter what size and motivate the user forward. No one should have to do it alone, all fit goers should stick together!' },
						{ name: 'How does it work?', value: 'Star one of your own posts in the selected channel and get a star! The more stars you get, the more roles you will be able to collect as well as get further along your journey!' },
						{ name: 'What kind of posts do I post?', value: 'Literally anything that contributes to your journey! It can even be very minimal as long as it helps you stay on track. For example: step count, home cooking, gym log, walking in trails, mental focus, hydration and etc.' },
					);
				try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', ' Overview Reply'));}
				catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', 'Overview Reply Denied');}
				break;
			case 'stars':

				embed
					.setColor('0xFFA500')
					.setTitle('📙   Overview of Stars   📙')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.addFields(
						{ name: 'What are stars?', value: 'Stars are points that can be earned for posting streaks.' },
						{ name: 'How do you get them?', value: 'You can get stars from reacting to your daily posts with stars. **You can only get one star per day.**' },
						{ name: 'Can you lose them?', value: 'If you stop posting, your streak will end and your star streak will reset to zero but you will still have a count of how many stars you\'ve collected. You can check when the end of the day is for you with **/journey** or change it with **/setpersonaltimezone**.' },
					);
				try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', ' Overview Reply'));}
				catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', 'Overview Reply Denied');}
				break;
			case 'challenges':
				embed
					.setColor('0xFFA500')
					.setTitle('📙   Overview of Challenges   📙')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.addFields(
						{ name: 'What are challenges?', value: 'Challenges are goals / breaking points that you can set for yourself and help achieve further heights!' },
						{ name: 'How do they work?', value: 'You simply use the **/addchallenge** command to add a challenge along with a time when you think you can complete it. You\'ll be prompted at the time to complete the challenge if you don\'t complete it beforehand.' },
						{ name: 'What happens when you complete it?', value: 'You can a completion mark and a point! You can collect challenge points to get special roles separate from star roles set up by your server moderators.' },
						{ name: 'Can you lose challenge marks?', value: 'No at all! Unlike stars, challenge marks stay forever as a symbol of progress!' },
					);
				try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', ' Overview Reply'));}
				catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', 'Overview Reply Denied');}
				break;
			case 'streaks':
				embed
					.setColor('#FFA500')
					.setTitle('📙   Overview of Streaks   📙')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.addFields(
						{ name: 'What are streaks?', value: 'A streak is how many days you have posted daily in the health/fitness channel on the server. They are repesented as stars.' },
						{ name: 'Do I get anything from streaks?', value: 'You can earn roles that the server setup for you or even better, have consistency on your journey!' },
						{ name: 'What happens if I stop sending streaks?', value: 'Your streak will end and your streak star count will drop back to zero.' },
						{ name: 'What if I am sick or my body is weak?', value: 'Everyone needs a break once in awhile, thats why there are two commands you can use. **/restmode** for resting one day and **/sickmode** for resting until you feel better. Both of these commands can freeze your streak for that amount of time.' },
					);
				try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', ' Overview Reply'));}
				catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', 'Overview Reply Denied');}
				break;
			case 'sick':
				embed
					.setColor('#FFA500')
					.setTitle('📙   Overview of Rest Mode and Sick Mode   📙')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.addFields(
						{ name: 'What is sick mode?', value: 'Sick mode is when a user has frozen their streak to take care of themselves for being sick. This can last until the next post that user sends.' },
						{ name: 'What is rest mode?', value: 'Rest mode is when a user has taken one day off to get themselves back better than ever. This can last one day and be used up to two times. (Which can be recharged by posting again)' },
						{ name: 'How can I use these?', value: 'Just simply use the **/restmode** or **/sickmode** commands.' },
					);
				try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', ' Overview Reply'));}
				catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', 'Overview Reply Denied');}
				break;
			}
		} else if(question != undefined) {
			switch(question) {
			case 'posts':
				embed
					.setColor(Colors.Gold)
					.setTitle('❓   What kind of posts can I post?   ❓')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nThe main purpose of this bot is to provide consistency on your healthy journey. So the answer really is literally anything that contributes to it! No matter how big the impact of it is, it is always one step toward the right direction. For example: step count, home cooking, gym log, walking in trails, mental focus, hydration and etc.\n\n⠀');
				try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', ' Overview Reply'));}
				catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', 'Overview Reply Denied');}
				break;
			case 'start':
				embed
					.setColor('#FFA500')
					.setTitle('❓   How do I start the bot?   ❓')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nWhen you invite the bot, you will need to initialize the bot by using the **/setup** command! If the command throws out an error, make sure the bot has two key factors. \
					\n\nServer and Channel permission to send embedded messages outside of slash commands and use external emojis.\n\n⠀');
				try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', ' Overview Reply'));}
				catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', 'Overview Reply Denied');}
				break;
			case 'interaction':
				embed
					.setColor('#FFA500')
					.setTitle('❓   I got "Interaction Failed". What does that mean?   ❓')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nOn rare occasions, discord doesn\'t send all the info the bot needs to get the job done or doesn\'t accept the bot send them info.\n⠀');
				try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', ' Overview Reply'));}
				catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', 'Overview Reply Denied');}
				break;
			case 'slash':
				embed
					.setColor('#FFA500')
					.setTitle('❓   Where are the slash commands?   ❓')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nSometimes discord may need time to have slash commands show up. It takes up to an hour for current and new commands to show up in servers if they do not appear.\
					\n\nOtherwise if you have more than 25 bots, it is possible that slash commands are prioritized to those first 25 bots. How it works is that only the first 25 invited bots can have their commands prioritized for your server.\
					\n\nYou will need to remove those bots in order to use this bot\'s functionality.\n⠀');
				try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', ' Overview Reply'));}
				catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', 'Overview Reply Denied');}
				break;
			case 'language':
				embed
					.setColor('#FFA500')
					.setTitle('❓   Can I change the language of the bot?   ❓')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nSadly translating everything from the bot requires a lot of outsourcing which will take some time for people to hire for. This may not be available until Late 2022 or Early 2023 for future projects but if you wish to speed up the process for outsourcing, go ahead and use **/patreon** to see how effort can speed up the process.\n⠀');
				try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', ' Overview Reply'));}
				catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', 'Overview Reply Denied');}
				break;
			}
		} else if(command != undefined) {
			switch(command) {
			case 'info':
				embed
					.setColor('#FFA500')
					.setTitle('📙   Info Commands   📙')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
					.addFields(
						{ name: '/help', value: 'The Everything and Anything!', inline: false },
						{ name: '/credits', value: 'Get info about the bot and it\'s creators!', inline: false },
						{ name: 'Support (/help support)', value: 'Shows a link to the support server!', inline: false },
						{ name: '/phraselist', value: 'Prints a list of phrases that will be said to users for posting their streaks.', inline: false },
						{ name: '/starrolelist', value: 'Prints a list of roles for star streaks!', inline: false },
					);
				try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', ' Overview Reply'));}
				catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', 'Overview Reply Denied');}
				break;
			case 'settings':
				embed
					.setColor('#FFA500')
					.setTitle('📙   Setting Commands   📙')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
					.addFields(
						{ name: 'Standard Commands', value: '⠀', inline: false },
						{ name: '/settings basic set_delete_overtime', value: 'Set star messages to delete over time', inline: false },
						{ name: '/settings basic set_protect_streaks_protocol', value: 'Enables or disables star messages being revoked if streak is deleted.', inline: false },
					);
				try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', ' Overview Reply'));}
				catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', 'Overview Reply Denied');}
				break;
			case 'tools':
				embed
					.setColor('#FFA500')
					.setTitle('📙   Tool Commands   📙')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
					.addFields(
						{ name: '/rolemanagement', value: 'Add, update or remove star and challenge roles!', inline: false },
						{ name: '/phrasemanagement', value: 'Update the phrases that get said on streaks!', inline: false },
						{ name: '/setup', value: 'Setup the bot.', inline: false },
						{ name: '/erasemember', value: 'Erase the bot\'s data for someone on the server!', inline: false },
						{ name: '/eraseserver', value: 'Wipe the server\'s data (**CANNOT BE UNDONE**)', inline: false },
						{ name: '/unmarkpost', value: 'See when the next drop/boss spawns!', inline: false },
						{ name: '/modremovechallenge', value: 'Remove any of the user\'s challenges.', inline: false },
					);
				try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', ' Overview Reply'));}
				catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', 'Overview Reply Denied');}
				break;
			case 'challenge':
				embed
					.setColor('#FFA500')
					.setTitle('📙   Challenge Commands   📙')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
					.addFields(
						{ name: '/addchallenge', value: 'Add up to five challenges by description and time value/type!', inline: false },
						{ name: '/completechallenge', value: 'Complete any of your challenges!', inline: false },
						{ name: '/removechallenge', value: 'Remove a challenge you have already existing.', inline: false },
						{ name: '/snoozechallenge', value: 'Extend a challenge\'s due date!', inline: false },
						{ name: '/viewchallenges', value: 'View all your challenges', inline: false },
					);
				try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', ' Overview Reply'));}
				catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', 'Overview Reply Denied');}
				break;
			case 'profile':
				embed
					.setColor('#FFA500')
					.setTitle('📙   Profile Commands   📙')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
					.addFields(
						{ name: '/restmode', value: 'Take a day off with no worries!', inline: false },
						{ name: '/sickmode', value: 'Freeze your streak until you feel better!', inline: false },
						{ name: '/journey', value: 'Get details about a user\'s workout journey.', inline: false },
						{ name: '/leaderboard', value: 'See how is shining the most with stars!', inline: false },
						{ name: '/setpersonaltimezone', value: 'Set the timezone for your account.', inline: false },
					);
				try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', ' Overview Reply'));}
				catch (err) {client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', 'Overview Reply Denied');}
				break;
			}
		}

		const row = new ActionRowBuilder()
			.addComponents([
				new ButtonBuilder()
					.setLabel('Support Server')
					.setStyle(ButtonStyle.Link)
					.setURL('https://discord.gg/ZNpCNyNubU'),
			]);

		embed.setColor(client.colors[0][0])
			.setTitle('🔗   Support Server!   🔗')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.setDescription('⠀\nClick the button below to visit the support server!\n⠀');

		try{return await interaction.reply({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'Invite Command', 'Bot Reply'));}
		catch (err) {client.extra.log_error_g(client.logger, interaction.guild, String(err) + ' Command', 'Reply Denied');}

	},
};