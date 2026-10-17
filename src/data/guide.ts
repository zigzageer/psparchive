export const checklist: { id: string; group: string; item: string; why: string }[] = [
  { id: 'battery', group: 'Power', item: 'Battery is flat — the back cover isn’t bulging', why: 'Old Li-ion packs swell. A swollen battery can crack the shell and should be replaced and recycled immediately.' },
  { id: 'charge', group: 'Power', item: 'Charges with the orange LED, holds a charge', why: 'Fake third-party batteries and worn DC jacks are both common.' },
  { id: 'umd-spin', group: 'UMD drive', item: 'UMD spins up and loads without grinding', why: 'Worn lasers and slipping drive gears are the most common PSP fault.' },
  { id: 'umd-door', group: 'UMD drive', item: 'UMD door closes and latches firmly', why: 'Slim and Brite doors have fragile hinges; a loose door can stop discs reading.' },
  { id: 'pixels', group: 'Screen', item: 'No dead pixels, bright spots or deep scratches', why: 'Check on a white background and a black one. Mods with new panels exist but cost extra.' },
  { id: 'polarizer', group: 'Screen', item: 'No yellowing or “water stain” marks', why: 'Heat and age can damage the polarizer film.' },
  { id: 'nub', group: 'Controls', item: 'Analog nub returns to centre, no drift', why: 'Replacement nubs are cheap, but drift tells you the console was heavily used.' },
  { id: 'shoulders', group: 'Controls', item: 'L and R click cleanly', why: 'Shoulder buttons on all models wear out and can stop registering.' },
  { id: 'buttons', group: 'Controls', item: 'Every face button and the d-pad register', why: 'Test in System Settings or a game you know well.' },
  { id: 'wifi', group: 'Extras', item: 'Wi-Fi switch finds a network (not on Street)', why: 'Useful for ad hoc multiplayer and firmware checks.' },
  { id: 'shell', group: 'Extras', item: 'Shell is original, not an aftermarket replacement', why: 'Reshelled consoles are common. Fine for playing — but not what you want for a collection.' },
  { id: 'firmware', group: 'Extras', item: 'Check the firmware in Settings › System Information', why: 'Anything up to 6.61 is fine; it tells you whether the console has been updated or modified.' },
];

export const faq: { q: string; a: string }[] = [
  { q: 'Are PSP games region-locked?', a: 'No. UMD games and most digital games play on any region’s console. UMD Video movies are region-coded, and PSN accounts are tied to a store region.' },
  { q: 'Which PSP should I buy today?', a: 'For most people a PSP-2000 or PSP-3000: light, 64 MB RAM, cheap batteries and TV output. Pick the 3000 for the best screen, the 2000 to avoid the 3000’s scanlines, the Go for pocketability, and a 1000 if you love the original’s heft.' },
  { q: 'Can I still buy PSP games digitally?', a: 'No. The on-device store closed in 2016 and all PSP purchasing ended in July 2021. Games you already own can still be re-downloaded through a PS3 or PS Vita in most cases.' },
  { q: 'What memory card do I need?', a: 'Memory Stick PRO Duo for all models except the PSP Go, which uses Memory Stick Micro (M2) plus 16 GB internal storage. Adapters that take microSD cards are now the cheapest option.' },
  { q: 'Do PSP games work on the PS Vita?', a: 'Many digital PSP games run on the Vita through its built-in emulator. UMDs don’t, because the Vita has no disc drive.' },
  { q: 'What’s the difference between 2000 and 3000?', a: 'Same body and RAM. The 3000 adds a microphone, a PS button and a much more colourful, anti-glare LCD — which also shows faint scanlines some people dislike.' },
  { q: 'How long does a PSP battery last?', a: 'Roughly 3–6 hours of gameplay depending on model, brightness, Wi-Fi and UMD use. The 1000’s 1800 mAh pack lasts longest; the PSP Go’s internal 930 mAh pack the shortest.' },
  { q: 'Is the PSP-1000 screen worse?', a: 'Yes, it has more motion blur and lower contrast than later models, but many find it perfectly fine. The 3000 is the most vivid.' },
];

export const careTips: { title: string; text: string }[] = [
  { title: 'Store batteries at ~50%', text: 'Long-term storage at full or empty charge speeds up wear and swelling.' },
  { title: 'Keep discs in their cases', text: 'The UMD shell protects the disc, but the open window collects dust and scratches.' },
  { title: 'Clean the laser gently', text: 'A cotton swab with a little isopropyl alcohol on the lens can revive a drive that skips.' },
  { title: 'Use a screen protector', text: 'Glossy PSP screens and piano-black faces scratch easily.' },
  { title: 'Update to 6.61', text: 'It’s the final, most compatible firmware — and what modern CFW is built around.' },
  { title: 'Watch out for fakes', text: 'Counterfeit batteries, chargers and shells are everywhere. Buy from sellers who show the actual item.' },
];
