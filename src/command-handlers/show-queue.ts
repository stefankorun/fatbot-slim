import { Command, commandHandler, CommandHandler } from '../command-bus';
import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { GroovyCommand } from './groovy-command';
import { MusicQueue } from '../music/music-queue';

interface TrackQueueDisplay {
  name: string;
  index: number;
  isNowPlaying: boolean;
}

@commandHandler(GroovyCommand.ShowQueue)
export class ShowQueueHandler implements CommandHandler<CommandInteraction> {
  static readonly commandData: ApplicationCommandData = {
    name: GroovyCommand.ShowQueue,
    description: 'Showing queued songs',
  };

  constructor(private musicQueue: MusicQueue) {}

  async handle(command: Command<CommandInteraction>) {
    const queueListMessage = this.tracksToDiscordMessage(
      this.generateQueueList()
    );

    await command.payload.reply(queueListMessage);
  }

  generateQueueList(): TrackQueueDisplay[] {
    const NUMBER_OF_PREVIOUS_SONGS = 3;

    const queue = this.musicQueue.queue;
    const safeNowPlayingIndex = this.musicQueue.nowPlayingIndex ?? 0;

    const queueToShow = queue.slice(
      Math.max(0, safeNowPlayingIndex - NUMBER_OF_PREVIOUS_SONGS)
    );

    return queueToShow.map((track) => ({
      name: track.name ?? 'n/a',
      index: queue.indexOf(track) + 1,
      isNowPlaying: queue.indexOf(track) === safeNowPlayingIndex,
    }));
  }

  tracksToDiscordMessage(tracks: TrackQueueDisplay[]) {
    const tracksText = tracks
      .map((t) => `${t.isNowPlaying ? '🎸' : t.index}) ${t.name}\n\n`)
      .join('');

    return `\`\`\`
${tracksText}\`\`\``;
  }
}
