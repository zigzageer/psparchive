export type Firmware = {
  version: string;
  date: string;
  headline: string;
  notes: string[];
  milestone?: boolean;
};

// Curated: the releases that changed what a PSP could do. Minor security-only builds are folded in.
export const firmware: Firmware[] = [
  { version: '1.00', date: 'Dec 2004', headline: 'Launch firmware (Japan)', notes: ['XMB with Settings, Photo, Music, Video, Game and Network', 'UMD Video & UMD Game playback', 'Ad hoc Wi-Fi multiplayer'], milestone: true },
  { version: '1.50', date: 'Mar 2005', headline: 'Western launch firmware', notes: ['Shipped on North American consoles', 'Later famous as the homebrew-friendly firmware everyone downgraded to'] },
  { version: '1.51 – 1.52', date: 'mid 2005', headline: 'Security patches', notes: ['Closed the first homebrew exploits (KXploit, Swaploit)'] },
  { version: '2.00', date: 'Jun 2005', headline: 'Web browser', notes: ['NetFront-based Internet Browser with up to three tabs', 'Custom wallpapers and wider media format support'], milestone: true },
  { version: '2.50', date: 'Oct 2005', headline: 'Browser & text upgrades', notes: ['UTF-8 support, auto-select and saved form history', 'LocationFree Player for streaming TV from a Sony base station'] },
  { version: '2.60', date: 'Dec 2005', headline: 'RSS Channel', notes: ['Subscribe to audio podcasts and RSS feeds', 'WMA music playback'] },
  { version: '2.70 – 2.71', date: 'Apr 2006', headline: 'Flash support', notes: ['Browser gains basic Flash playback', 'Patches the GTA save-game homebrew exploit'] },
  { version: '3.00', date: 'Nov 2006', headline: 'PSone Classics & Remote Play', notes: ['Play downloadable PS1 games', 'Remote Play with the new PS3'], milestone: true },
  { version: '3.50', date: 'May 2007', headline: 'Full-speed CPU', notes: ['Games may run the CPU at 333 MHz instead of 222 MHz'] },
  { version: '3.60', date: 'Sep 2007', headline: 'PSP-2000 launch', notes: ['Video-out support for the Slim & Lite'] },
  { version: '3.70', date: 'Oct 2007', headline: 'Custom themes', notes: ['Install XMB themes with your own backgrounds and icons'] },
  { version: '3.80', date: 'Dec 2007', headline: 'Internet radio', notes: ['Internet radio player', 'New music visualizer', 'OPML import for RSS'] },
  { version: '3.90', date: 'Feb 2008', headline: 'Skype', notes: ['Skype voice calls on PSP-2000 and later (headset or built-in mic)'], milestone: true },
  { version: '4.00', date: 'Jun 2008', headline: 'Search from the XMB', notes: ['Web search directly from the home menu'] },
  { version: '4.20', date: 'Oct 2008', headline: 'PSP-3000 launch', notes: ['Support for the Brite’s new panel and mic'] },
  { version: '5.00', date: 'Oct 2008', headline: 'PlayStation Store on PSP', notes: ['Browse, buy and download games directly on the handheld'], milestone: true },
  { version: '5.50', date: '2009', headline: 'Store & account updates', notes: ['Go!Messenger icon removed after the service ended'] },
  { version: '5.70', date: 'Sep 2009', headline: 'PSP Go support', notes: ['Internal storage, Bluetooth and the sliding hardware'] },
  { version: '6.00', date: 'Sep 2009', headline: 'Go!Cam', notes: ['Support for the PSP-450x Go!Cam'] },
  { version: '6.10', date: 'Oct 2009', headline: 'SensMe channels', notes: ['Music sorted automatically by mood'] },
  { version: '6.20', date: 'Nov 2009', headline: 'Digital Comics', notes: ['Digital Comics reader', 'Clock screen saver'], milestone: true },
  { version: '6.35', date: 'Jan 2010', headline: 'x-Radar & extras', notes: ['x-Radar Portable preloaded in Japan'] },
  { version: '6.37 – 6.39', date: 'Jan – May 2011', headline: 'Lockdown & PSN', notes: ['Patches several kernel exploits', '6.38 adds Qriocity music; 6.39 forces a PSN password reset after the outage'] },
  { version: '6.50', date: '2011', headline: 'PSP Street', notes: ['Builds for the E1000 hardware'] },
  { version: '6.60', date: 'Aug 2011', headline: 'Universal firmware', notes: ['First version for every model at once', 'Removes PlayStation Spot in Japan'], milestone: true },
  { version: '6.61', date: 'Jan 2015', headline: 'The final update', notes: ['Minor security patches — still the firmware every PSP should run'], milestone: true },
];
