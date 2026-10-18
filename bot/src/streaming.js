// Placeholder until the streaming approach is decided. Discord bot accounts
// cannot Go Live, so whatever lands here (a separate capture pipeline, a
// browser-based viewer, etc.) plugs in behind these two calls.

export async function startStream({ connection, game }) {
  console.log(`[streaming] stub: would start streaming ${game.name} to channel ${connection.joinConfig.channelId}`);
  return { stub: true };
}

export async function stopStream() {
  console.log('[streaming] stub: would stop streaming');
}
