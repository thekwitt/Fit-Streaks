module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		await client.pool.query('	CREATE TABLE IF NOT EXISTS guild_settings(\
									Guild_ID bigint PRIMARY KEY,\
									Channel_ID bigint DEFAULT 0,\
									Setup BOOLEAN DEFAULT FALSE,\
									Delete_OT int DEFAULT 0,\
									Streak_Protection_Protocol BOOLEAN DEFAULT TRUE,\
									Default_Timezone TEXT DEFAULT \'\',\
									First_Time_Phrases TEXT[] DEFAULT \'{"Looks like this is your first time posting! Great on you for starting this journey. Remember any post is progress! What matters is the end of the journey!", "Looks like this is your first time posting! This is it! Your first steps into a better you. We all know you can do it!", "Looks like this is your first time posting! Remember that steady consistency is key and try not to be afraid to go hard. This is all about you."}\',\
									Streak_Phrases TEXT[] DEFAULT \'{"Great work taking another step up the staircase! Keep climbing higher and higher!", "Even if you feel like you can do better. Do it on your next post! Small or large, anything makes an impact.", "Wow! You did a great deal today! Now hydrate yourself with some water. You definitely deserve it."}\',\
									Start_Over_Phrases TEXT[] DEFAULT \'{"Welcome back fit goer! Glad to see you get right back on your goals and your journey! Remember anything you post is progress no matter how small.", "Welcome back fit goer! Every journey may need a break but what matters is how much stronger you impact yourself once you bounce back!", "Welcome back fit goer! Get your water, your goal and that focus because this time you will be on your way to victory! We all cannot wait to see what you are capable of now."}\',\
									Response_Title TEXT DEFAULT \'Nice Streak Post!\',\
									Star_Emoji TEXT DEFAULT \'\'\
									);');

		await client.pool.query('	CREATE TABLE IF NOT EXISTS user_data(\
									Guild_ID bigint,\
									Member_ID bigint,\
									Stars INTEGER DEFAULT 0,\
									Challenges INTEGER DEFAULT 0,\
									Streaks bigint[] DEFAULT \'{}\',\
									Timezone TEXT DEFAULT \'"America/New_York"\',\
									Sent_Condition BOOLEAN DEFAULT FALSE,\
									New_Day_TS bigint DEFAULT 0,\
									New_User BOOLEAN DEFAULT TRUE,\
									Streak_Recover_TS bigint DEFAULT 0,\
									Rest_Days INTEGER DEFAULT 2,\
									Rest_Mode BOOLEAN DEFAULT FALSE,\
									Sick_Mode BOOLEAN DEFAULT FALSE,\
									PRIMARY KEY (Guild_ID, Member_ID)\
									);');

		await client.pool.query('	CREATE TABLE IF NOT EXISTS challenge_data(\
									Guild_ID bigint,\
									Member_ID bigint,\
									Challenge_ID SERIAL,\
									Description TEXT DEFAULT \'\',\
									Reminder_TS bigint DEFAULT 0,\
									Reminded BOOLEAN DEFAULT FALSE,\
									Completed BOOLEAN DEFAULT FALSE,\
									PRIMARY KEY (Challenge_ID)\
									);');

		await client.pool.query('	CREATE TABLE IF NOT EXISTS user_stats(\
									Guild_ID bigint,\
									Member_ID bigint,\
									Stars_Collected INTEGER DEFAULT 0,\
									Highest_Streak INTEGER DEFAULT 0,\
									PRIMARY KEY (Guild_ID, Member_ID)\
									);');

		await client.pool.query('	CREATE TABLE IF NOT EXISTS role_data(\
									Guild_ID bigint,\
									Role_ID bigint,\
									Stars_Required INTEGER NOT NULL,\
									Type INTEGER DEFAULT 0,\
									PRIMARY KEY (Guild_ID, Role_ID)\
									);');

		await client.pool.query('ALTER TABLE user_data ADD COLUMN IF NOT EXISTS Status TEXT DEFAULT \'Runnin 🏃‍♂️\';');

		// const guild = client.guilds.cache.find(g => g.id == '451929862794641409');
		// await guild.commands.set([]).then(console.log).catch(console.error);
		// await guild.members.fetch();
		client.ready[0] = true;

		client.extra.simple_log(client.logger, 'Bot is ready');
	},
};