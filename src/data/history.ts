export type EventKind = 'hardware' | 'software' | 'games' | 'business' | 'scene';

export type HistoryEvent = {
  date: string; // display date
  year: number;
  kind: EventKind;
  title: string;
  text: string;
  link?: string;
  big?: boolean;
};

export const ERAS = [
  { id: 'reveal', label: 'Reveal', range: '2003–2004', from: 2003, to: 2004, blurb: 'Sony enters the handheld market Nintendo had owned for 15 years.' },
  { id: 'launch', label: 'Launch Era', range: '2005–2006', from: 2005, to: 2006, blurb: 'A worldwide rollout, a web browser and the first wave of homebrew.' },
  { id: 'slim', label: 'Slim Era', range: '2007–2008', from: 2007, to: 2008, blurb: 'Lighter hardware, Monster Hunter mania and a flood of colours.' },
  { id: 'go', label: 'Brite & Go', range: '2009–2010', from: 2009, to: 2010, blurb: 'The digital experiment, minis, and the PSP’s biggest games.' },
  { id: 'twilight', label: 'Twilight', range: '2011–2016', from: 2011, to: 2016, blurb: 'Vita takes over; the PSP keeps selling for years anyway.' },
  { id: 'afterlife', label: 'Afterlife', range: '2017 →', from: 2017, to: 2100, blurb: 'Emulation, preservation and a collector scene that never left.' },
] as const;

export const KIND_LABEL: Record<EventKind, string> = {
  hardware: 'Hardware',
  software: 'Firmware',
  games: 'Games',
  business: 'Business',
  scene: 'Scene',
};

export const history: HistoryEvent[] = [
  { date: 'May 2003', year: 2003, kind: 'business', title: 'Sony announces the PSP', text: 'At its pre-E3 press conference Sony confirms it is building a portable PlayStation — its first attempt to challenge Nintendo’s Game Boy dominance.', big: true },
  { date: 'Nov 2003', year: 2003, kind: 'hardware', title: 'First concept images', text: 'Sony shows early concept renders: a widescreen slab with flat buttons, a new optical disc format — and no analog nub yet.' },
  { date: '11 May 2004', year: 2004, kind: 'hardware', title: 'Unveiled at E3 2004', text: 'The final glossy black design debuts on stage. Ken Kutaragi calls it “the Walkman of the 21st century”; 99 companies pledge games.', big: true },
  { date: '12 Dec 2004', year: 2004, kind: 'hardware', title: 'Japan launch', text: 'PSP-1000 launches in Japan at ¥19,800 with Ridge Racers and Lumines among the first titles. Stores sell out on day one.', link: '/models/psp-1000', big: true },

  { date: '24 Mar 2005', year: 2005, kind: 'hardware', title: 'North American launch', text: 'The $249.99 Value Pack ships with headphones, a remote, a case, a 32 MB Memory Stick and — for early buyers — Spider-Man 2 on UMD Video.', link: '/models/psp-1000', big: true },
  { date: 'Jun 2005', year: 2005, kind: 'software', title: 'Firmware 2.00: web browser', text: 'A NetFront-based browser, wallpapers and broader media support arrive — and the update quietly closes the earliest homebrew exploits.', link: '/firmware' },
  { date: 'Mid 2005', year: 2005, kind: 'scene', title: 'First homebrew runs', text: 'Exploits in firmware 1.00 and 1.50 let unsigned code run. Within weeks there are emulators, media players and tech demos.', link: '/homebrew' },
  { date: '1 Sep 2005', year: 2005, kind: 'hardware', title: 'Europe & Australia launch', text: 'After a delay from the planned simultaneous launch, the PSP finally arrives in PAL territories.', big: true },
  { date: 'Oct 2005', year: 2005, kind: 'games', title: 'GTA: Liberty City Stories', text: 'Rockstar Leeds delivers a full 3D GTA on a handheld. It becomes the best-selling PSP game of all time.', link: '/games' },

  { date: 'Apr 2006', year: 2006, kind: 'software', title: 'Flash in your pocket', text: 'Firmware 2.70 adds Flash support to the browser, plus fixes for the GTA save exploit.', link: '/firmware' },
  { date: 'Jul 2006', year: 2006, kind: 'scene', title: 'Dark_AleX’s custom firmware', text: 'Spanish hacker Dark_AleX releases a proof-of-concept custom firmware — the start of the OE and M33 era.', link: '/homebrew' },
  { date: 'Nov 2006', year: 2006, kind: 'software', title: 'PS1 classics & Remote Play', text: 'Firmware 3.00 lets the PSP play downloadable PSone Classics and pairs with the brand-new PS3 for Remote Play.', link: '/firmware' },

  { date: 'May 2007', year: 2007, kind: 'software', title: '333 MHz unlocked', text: 'Firmware 3.50 lets developers run the CPU at its full 333 MHz instead of the 222 MHz cap.', link: '/firmware' },
  { date: 'Aug 2007', year: 2007, kind: 'scene', title: 'Pandora’s Battery', text: 'A modified battery plus a “Magic Memory Stick” can unbrick a PSP-1000 (and later early Slims) and install any firmware. Sony cannot patch it in software.', link: '/homebrew' },
  { date: 'Sep 2007', year: 2007, kind: 'hardware', title: 'PSP-2000 Slim & Lite', text: '33% lighter, 19% thinner, 64 MB RAM and TV output. A new wave of colours and limited editions follows.', link: '/models/psp-2000', big: true },
  { date: 'Sep 2007', year: 2007, kind: 'games', title: 'Crisis Core: Final Fantasy VII', text: 'Square Enix’s Zack Fair prequel launches in Japan alongside a silver FFVII 10th Anniversary Slim.', link: '/colors/psp-2000/final-fantasy-vii-10th-anniversary' },

  { date: 'Feb 2008', year: 2008, kind: 'software', title: 'Skype on PSP', text: 'Firmware 3.90 brings Skype voice calls to the PSP-2000 (with a headset) and later models.', link: '/firmware' },
  { date: 'Mar 2008', year: 2008, kind: 'games', title: 'Monster Hunter Portable 2nd G', text: 'Capcom’s co-op hunter becomes a cultural phenomenon in Japan, selling millions and driving PSP hardware sales.', link: '/games', big: true },
  { date: 'Oct 2008', year: 2008, kind: 'hardware', title: 'PSP-3000 “Brite”', text: 'A new LCD with five times the contrast, a built-in mic and a PS button.', link: '/models/psp-3000', big: true },
  { date: 'Oct 2008', year: 2008, kind: 'software', title: 'PlayStation Store on the PSP', text: 'Firmware 5.00 lets owners browse and buy games directly on the handheld for the first time.', link: '/firmware' },

  { date: 'Mar 2009', year: 2009, kind: 'scene', title: 'ChickHEN cracks the 3000', text: 'Davee’s ChickHEN runs homebrew on the supposedly unhackable PSP-3000 via a TIFF image exploit.', link: '/homebrew' },
  { date: 'Jun 2009', year: 2009, kind: 'business', title: 'PSP Go revealed at E3', text: 'After weeks of leaks, Sony officially shows the sliding, UMD-less PSP Go on stage at E3.', link: '/models/psp-go' },
  { date: '1 Oct 2009', year: 2009, kind: 'hardware', title: 'PSP Go launches', text: 'The $249.99 N1000 ships with 16 GB of storage and Bluetooth, alongside PlayStation minis — small, cheap digital games. Reviewers love the size and question the price.', link: '/models/psp-go', big: true },
  { date: 'Nov 2009', year: 2009, kind: 'software', title: 'Digital Comics', text: 'Firmware 6.20 adds the Digital Comics reader and a clock screen saver.', link: '/firmware' },

  { date: 'Apr 2010', year: 2010, kind: 'games', title: 'Metal Gear Solid: Peace Walker', text: 'Kojima Productions delivers a console-scale Metal Gear on the PSP, built around four-player co-op.', link: '/games' },
  { date: 'Dec 2010', year: 2010, kind: 'games', title: 'Monster Hunter Portable 3rd', text: 'Ships millions of copies in Japan almost immediately — the PSP’s Japanese peak.', link: '/games' },

  { date: 'Jan 2011', year: 2011, kind: 'business', title: 'Next Generation Portable', text: 'Sony unveils “NGP” in Tokyo — the system that becomes the PlayStation Vita.' },
  { date: 'Apr 2011', year: 2011, kind: 'business', title: 'PSP Go discontinued (outside NA)', text: 'Less than two years after launch, Sony ends PSP Go production for Japan and Europe.', link: '/models/psp-go' },
  { date: 'Aug 2011', year: 2011, kind: 'software', title: 'Firmware 6.60', text: 'The first universal firmware for every model. It would be the last feature-level update.', link: '/firmware' },
  { date: '26 Oct 2011', year: 2011, kind: 'hardware', title: 'PSP Street (E1000)', text: 'A €99.99 budget model with no Wi-Fi launches in Europe.', link: '/models/psp-street', big: true },
  { date: 'Dec 2011', year: 2011, kind: 'business', title: 'PS Vita launches in Japan', text: 'The successor arrives on 17 December. It plays many digital PSP games, but not UMDs.' },

  { date: '2012', year: 2012, kind: 'scene', title: 'PPSSPP appears', text: 'Henrik Rydgård releases PPSSPP, an open-source PSP emulator that will run on phones, PCs and consoles.', link: '/homebrew' },
  { date: '2014', year: 2014, kind: 'business', title: 'Shipments end', text: 'North American shipments stop in January; Japan announces the end in June; Europe follows in December.', big: true },
  { date: '15 Jan 2015', year: 2015, kind: 'software', title: 'Firmware 6.61 — the final update', text: 'A minor security release. No official update has followed since.', link: '/firmware' },
  { date: '2015', year: 2015, kind: 'scene', title: 'Infinity', text: 'Davee’s Infinity makes custom firmware permanent on 6.60/6.61 — every PSP can now boot straight into CFW.', link: '/homebrew' },
  { date: 'Mar 2016', year: 2016, kind: 'business', title: 'On-device store closes', text: 'The PlayStation Store app on the PSP shuts down. Purchases are still possible through PS3, Vita and the web.' },
  { date: 'Apr 2016', year: 2016, kind: 'games', title: 'The last UMDs', text: 'The final physical UMD games ship in Japan and North America. The last UMD factory closes later that year.' },
  { date: 'Jul 2016', year: 2016, kind: 'games', title: 'Final digital release', text: 'Retro City Rampage DX becomes the last game released for the PSP.' },

  { date: 'Jul 2021', year: 2021, kind: 'business', title: 'PSP digital store closes', text: 'Purchasing PSP games through PS3, Vita and the web ends. Previously bought games can still be re-downloaded.' },
  { date: 'Today', year: 2026, kind: 'scene', title: 'Still kicking', text: 'ARK-4 and PRO custom firmware, PPSSPP, IPS screen mods, new shells and fan translations keep the PSP alive two decades on.', link: '/homebrew', big: true },
];
