import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { loadConfig, resolveGame, packChoices, gameChoices } from './config.js';
import { launch, stop, currentGame } from './launcher.js';
import { joinChannel, leaveChannel } from './voice.js';
import { startStream, stopStream } from './streaming.js';

export const definitions = [
  new SlashCommandBuilder()
    .setName('jackbox')
    .setDescription('Launch a Jackbox game on the host and join your voice channel')
    .addStringOption((o) =>
      o.setName('pack').setDescription('Party pack, e.g. 3').setRequired(true).setAutocomplete(true))
    .addStringOption((o) =>
      o.setName('game').setDescription('Game, e.g. quiplash2').setRequired(true).setAutocomplete(true)),
  new SlashCommandBuilder()
    .setName('jackbox-stop')
    .setDescription('Close the running Jackbox game and leave voice'),
].map((c) => c.toJSON());

// Re-read on every interaction so edits to games.json apply without a restart.
function config() {
  return loadConfig();
}

export async function handleAutocomplete(interaction) {
  const focused = interaction.options.getFocused(true);
  let result = [];
  try {
    const cfg = config();
    result = focused.name === 'pack'
      ? packChoices(cfg, focused.value)
      : gameChoices(cfg, interaction.options.getString('pack') ?? '', focused.value);
  } catch (err) {
    console.error('[autocomplete]', err.message);
  }
  await interaction.respond(result);
}

export async function handleCommand(interaction) {
  if (interaction.commandName === 'jackbox') return jackbox(interaction);
  if (interaction.commandName === 'jackbox-stop') return jackboxStop(interaction);
}

async function jackbox(interaction) {
  const packQuery = interaction.options.getString('pack', true);
  const gameQuery = interaction.options.getString('game', true);

  const channel = interaction.member?.voice?.channel;
  if (!channel) {
    return interaction.reply({ content: 'Join a voice channel first.', flags: MessageFlags.Ephemeral });
  }

  const resolved = resolveGame(config(), packQuery, gameQuery);
  if (!resolved) {
    return interaction.reply({
      content: `I don't know "${gameQuery}" in pack "${packQuery}". Check games.json.`,
      flags: MessageFlags.Ephemeral,
    });
  }

  await interaction.deferReply();
  try {
    launch(resolved);
  } catch (err) {
    return interaction.editReply(err.message);
  }

  let connection;
  try {
    connection = await joinChannel(channel);
  } catch (err) {
    stop();
    return interaction.editReply(err.message);
  }

  await startStream({ connection, game: resolved.game });
  const viaMenu = resolved.viaPackMenu
    ? ` Pick ${resolved.game.name} from the ${resolved.pack.name} menu.`
    : '';
  return interaction.editReply(
    `Launched **${resolved.game.name}** (${resolved.pack.name}) and joined **${channel.name}**.${viaMenu} ` +
    'Streaming is not wired up yet.',
  );
}

async function jackboxStop(interaction) {
  const running = currentGame();
  const stopped = stop();
  await stopStream();
  const left = leaveChannel(interaction.guildId);
  if (!stopped && !left) {
    return interaction.reply({ content: 'Nothing is running.', flags: MessageFlags.Ephemeral });
  }
  return interaction.reply(
    stopped ? `Closed **${running.game.name}** and left voice.` : 'Left voice.',
  );
}
