// Hardware reference for every PSP family. Figures are manufacturer specs or widely
// documented values (Wikipedia, Sony press material, repair guides).

export type SpecRow = { key: string; label: string; group: string };

export type ModelInfo = {
  id: string; // matches pspData ids in ../data.ts
  name: string;
  nickname: string;
  tagline: string;
  modelNumbers: string; // e.g. PSP-1000 – PSP-1010
  years: string;
  heroColor: string; // colour slug used for the hero image
  summary: string;
  releases: { region: string; date: string }[];
  prices: { region: string; price: string }[];
  dims: { w: number; h: number; d: number }; // mm
  weight: number; // g
  specs: Record<string, string>;
  changes: string[];
  pros: string[];
  cons: string[];
  boards: string[];
  launchFirmware: string;
  trivia: string[];
  ratings: { screen: number; build: number; battery: number; portability: number; homebrew: number; value: number };
};

export const SPEC_ROWS: SpecRow[] = [
  { key: 'cpu', label: 'CPU', group: 'Core' },
  { key: 'gpu', label: 'GPU', group: 'Core' },
  { key: 'ram', label: 'Main RAM', group: 'Core' },
  { key: 'edram', label: 'eDRAM', group: 'Core' },
  { key: 'screen', label: 'Display', group: 'Display' },
  { key: 'resolution', label: 'Resolution', group: 'Display' },
  { key: 'panel', label: 'Panel notes', group: 'Display' },
  { key: 'media', label: 'Game media', group: 'Storage' },
  { key: 'storage', label: 'Storage', group: 'Storage' },
  { key: 'wifi', label: 'Wi-Fi', group: 'Connectivity' },
  { key: 'bluetooth', label: 'Bluetooth', group: 'Connectivity' },
  { key: 'irda', label: 'Infrared', group: 'Connectivity' },
  { key: 'usb', label: 'USB / port', group: 'Connectivity' },
  { key: 'videoOut', label: 'Video out', group: 'Connectivity' },
  { key: 'mic', label: 'Microphone', group: 'Audio' },
  { key: 'speakers', label: 'Speakers', group: 'Audio' },
  { key: 'battery', label: 'Battery', group: 'Power' },
  { key: 'dimensions', label: 'Dimensions', group: 'Body' },
  { key: 'weight', label: 'Weight', group: 'Body' },
];

const CORE = {
  cpu: 'Sony "Allegrex" MIPS R4000-based, 1–333 MHz',
  gpu: 'Custom Graphics Core, 166 MHz (~2.6 GFLOPS)',
  edram: '4 MB (2 MB graphics + 2 MB Media Engine)',
  resolution: '480 × 272 px, 24-bit colour (16.77M)',
};

export const models: ModelInfo[] = [
  {
    id: 'psp-1000',
    name: 'PSP-1000',
    nickname: 'The Original · "Fat"',
    tagline: 'The Walkman of the 21st century.',
    modelNumbers: 'PSP-1000 – PSP-1010',
    years: '2004 – 2007',
    heroColor: 'piano-black',
    summary:
      'The launch model that started it all. Heavier and thicker than everything that followed, with the largest battery of any PSP and an infrared port that never got used much. Many collectors still consider its build quality the best of the line.',
    releases: [
      { region: 'Japan', date: '12 Dec 2004' },
      { region: 'North America', date: '24 Mar 2005' },
      { region: 'Europe & Australia', date: '1 Sep 2005' },
    ],
    prices: [
      { region: 'Japan', price: '¥19,800 (¥24,800 Value Pack)' },
      { region: 'USA', price: '$249.99 Value Pack' },
      { region: 'Europe / UK', price: '€249 / £179' },
    ],
    dims: { w: 170, h: 74, d: 23 },
    weight: 280,
    specs: {
      ...CORE,
      cpu: CORE.cpu + ' (capped at 222 MHz until FW 3.50)',
      ram: '32 MB',
      screen: '4.3" TFT LCD',
      panel: 'Noticeable ghosting/motion blur on early units',
      media: 'UMD (1.8 GB dual layer)',
      storage: 'Memory Stick PRO Duo',
      wifi: '802.11b',
      bluetooth: '—',
      irda: 'Yes (IrDA)',
      usb: 'Mini-USB 2.0 + DC-in',
      videoOut: '—',
      mic: '—',
      speakers: 'Stereo',
      battery: '1800 mAh, removable',
      dimensions: '170 × 74 × 23 mm',
      weight: '280 g',
    },
    changes: [
      'First PlayStation handheld, built around the new 60 mm UMD optical disc',
      'XMB (XrossMediaBar) interface later adopted by PS3 and Sony TVs',
      'Wi-Fi ad hoc multiplayer for up to 16 players and infrastructure online play',
      'Only model with an IrDA infrared port',
    ],
    pros: ['Sturdiest, most premium feeling shell', 'Biggest battery of any PSP (1800 mAh)', 'Bright, glossy launch colours', 'Cheapest way into the library today'],
    cons: ['Heaviest model at 280 g', 'Only 32 MB RAM — no UMD cache, slower loads', 'No TV output', 'UMD tray latch and early square-button issues'],
    boards: ['TA-079 (v1–v5)', 'TA-081', 'TA-082', 'TA-086'],
    launchFirmware: '1.00 (JP) · 1.50 (NA/EU)',
    trivia: [
      'Ken Kutaragi pitched it as "the Walkman of the 21st century".',
      'Early Japanese units shipped with a sticky square button that Sony said was by design.',
      'North American launch bundles included a UMD copy of Spider-Man 2.',
    ],
    ratings: { screen: 2, build: 5, battery: 5, portability: 2, homebrew: 4, value: 5 },
  },
  {
    id: 'psp-2000',
    name: 'PSP-2000',
    nickname: 'Slim & Lite',
    tagline: '33% lighter. 19% thinner. Twice the RAM.',
    modelNumbers: 'PSP-2000 – PSP-2010',
    years: '2007 – 2008',
    heroColor: 'piano-black',
    summary:
      'A ground-up redesign that cut weight by a third and doubled the RAM to 64 MB, used as a UMD cache for faster loading. It added TV output and USB charging, dropped infrared, and introduced the biggest colour line-up the PSP had seen.',
    releases: [
      { region: 'Hong Kong', date: '30 Aug 2007' },
      { region: 'North America & Europe', date: 'Sep 2007' },
      { region: 'Japan', date: '20 Sep 2007' },
    ],
    prices: [
      { region: 'Japan', price: '¥19,800' },
      { region: 'USA', price: '$169.99' },
    ],
    dims: { w: 169, h: 71, d: 18.6 },
    weight: 189,
    specs: {
      ...CORE,
      ram: '64 MB (32 MB used as UMD cache)',
      screen: '4.3" TFT LCD',
      panel: 'Brighter backlight, reduced ghosting',
      media: 'UMD (1.8 GB dual layer)',
      storage: 'Memory Stick PRO Duo',
      wifi: '802.11b',
      bluetooth: '—',
      irda: '—',
      usb: 'Mini-USB 2.0 (charging) + DC-in',
      videoOut: 'Component / D-Terminal (games, progressive); composite & S-Video (video only)',
      mic: '—',
      speakers: 'Stereo (relocated to the bottom edge)',
      battery: '1200 mAh, removable',
      dimensions: '169 × 71 × 18.6 mm',
      weight: '189 g',
    },
    changes: [
      'Weight cut from 280 g to 189 g, thickness from 23 mm to 18.6 mm',
      'RAM doubled to 64 MB; half is used to cache UMD data',
      'New AV-out port for TV playback',
      'Charging over USB; IrDA port and the 2-pin dock connector removed',
    ],
    pros: ['Lightest UMD model', 'Faster UMD loading thanks to cache', 'Plays games on a TV', 'Popular, well-understood homebrew target'],
    cons: ['Smaller 1200 mAh battery', 'Fragile UMD door hinge', 'Games only output progressive over component'],
    boards: ['TA-085 (v1, v2)', 'TA-088 (v1, v2, v3)', 'TA-090 (v1)'],
    launchFirmware: '3.60',
    trivia: [
      'Early TA-085 boards still work with Pandora battery recovery; TA-088v3 boards do not.',
      'Sony offered a 2200 mAh extended battery kit in Japan with a bulging replacement back cover.',
      'Its new AV-out port let PSP owners play games on a TV for the first time.',
    ],
    ratings: { screen: 3, build: 4, battery: 3, portability: 4, homebrew: 5, value: 5 },
  },
  {
    id: 'psp-3000',
    name: 'PSP-3000',
    nickname: 'Brite',
    tagline: 'Five times the contrast. A microphone. More colour than ever.',
    modelNumbers: 'PSP-3000 – PSP-3010',
    years: '2008 – 2014',
    heroColor: 'piano-black',
    summary:
      'The longest-lived and best-selling revision. Its new LCD has a wider colour gamut, five times the contrast and half the response time, plus an anti-reflective coating. A built-in microphone arrived for Skype and voice chat, and the HOME button became a PS button.',
    releases: [
      { region: 'North America', date: '14 Oct 2008' },
      { region: 'Japan', date: '16 Oct 2008' },
      { region: 'Europe', date: '17 Oct 2008' },
      { region: 'Australia', date: '23 Oct 2008' },
    ],
    prices: [
      { region: 'Japan', price: '¥19,800' },
      { region: 'USA', price: '$169.99' },
    ],
    dims: { w: 169, h: 71, d: 18.6 },
    weight: 189,
    specs: {
      ...CORE,
      ram: '64 MB',
      screen: '4.3" TFT LCD (anti-reflective)',
      panel: '5× contrast, ½ response time, wider colour range — but visible scanlines',
      media: 'UMD (1.8 GB dual layer)',
      storage: 'Memory Stick PRO Duo',
      wifi: '802.11b',
      bluetooth: '—',
      irda: '—',
      usb: 'Mini-USB 2.0 (charging) + DC-in',
      videoOut: 'All cables; games now also output interlaced over composite/S-Video',
      mic: 'Built-in',
      speakers: 'Stereo',
      battery: '1200 mAh, removable',
      dimensions: '169 × 71 × 18.6 mm',
      weight: '189 g',
    },
    changes: [
      'Redesigned LCD: richer colour, faster pixels, anti-glare finish',
      'Built-in microphone under the screen',
      'HOME button replaced by a PS button; SONY logo moved to the top left',
      'Expanded video-out modes and a redesigned UMD tray',
    ],
    pros: ['Best colour and contrast of any UMD model', 'Built-in mic for Skype & voice', 'Huge choice of colours and limited editions', 'Easy to find in good condition'],
    cons: ['Faint horizontal scanlines on the screen', 'Late boards needed new exploits for homebrew', 'Same 1200 mAh battery as the Slim'],
    boards: ['TA-090 (v2, v3)', 'TA-092', 'TA-093 (v1, v2)', 'TA-095 (v1, v2)'],
    launchFirmware: '4.20',
    trivia: [
      'The "interlacing" lines owners notice come from the new panel, not from the games.',
      'Pandora batteries never worked on it — ChickHEN (2009) was its first homebrew enabler.',
      'It stayed on sale in Japan until 2014, outliving the PSP Go.',
    ],
    ratings: { screen: 5, build: 4, battery: 3, portability: 4, homebrew: 4, value: 4 },
  },
  {
    id: 'psp-go',
    name: 'PSP Go',
    nickname: 'N1000',
    tagline: 'All digital. Slides into your pocket.',
    modelNumbers: 'PSP-N1000 – PSP-N1010',
    years: '2009 – 2011',
    heroColor: 'black',
    summary:
      'A radical sliding redesign with no UMD drive at all. Games came from the PlayStation Store onto 16 GB of internal flash. It added Bluetooth, could pair a PS3 controller, and was 43% lighter than the original — but its price and digital-only approach kept it niche.',
    releases: [
      { region: 'North America & Europe', date: '1 Oct 2009' },
      { region: 'Japan', date: '1 Nov 2009' },
    ],
    prices: [
      { region: 'Japan', price: '¥26,800' },
      { region: 'USA', price: '$249.99 (cut to $199.99 in 2010)' },
      { region: 'Europe', price: '€249' },
    ],
    dims: { w: 128, h: 69, d: 16.5 },
    weight: 158,
    specs: {
      ...CORE,
      ram: '64 MB',
      screen: '3.8" TFT LCD',
      panel: 'Smaller, sharper-looking panel on a sliding face',
      media: 'Digital only (no UMD)',
      storage: '16 GB internal flash + Memory Stick Micro (M2)',
      wifi: '802.11b',
      bluetooth: '2.0 + EDR',
      irda: '—',
      usb: 'Proprietary multi-use port',
      videoOut: 'Via multi-use port cable / cradle',
      mic: 'Built-in',
      speakers: 'Stereo',
      battery: '930 mAh, internal',
      dimensions: '128 × 69 × 16.5 mm',
      weight: '158 g',
    },
    changes: [
      'Slide-up screen hides the controls, like a phone',
      'No UMD drive — games are downloaded to 16 GB internal storage',
      'Bluetooth for headsets and DualShock 3 pairing',
      'Memory Stick Micro (M2) replaces Memory Stick PRO Duo',
    ],
    pros: ['Truly pocketable', 'Bluetooth & controller support', 'Silent — no disc drive', 'Highly collectable today'],
    cons: ['No UMD: physical games need converting or a CFW', 'M2 cards are rare and expensive', 'Proprietary charger/port', 'Analog nub placement is awkward'],
    boards: ['TA-091', 'TA-094'],
    launchFirmware: '5.70',
    trivia: [
      'It was revealed after a leak, then officially shown at Sony’s E3 2009 press conference.',
      'Sony ended production outside North America on 20 April 2011, less than two years after launch.',
      'With custom firmware many owners load their own UMD backups from internal storage.',
    ],
    ratings: { screen: 4, build: 4, battery: 2, portability: 5, homebrew: 4, value: 2 },
  },
  {
    id: 'psp-street',
    name: 'PSP Street',
    nickname: 'E1000',
    tagline: 'Back to basics, for €99.',
    modelNumbers: 'PSP-E1000 series (mostly E1004)',
    years: '2011 – 2014',
    heroColor: 'black',
    summary:
      'A budget, Europe-focused PSP launched alongside the PS Vita era. It drops Wi-Fi, the microphone and one speaker, and swaps gloss for a matte, fingerprint-resistant shell — but keeps the UMD drive and the full game library.',
    releases: [{ region: 'Europe (PAL)', date: '26 Oct 2011' }],
    prices: [{ region: 'Europe', price: '€99.99' }],
    dims: { w: 172, h: 73, d: 21.5 },
    weight: 223,
    specs: {
      ...CORE,
      ram: '64 MB',
      screen: '4.3" TFT LCD',
      panel: 'No brightness button',
      media: 'UMD (manual-open lid, 1.8 GB dual layer)',
      storage: 'Memory Stick PRO Duo',
      wifi: '— (no Wi-Fi or ad hoc)',
      bluetooth: '—',
      irda: '—',
      usb: 'Mini-USB 2.0 + DC-in',
      videoOut: '—',
      mic: '—',
      speakers: 'Mono',
      battery: '≈925 mAh, internal',
      dimensions: '172 × 73 × 21.5 mm',
      weight: '223 g',
    },
    changes: [
      'Matte plastic shell in Charcoal Black or Ice White',
      'No Wi-Fi, ad hoc or microphone; single mono speaker',
      'Top-loading manual UMD lid instead of a spring tray',
      'Priced at €99.99 — the cheapest PSP ever sold',
    ],
    pros: ['Cheap and tough', 'Matte shell hides scratches', 'Full UMD library'],
    cons: ['No wireless at all', 'Mono speaker', 'Internal battery', 'Mostly PAL-only'],
    boards: ['TA-096', 'TA-097'],
    launchFirmware: '6.50',
    trivia: [
      'Announced at Gamescom 2011, two months before the PS Vita hit Japan.',
      'It was sold mainly in PAL territories, so NTSC owners usually import one.',
      'Modders now fit far larger LiPo cells inside — a popular weekend project.',
    ],
    ratings: { screen: 3, build: 3, battery: 2, portability: 3, homebrew: 4, value: 4 },
  },
];

export const RATING_LABELS: Record<keyof ModelInfo['ratings'], string> = {
  screen: 'Screen',
  build: 'Build',
  battery: 'Battery',
  portability: 'Portability',
  homebrew: 'Homebrew',
  value: 'Value today',
};

export function getModel(id: string) {
  return models.find((m) => m.id === id);
}

// Region digit decoder: PSP-30XX → last two digits
export const REGIONS: { code: string; region: string; note?: string }[] = [
  { code: '00', region: 'Japan' },
  { code: '01', region: 'USA & Canada' },
  { code: '02', region: 'Australia & New Zealand' },
  { code: '03', region: 'United Kingdom & Ireland' },
  { code: '04', region: 'Europe, Middle East & Africa' },
  { code: '05', region: 'South Korea' },
  { code: '06', region: 'Hong Kong & Singapore' },
  { code: '07', region: 'Taiwan' },
  { code: '08', region: 'Russia' },
  { code: '09', region: 'Mainland China' },
  { code: '10', region: 'Mexico & Latin America' },
];

export const ACCESSORIES: { name: string; year: string; models: string; text: string; icon: string }[] = [
  { name: 'Go!Cam / PSP Camera', year: '2006 · 2009', models: 'Top-port models', text: 'Clip-on camera for the top port. The first 1.3 MP version arrived in 2006; the VGA Go!Cam (PSP-450x) added a mic for video chat and Invizimals-style AR.', icon: 'camera' },
  { name: 'GPS Receiver', year: '2006', models: '1000, 2000, 3000', text: 'Top-port GPS module used by map software such as the Japanese Minna no Chizu and some games and city guides.', icon: 'map-pin' },
  { name: '1seg TV Tuner', year: '2007', models: '2000, 3000 (Japan)', text: 'Japan-only digital TV tuner that turned the Slim into a pocket television.', icon: 'tv' },
  { name: 'Remote & Headphones', year: '2004', models: '1000, 2000, 3000', text: 'Inline remote with a hold switch and volume. The Value Pack shipped it with earbuds.', icon: 'headphones' },
  { name: 'Headset / Skype Mic', year: '2008', models: '2000, 3000', text: 'Remote-port headset for Skype calls and in-game voice chat. The PSP-3000 and Go have a built-in mic instead.', icon: 'mic' },
  { name: 'AV Cables', year: '2007', models: '2000, 3000, Go', text: 'Composite, S-Video, component and D-Terminal cables for TV output. Games need component or D-Terminal on the 2000.', icon: 'cable' },
  { name: 'Extended Battery Kit', year: '2008', models: '2000, 3000', text: '2200 mAh battery with a deeper replacement back cover. Big runtime boost for the Slim and Brite.', icon: 'battery' },
  { name: 'PSP Go Cradle', year: '2009', models: 'Go', text: 'Desk dock with AV and USB pass-through for charging and TV play.', icon: 'monitor' },
  { name: 'Memory Stick PRO Duo / M2', year: '2004 →', models: 'All', text: 'Save, music and digital-game storage. Today most people use microSD-to-Pro-Duo adapters.', icon: 'hard-drive' },
];
