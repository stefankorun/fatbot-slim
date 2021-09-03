import { CommandInteraction, GuildMember } from 'discord.js';
import { Command, commandProcessor, commandProcessors } from '../command-bus';
import { filter, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { GroobyBot } from '../grooby-bot';
import { GroovyCommand } from './groovy-command';

@commandProcessors()
export class PlayCommandProcessor {
  private static readonly DUDANS_ID = '319951263892766720';

  constructor(public readonly groobyBot: GroobyBot) {}

  @commandProcessor()
  splitPlayCommand(
    commands$: Observable<Command<CommandInteraction>>
  ): Observable<Command<CommandInteraction>> {
    // TODO error handling
    return commands$.pipe(
      filter((command) => command.type === GroovyCommand.Play),
      map((command): CommandInteraction => command.payload),
      switchMap((interaction) => this.connectToVoiceChannel(interaction)),
      filter(([, connection]) => connection !== null),
      switchMap(([interaction]: any) => this.commandFor(interaction))
    );
  }

  private connectToVoiceChannel(interaction: CommandInteraction) {
    console.log('Connecting to voice channel...');

    if (interaction?.member == null)
      throw new Error('Music command missing author.');

    if (
      interaction.inGuild() == false ||
      !(interaction.member instanceof GuildMember)
    ) {
      throw new Error('Command should be invoked in a Guild.');
    }

    return from(
      this.groobyBot.connectToMemberVoiceChannel(interaction.member)
    ).pipe(
      tap((connection) => {
        if (connection == null)
          return interaction.reply('Need to join a voice channel first.');
      }),
      map((connection) => [interaction, connection])
    );
  }

  private commandFor(
    interaction: CommandInteraction
  ): Observable<Command<CommandInteraction>> {
    return this.isDudan(interaction.member as GuildMember)
      ? of({
          type: GroovyCommand.QueueVmroAnthem,
          payload: interaction,
        })
      : of({
          type: GroovyCommand.QueueSong,
          payload: interaction,
        });
  }

  private isDudan(member: GuildMember): boolean {
    return member.id === PlayCommandProcessor.DUDANS_ID;
  }
}
