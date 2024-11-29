import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { EmbedBuilder, Message } from 'discord.js';
import fetch from 'node-fetch';
//import { createWriteStream } from 'fs';
//import { Innertube } from 'youtubei.js';

const bleed_url = process.env.COBALT_URL;
@ApplyOptions<Listener.Options>({ once: false })
export class MessageCreate extends Listener {
	public override async run(message: Message) {
		//const innertube = await Innertube.create()
		if (!message.channel.isSendable()) return;
		if (message.author.bot) return;

		if (message.content.toLowerCase().startsWith(process.env.BLEED_PREFIX + ' ')) {
			const args = message.content.slice(5).trim().split(/ +/);
			const link = args[0];
			console.log(link);
			if (!link) return message.channel.send('invalid link (1)');
			if (!link.includes('https://')) return message.channel.send('invalid link (2)');

			message.channel.sendTyping();

			if (link.includes('youtube')) {
				return message.channel.send('youtube links are not supported');
			}

			const res = await fetch(`${bleed_url}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({ url: link })
			});

			const data = await res.json();
			console.log(data);
			if (data.error) return message.channel.send('`' + data.error.code + '`');

			if (data.status == 'redirect' || data.status == 'tunnel') {
				console.log('tunnelling');
				const video_url = data.url;
				const res = await fetch(video_url);
				const buffer = await res.buffer();

				const embed = new EmbedBuilder().setDescription(`[Click here to download](${video_url})`).setFooter({ text: data.filename });

				await message.delete().catch(() => null);

				message.channel.send({
					files: [
						{
							attachment: buffer,
							name: data.filename
						}
					],
					embeds: [embed]
				});
			}
		}
		return;
	}
}
