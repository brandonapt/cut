import type { Events } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class UserEvent extends Listener<typeof Events.MentionPrefixOnly> {
	public override run(message: Message) {
		if (!message.channel.isSendable()) return;

		const prefix = this.container.client.options.defaultPrefix;
		return message.channel.send(prefix ? `my prefix is: \`${prefix}\`` : 'prefix not found');
	}
}
