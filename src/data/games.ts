export type Game = {
  title: string;
  year: number; // first release (any region)
  dev: string;
  genre: Genre;
  tags: string[];
  blurb: string;
};

export type Genre =
  | 'Action'
  | 'Action RPG'
  | 'RPG'
  | 'Tactics'
  | 'Racing'
  | 'Puzzle'
  | 'Rhythm'
  | 'Platformer'
  | 'Shooter'
  | 'Fighting'
  | 'Stealth'
  | 'Adventure'
  | 'Sports';

export const GENRES: Genre[] = ['Action', 'Action RPG', 'RPG', 'Tactics', 'Racing', 'Puzzle', 'Rhythm', 'Platformer', 'Shooter', 'Fighting', 'Stealth', 'Adventure', 'Sports'];

export const TAGS = ['Essential', 'Launch title', 'Best-seller', 'Co-op', 'Hidden gem', 'Japan only'] as const;

export const games: Game[] = [
  { title: 'Grand Theft Auto: Liberty City Stories', year: 2005, dev: 'Rockstar Leeds', genre: 'Action', tags: ['Essential', 'Best-seller'], blurb: 'A full 3D GTA in your pocket and the best-selling PSP game ever. Its save exploit also kick-started a homebrew era.' },
  { title: 'Grand Theft Auto: Vice City Stories', year: 2006, dev: 'Rockstar Leeds', genre: 'Action', tags: ['Best-seller'], blurb: 'Bigger, brighter and more ambitious than LCS, with an empire-building twist on 1984 Vice City.' },
  { title: 'Grand Theft Auto: Chinatown Wars', year: 2009, dev: 'Rockstar Leeds', genre: 'Action', tags: ['Hidden gem'], blurb: 'The top-down DS original, rebuilt with sharper art and extra missions for the PSP.' },
  { title: 'Monster Hunter Freedom Unite', year: 2008, dev: 'Capcom', genre: 'Action RPG', tags: ['Essential', 'Best-seller', 'Co-op'], blurb: 'Known as Portable 2nd G in Japan, where four-player ad hoc hunts turned the PSP into a national phenomenon.' },
  { title: 'Monster Hunter Portable 3rd', year: 2010, dev: 'Capcom', genre: 'Action RPG', tags: ['Best-seller', 'Co-op', 'Japan only'], blurb: 'The PSP’s Japanese peak — millions shipped in its first weeks. A fan translation exists.' },
  { title: 'Crisis Core: Final Fantasy VII', year: 2007, dev: 'Square Enix', genre: 'Action RPG', tags: ['Essential'], blurb: 'Zack Fair’s story, told with console-level cutscenes and a slot-machine combat twist.' },
  { title: 'Final Fantasy Tactics: The War of the Lions', year: 2007, dev: 'Square Enix', genre: 'Tactics', tags: ['Essential'], blurb: 'The classic tactics RPG with a new translation and gorgeous hand-painted cutscenes.' },
  { title: 'Dissidia Final Fantasy', year: 2008, dev: 'Square Enix', genre: 'Fighting', tags: ['Essential'], blurb: 'Heroes and villains from across Final Fantasy collide in a flashy, deep arena brawler.' },
  { title: 'Dissidia 012 Final Fantasy', year: 2011, dev: 'Square Enix', genre: 'Fighting', tags: [], blurb: 'A prequel-expansion with assist characters, a bigger roster and an RPG-style world map.' },
  { title: 'Final Fantasy Type-0', year: 2011, dev: 'Square Enix', genre: 'Action RPG', tags: ['Japan only'], blurb: 'A darker war story with 14 playable cadets. Released on two UMDs in Japan; the West got an HD remaster.' },
  { title: 'Kingdom Hearts Birth by Sleep', year: 2010, dev: 'Square Enix', genre: 'Action RPG', tags: ['Essential'], blurb: 'Three intertwined prequel campaigns and a deck-based command system. Arguably the best-looking PSP game.' },
  { title: 'God of War: Chains of Olympus', year: 2008, dev: 'Ready at Dawn', genre: 'Action', tags: ['Essential'], blurb: 'Kratos at full scale on a handheld — a technical showpiece that squeezed console-grade spectacle out of the PSP.' },
  { title: 'God of War: Ghost of Sparta', year: 2010, dev: 'Ready at Dawn', genre: 'Action', tags: ['Essential'], blurb: 'Bigger set pieces and a personal story about Kratos’ brother Deimos.' },
  { title: 'Daxter', year: 2006, dev: 'Ready at Dawn', genre: 'Platformer', tags: [], blurb: 'Ready at Dawn’s debut: a polished 3D platformer filling the gap between Jak 1 and Jak II.' },
  { title: 'Metal Gear Solid: Peace Walker', year: 2010, dev: 'Kojima Productions', genre: 'Stealth', tags: ['Essential', 'Co-op'], blurb: 'Big Boss builds Mother Base. A full-scale Metal Gear that laid the groundwork for MGS V.' },
  { title: 'Metal Gear Solid: Portable Ops', year: 2006, dev: 'Kojima Productions', genre: 'Stealth', tags: [], blurb: 'Recruit soldiers, build a squad and infiltrate San Hieronymo in this MGS3 follow-up.' },
  { title: 'Metal Gear Acid', year: 2004, dev: 'Konami', genre: 'Tactics', tags: ['Launch title'], blurb: 'A card-based, turn-based spin on Metal Gear from the system’s launch window.' },
  { title: 'Persona 3 Portable', year: 2009, dev: 'Atlus', genre: 'RPG', tags: ['Essential'], blurb: 'The definitive Persona 3 for many fans thanks to a female protagonist route and streamlined party control.' },
  { title: 'Valkyria Chronicles II', year: 2010, dev: 'Sega', genre: 'Tactics', tags: [], blurb: 'The watercolour war-tactics series moves to a military academy.' },
  { title: 'Valkyria Chronicles III', year: 2011, dev: 'Sega', genre: 'Tactics', tags: ['Japan only', 'Hidden gem'], blurb: 'The darker Nameless squad story. Never officially localized; a fan translation exists.' },
  { title: 'Tactics Ogre: Let Us Cling Together', year: 2010, dev: 'Square Enix', genre: 'Tactics', tags: ['Essential'], blurb: 'Matsuno’s political masterpiece remade with a Chariot Tarot rewind system.' },
  { title: 'Jeanne d’Arc', year: 2006, dev: 'Level-5', genre: 'Tactics', tags: ['Hidden gem'], blurb: 'A fantasy retelling of Joan of Arc and one of the most approachable tactics RPGs on the system.' },
  { title: 'The Legend of Heroes: Trails in the Sky', year: 2006, dev: 'Nihon Falcom', genre: 'RPG', tags: ['Hidden gem'], blurb: 'The PSP port of Falcom’s beloved RPG, later the start of a huge saga in the West.' },
  { title: 'Ys Seven', year: 2009, dev: 'Nihon Falcom', genre: 'Action RPG', tags: [], blurb: 'Party-based Ys with fast, combo-heavy action and a great soundtrack.' },
  { title: 'Ys: The Oath in Felghana', year: 2010, dev: 'Nihon Falcom', genre: 'Action RPG', tags: ['Hidden gem'], blurb: 'Tight, fast boss-rush action RPG — and a reminder of why people love Falcom.' },
  { title: 'Star Ocean: First Departure', year: 2007, dev: 'tri-Ace', genre: 'RPG', tags: [], blurb: 'A full remake of the first Star Ocean, with new anime cutscenes.' },
  { title: 'Phantasy Star Portable 2', year: 2009, dev: 'Sega', genre: 'Action RPG', tags: ['Co-op'], blurb: 'Loot-driven co-op with an infrastructure online mode, a precursor to PSO2.' },
  { title: 'Half-Minute Hero', year: 2009, dev: 'Opus', genre: 'RPG', tags: ['Hidden gem'], blurb: 'Save the world in 30 seconds. A brilliant, frantic parody of RPG tropes.' },
  { title: 'Patapon', year: 2007, dev: 'Pyramid / Japan Studio', genre: 'Rhythm', tags: ['Essential'], blurb: 'Command an army of eyeballs by drumming rhythms. Pata-pata-pata-pon!' },
  { title: 'Patapon 2', year: 2008, dev: 'Pyramid / Japan Studio', genre: 'Rhythm', tags: ['Co-op'], blurb: 'More classes, more evolution trees and ad hoc multiplayer.' },
  { title: 'LocoRoco', year: 2006, dev: 'Japan Studio', genre: 'Platformer', tags: ['Essential'], blurb: 'Tilt the world with the shoulder buttons to roll a singing blob home. Pure joy.' },
  { title: 'LocoRoco 2', year: 2008, dev: 'Japan Studio', genre: 'Platformer', tags: [], blurb: 'More songs, more Moja, more squishy physics.' },
  { title: 'Lumines: Puzzle Fusion', year: 2004, dev: 'Q Entertainment', genre: 'Puzzle', tags: ['Essential', 'Launch title'], blurb: 'Tetsuya Mizuguchi’s audiovisual block puzzler, the PSP’s defining launch game.' },
  { title: 'Lumines II', year: 2006, dev: 'Q Entertainment', genre: 'Puzzle', tags: [], blurb: 'More skins, licensed music videos and a sequence editor.' },
  { title: 'Exit', year: 2005, dev: 'Taito', genre: 'Puzzle', tags: ['Hidden gem'], blurb: 'Lead survivors out of disaster zones as Mr. ESC in this stylish puzzle-platformer.' },
  { title: 'Echochrome', year: 2008, dev: 'Japan Studio', genre: 'Puzzle', tags: ['Hidden gem'], blurb: 'Rotate an Escher-like world until impossible paths become real.' },
  { title: 'Every Extend Extra', year: 2006, dev: 'Q Entertainment', genre: 'Shooter', tags: ['Hidden gem'], blurb: 'Blow yourself up to chain explosions in time to the music.' },
  { title: 'Ridge Racer', year: 2004, dev: 'Namco', genre: 'Racing', tags: ['Launch title'], blurb: 'Known as Ridge Racers in Japan. Pure drift-heavy arcade racing at launch.' },
  { title: 'WipEout Pure', year: 2005, dev: 'Studio Liverpool', genre: 'Racing', tags: ['Essential'], blurb: 'Anti-grav racing with downloadable tracks and Designers Republic-style futurism.' },
  { title: 'WipEout Pulse', year: 2007, dev: 'Studio Liverpool', genre: 'Racing', tags: [], blurb: 'Mag-strip loops, a huge campaign grid and one of the best electronic soundtracks on the system.' },
  { title: 'Gran Turismo', year: 2009, dev: 'Polyphony Digital', genre: 'Racing', tags: ['Best-seller'], blurb: '800-plus cars on a handheld, launched alongside the PSP Go.' },
  { title: 'Burnout Legends', year: 2005, dev: 'Criterion', genre: 'Racing', tags: [], blurb: 'Best-of Burnout with crash junctions and takedowns intact.' },
  { title: 'Killzone: Liberation', year: 2006, dev: 'Guerrilla', genre: 'Shooter', tags: [], blurb: 'An isometric action shooter that played to the PSP’s strengths instead of fighting the nub.' },
  { title: 'Resistance: Retribution', year: 2009, dev: 'Bend Studio', genre: 'Shooter', tags: [], blurb: 'Third-person Resistance with smart auto-aim, plus PS3 connectivity.' },
  { title: 'SOCOM: Fireteam Bravo', year: 2005, dev: 'Zipper Interactive', genre: 'Shooter', tags: ['Co-op'], blurb: 'Online squad shooting with voice chat via a headset — ambitious for 2005.' },
  { title: 'Syphon Filter: Dark Mirror', year: 2006, dev: 'Bend Studio', genre: 'Stealth', tags: [], blurb: 'Gabe Logan returns in one of the best-controlling third-person shooters on the system.' },
  { title: 'Ratchet & Clank: Size Matters', year: 2007, dev: 'High Impact Games', genre: 'Platformer', tags: [], blurb: 'The full Ratchet formula of guns and gadgets shrunk to handheld size.' },
  { title: 'Tekken: Dark Resurrection', year: 2006, dev: 'Namco', genre: 'Fighting', tags: ['Essential'], blurb: 'An astonishing port of the arcade Tekken 5 update that looked better than many PS2 games.' },
  { title: 'Street Fighter Alpha 3 MAX', year: 2006, dev: 'Capcom', genre: 'Fighting', tags: [], blurb: 'Arcade-perfect Alpha 3 with extra characters — d-pad recommended.' },
  { title: 'Castlevania: The Dracula X Chronicles', year: 2007, dev: 'Konami', genre: 'Platformer', tags: ['Essential'], blurb: 'A 2.5D remake of Rondo of Blood, with the original and Symphony of the Night unlockable inside.' },
  { title: 'Mega Man Maverick Hunter X', year: 2005, dev: 'Capcom', genre: 'Platformer', tags: [], blurb: 'A 3D-rendered remake of Mega Man X with a playable Vile mode.' },
  { title: 'Mega Man Powered Up', year: 2006, dev: 'Capcom', genre: 'Platformer', tags: ['Hidden gem'], blurb: 'Chibi-styled remake of the original Mega Man with a level editor.' },
  { title: 'Prinny: Can I Really Be the Hero?', year: 2008, dev: 'Nippon Ichi', genre: 'Platformer', tags: [], blurb: 'Brutally hard platforming starring Disgaea’s exploding penguins, dood.' },
  { title: 'Disgaea: Afternoon of Darkness', year: 2006, dev: 'Nippon Ichi', genre: 'Tactics', tags: [], blurb: 'The over-the-top grind-tastic tactics RPG with a new Etna mode.' },
  { title: 'Hatsune Miku: Project DIVA', year: 2009, dev: 'Sega', genre: 'Rhythm', tags: ['Japan only'], blurb: 'The vocaloid rhythm series begins — later entries even got turquoise PSP bundles.' },
  { title: 'Gitaroo Man Lives!', year: 2006, dev: 'iNiS', genre: 'Rhythm', tags: ['Hidden gem'], blurb: 'The cult PS2 rhythm game about a boy, a talking dog and a legendary guitar, faithfully ported.' },
  { title: 'Corpse Party', year: 2010, dev: 'Team GrisGris / 5pb.', genre: 'Adventure', tags: ['Hidden gem'], blurb: 'Pixel-art horror at Heavenly Host Elementary. Headphones on.' },
  { title: 'Danganronpa: Trigger Happy Havoc', year: 2010, dev: 'Spike', genre: 'Adventure', tags: ['Japan only'], blurb: 'The murder-mystery series debuted on PSP; the West first got it on Vita in 2014.' },
  { title: 'Silent Hill: Origins', year: 2007, dev: 'Climax Studios', genre: 'Adventure', tags: [], blurb: 'A prequel that brought fog, radio static and Akira Yamaoka’s music to the PSP.' },
  { title: 'LittleBigPlanet', year: 2009, dev: 'SCE Cambridge / Media Molecule', genre: 'Platformer', tags: [], blurb: 'Play, create, share — Sackboy’s creation tools on a handheld.' },
  { title: 'ModNation Racers', year: 2010, dev: 'SCE San Diego', genre: 'Racing', tags: [], blurb: 'Kart racing with a full track and character creator.' },
  { title: 'Invizimals', year: 2009, dev: 'Novarama', genre: 'Adventure', tags: [], blurb: 'Capture monsters in augmented reality using the Go!Cam — a big hit in Europe.' },
  { title: 'Hot Shots Golf: Open Tee', year: 2005, dev: 'Clap Hanz', genre: 'Sports', tags: [], blurb: 'Everybody’s Golf in your pocket — the perfect pick-up-and-play PSP game.' },
  { title: 'Pursuit Force', year: 2005, dev: 'Bigbig Studios', genre: 'Action', tags: ['Hidden gem'], blurb: 'Leap between speeding vehicles as an over-the-top police task force.' },
];
