Big chungus is a moderation bot with the aim of being efficient and easy to setup.
> The entire bot can be configured through the [website]().

## Features
* [Raid and nuke protection]() - Protect your server with automated anti-nuke/raid systems or manual commands.
* [Fast auto-moderation]() - Automatically delete spam, nsfw messages, links, discord invites, and custom [regex]() matches within milliseconds.
* [Highly configurable strike system]() - Configure custom punishments for members that trigger on `x` amount of strikes.
* [The best basic moderation commands]() - Basic moderation commands with heirarchy-based moderation.

### Raid and nuke protection
* Webhooks cannot be created, and will be deleted by the bot immediately (unless unsafe mode is enabled).
* Unsafe mode can enabled on with the `unsafe` command, which will supress all the bot's systems (apart from message filters) for two minutes. Unsafe mode cannnot be enabled if anti raid mode is on.
* All events are logged, and if any event surpasses the rate limit (3 of the same event within 2.5 seconds), the server is put into anti-raid mode.

**Running the antiraid command does the following things:**<br>
• Ban any new members that try to join while anti-raid mode is enabled, and unban them afterwards. <br>
• Constantly look for any duplicate roles/channels/categories and deletes them.

### Fast auto-moderation
You can configure the bot to delete messages that contain links, spam (repeated characters, mention spam, etc), blacklisted words, discord invites.
You can also configure the bot to delete messages that contain certain patterns using [regex]().

### Highly configurable strike system
Strikes are essentially warnings, and people with the `MANAGE_MEMBERS` permission can use the `strike` command to give any amount of strikes to a user.
You can [configure actions to be performed when a user reaches a certain amount of strikes](), currently supported actions are: `timeout`, `kick` and `ban`

### Basic Moderation
Big Chungus has a system of hierarchy based moderation, which allows members of higher position to moderate members of (relatively) lower position, even though both members are moderators. The basic moderation commands available in the bot are: `ban`, `unban`, `kick`, `timeout`, `strike`, `strikes` and `relax`.
> _Moderators_ are people who can run moderation commands in a server.

## Using the Code
### Prequesites
* TypeScript (`npm i -g typescript`)
* Node.js 17.1 ([install]())
* Basic programming knowledge 

After installing/cloning this repository, go to the last line in `src/index.ts`, and input your token (Instructions are present in the file). Run the `npm start` command to run the bot. 

## Resources and Links
* [Website]() - Configure the bot here
* [Documentations]() - All commands in the bot are properly documented here.
