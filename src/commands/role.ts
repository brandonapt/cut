import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'give or remove a role from a user',
	aliases: ['r', 'role'],
	preconditions: ['Admin']
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		if (!message.channel.isSendable()) return;

		const check = message.member?.permissions.has('Administrator') || message.member?.permissions.has('ManageRoles'); // check if the user has manage_messages permission
		if (!check) return message.channel.send('You do not have the required permissions to run this command');

		console.log(message.content);
		let mention = message.mentions.members?.first();
		if (!mention) {
			const id = message.content.split(' ')[1];
			if (!id) return message.channel.send('mention someone (err code 1)');
			const member = await message.guild?.members.fetch({ query: id, limit: 1 }).catch(() => null);
			if (!member) return message.channel.send('mention someone (err code 2)');
			mention = member.first();
		}

		if (!mention) return message.channel.send('mention someone (err code 3)');

		const role = message.content.split(' ').slice(2).join(' ');
		if (!role) return message.channel.send('mention a role');
		const roleObj = message.guild?.roles.cache.find((r) => r.name === role);

		if (!roleObj) return message.channel.send('role not found');

		if (mention.roles.cache.has(roleObj.id)) {
			
			await mention.roles.remove(roleObj.id).catch(() => {
				if (!message.channel.isSendable()) return;
				message.channel.send('permissions error');
			});
			message.channel.send(`removed ${roleObj.name} from ${mention}`);
		} else {
			await mention.roles.add(roleObj.id).catch(() => {
				if (!message.channel.isSendable()) return;
				message.channel.send('permissions error');
			});
			message.channel.send(`added ${roleObj.name} to ${mention}`);
		}

		return;
	}
}
