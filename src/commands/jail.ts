import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'jail/unjail users',
	aliases: ['unjail'],
	preconditions: ['Moderator']
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		if (!message.channel.isSendable()) return;
		const jailRole = process.env.JAIL_ROLE || '';

		let mention = message.mentions.members?.first();
		if (!mention) {
			const id = message.content.split(' ')[1];
			if (!id) return message.channel.send('mention someone (err code 1)');
			const member = await message.guild?.members.fetch({ query: id, limit: 1 }).catch(() => null);
			if (!member) return message.channel.send('mention someone (err code 2)');
			mention = member.first();
		}
		if (!mention) return message.channel.send('mention someone (err code 3)');

		if (mention.roles.cache.has(jailRole)) {
			await mention.roles.remove(jailRole).catch(() => {
				if (!message.channel.isSendable()) return;
				message.channel.send('error unjailing');
			});
			message.channel.send(`unjailed ${mention}`);
		} else {
			await mention.roles.add(jailRole).catch(() => {
				if (!message.channel.isSendable()) return;
				message.channel.send('error jailing');
			});
			message.channel.send(`jailed ${mention}`);

			const reason = message.content.split(' ').slice(2).join(' ');
			if (reason) {
				mention.send(`you have been jailed in ${message.guild?.name} for ${reason}`);
			} else {
				mention.send(`you have been jailed in ${message.guild?.name}`);
			}
		}
		return;
	}
}
