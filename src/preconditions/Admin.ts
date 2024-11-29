import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { PermissionFlagsBits } from 'discord.js';

export class Admin extends Precondition {
	public override async messageRun(message: Message) {
		const adminRole = process.env.ADMIN_ROLE || '';

		// or admin permission
		if (message.member?.roles.cache.has(adminRole) || message.member?.permissions.has(PermissionFlagsBits.Administrator)) {
			return this.ok();
		} else {
			return this.error({ message: 'You do not have the required permissions to run this command' });
		}
	}
}
