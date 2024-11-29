const roled = "1054258375766069368";
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { GuildMember } from 'discord.js';

@ApplyOptions<Listener.Options>({ once: false })
export class GuildMemberAdd extends Listener {
	public override async run(member: GuildMember) {
        member.roles.add(roled);
	}
}
