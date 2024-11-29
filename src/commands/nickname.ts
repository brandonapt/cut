import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'nickname',
	aliases: ['nick', 'n']
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		if (!message.channel.isSendable()) return;
		const nickname = message.content.split(' ').slice(1).join(' ');
		if (!nickname) {
			return message.channel.send('invalid nickname');
		}
		if (nickname.length > 32) {
			return message.channel.send('nickname too long');
		}
		await message.member?.setNickname(nickname).catch(() => {
			if (!message.channel.isSendable()) return;
			message.channel.send('error setting nickname');
            return;
		});

		return message.channel.send(`nickname set to ${nickname}`);
	}
}
