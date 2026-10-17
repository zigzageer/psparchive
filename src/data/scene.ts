// Homebrew & custom firmware history. Descriptive only — no download links.

export type SceneEvent = { date: string; title: string; who?: string; text: string };

export const sceneTimeline: SceneEvent[] = [
  { date: 'Mid 2005', title: 'KXploit & Swaploit', text: 'Tricks with folder names on Memory Sticks let firmware 1.00 and 1.50 run unsigned code. The first homebrew — emulators, players, demos — appears within weeks.' },
  { date: 'Sep 2005', title: 'TIFF exploit & downgrader', text: 'A buffer overflow in 2.00’s image viewer gives a way in, and MPH’s downgrader turns 2.0x consoles back into 1.50s.' },
  { date: 'Late 2005', title: 'The GTA save exploit', who: 'Fanjita', text: 'A crafted Liberty City Stories save game launches homebrew on 2.xx firmware. Fanjita’s eLoader becomes the standard launcher.' },
  { date: 'Jul 2006', title: 'Custom firmware is born', who: 'Dark_AleX', text: 'A proof-of-concept 1.50 custom firmware, then 2.71 SE and the Open Edition (OE) series that let homebrew and official games coexist.' },
  { date: 'Jul 2007', title: '3.51 M33', who: 'Team M33', text: 'Weeks after Dark_AleX announces his retirement, the anonymous Team M33 takes over and its CFW becomes the community standard. Team M33 is later revealed to be Dark_AleX himself.' },
  { date: 'Aug 2007', title: 'Pandora’s Battery', who: 'Team Noobz, Dark_AleX & others', text: 'A service-mode battery plus a Magic Memory Stick can unbrick and reflash any compatible board. Because it works at the hardware level, Sony can’t patch it.' },
  { date: 'Late 2007', title: 'The Slim gets CFW', who: 'Team M33', text: '3.60 M33 is the first custom firmware for the PSP-2000, installed via Pandora on early boards.' },
  { date: 'Mar 2009', title: 'ChickHEN', who: 'Davee', text: 'A homebrew enabler for the “unhackable” PSP-3000 and late Slims, triggered by viewing a TIFF image on 5.03.' },
  { date: '2010 – 2011', title: 'HEN, PRO & ME', who: 'Total_Noob, Coldbird, VirtuousFlame, neur0n', text: 'TN-HEN on 6.20, then the PRO and ME/LME custom firmwares bring CFW features to 6.3x and 6.60 on every model.' },
  { date: '2015', title: 'Infinity', who: 'Davee', text: 'A permanent boot-time CFW loader for 6.60/6.61. No more re-running a launcher after every reboot.' },
  { date: '2020s', title: 'ARK-4', who: 'Acid_Snake & contributors', text: 'A modern, actively maintained CFW for every PSP and for PS Vita’s built-in PSP emulator.' },
];

export const homebrewHighlights: { name: string; kind: string; text: string }[] = [
  { name: 'PPSSPP', kind: 'Emulator (PSP)', text: 'The open-source PSP emulator. Runs most of the library in HD on phones, PCs and handheld PCs.' },
  { name: 'Daedalus X64', kind: 'Emulator (N64)', text: 'Nintendo 64 on a PSP — impressive speed thanks to the Media Engine.' },
  { name: 'PicoDrive / gpSP / NesterJ', kind: 'Emulators', text: 'Classic Mega Drive, GBA and NES emulation that ran beautifully on the PSP’s screen.' },
  { name: 'RetroArch PSP', kind: 'Frontend', text: 'Libretro cores packaged for the PSP itself.' },
  { name: 'CXMB / CTF themes', kind: 'Customisation', text: 'Fully custom XMB themes, icons and fonts beyond Sony’s .ptf format.' },
  { name: 'Fan translations', kind: 'Community', text: 'English patches for Japan-only games such as Monster Hunter Portable 3rd and Valkyria Chronicles III.' },
];

export const sceneGlossary: { term: string; text: string }[] = [
  { term: 'OFW', text: 'Official firmware — what Sony shipped. 6.61 is the final version.' },
  { term: 'CFW', text: 'Custom firmware. Patches the system to run unsigned code and plugins.' },
  { term: 'HEN', text: 'Homebrew Enabler — a temporary, launch-on-boot exploit rather than a permanent install.' },
  { term: 'Brick', text: 'A console that won’t boot, usually after an interrupted firmware write.' },
  { term: 'Pandora', text: 'A battery in service mode. Paired with a Magic Memory Stick it can repair compatible early boards.' },
  { term: 'Plugin', text: 'A small module loaded by CFW — screenshots, overclocking, button remaps, cheats.' },
  { term: 'ISO / CSO', text: 'Disc images of UMDs (CSO is compressed). Dumping your own games is how most people preserve them today.' },
];
