import { Precondition } from '@sapphire/framework';
import { PermissionFlagsBits, type Message } from 'discord.js';

export class Moderator extends Precondition {
	public override async messageRun(message: Message) {
		const moderatorRole = process.env.MODERATOR_ROLE || '';

		if (message.member?.roles.cache.has(moderatorRole) || message.member?.permissions.has(PermissionFlagsBits.Administrator)) {
			return this.ok();
		} else {
			return this.error({ message: 'You do not have the required permissions to run this command' });
		}
	}
}
