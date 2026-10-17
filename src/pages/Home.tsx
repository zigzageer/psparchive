import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, Shuffle, Palette, Cpu, GitCompareArrows, Clock, Disc3, Download, Terminal, BookOpen } from 'lucide-react';
import { PSPDevice } from '../components/PSPDevice';
import { Container, LCDStat, Reveal, SectionHeader, cx, Panel } from '../components/ui';
import { ColorCard, Swatch } from '../components/ColorCard';
import { Link, useTitle } from '../router';
import { colorways, hashOf, stats } from '../lib/catalog';
import { models } from '../data/models';
import { games } from '../data/games';
import { history } from '../data/history';
import { mix } from '../theme';

const TICKER = [
  'PSP-1000 launched in Japan on 12 Dec 2004 for ¥19,800',
  'UMD discs are 60 mm across and hold up to 1.8 GB',
  'The CPU was capped at 222 MHz until firmware 3.50 unlocked 333 MHz',
  'GTA: Liberty City Stories is the best-selling PSP game',
  'The PSP Go has 16 GB of storage and no disc drive',
  'Firmware 6.61 (Jan 2015) was the final system update',
  'PSP games are region-free — UMD Video is not',
  'The XMB menu later shipped on the PS3 and Sony TVs',
  'PSP Street (E1000) launched at €99.99 with no Wi-Fi',
  'The PSP-2000 is 33% lighter than the original',
];

const TRIVIA = [
  { q: 'Why does the PSP-3000 screen have lines?', a: 'Its new, wider-gamut LCD shows faint horizontal scanlines — a quirk of the panel, not the games.' },
  { q: 'What’s the famous PSP error code?', a: '80020148 — “The game could not be started.” Every homebrew veteran has seen it.' },
  { q: 'Can a PSP play PS1 games?', a: 'Yes. Firmware 3.00 added PSone Classics, downloadable from the PlayStation Store.' },
  { q: 'Did the PSP have a camera?', a: 'Several. A 1.3 MP camera arrived in 2006 and the Go!Cam in 2009, both clipping onto the top port.' },
  { q: 'What was Remote Play?', a: 'Stream your PS3’s menu — and some games — to the PSP over Wi-Fi, years before PS Remote Play on phones.' },
  { q: 'How many PSPs were sold?', a: 'Sony reported 76.4 million by March 2012; lifetime estimates exceed 80 million.' },
  { q: 'What does XMB stand for?', a: 'XrossMediaBar — the cross-shaped menu of categories and items that Sony later carried over to the PS3 and its TVs.' },
];

const CHANNELS = [
  { to: '/colors', label: 'Colour Archive', icon: Palette, hue: '#ff6fb5', text: `${stats.colorways} finishes with front & back photography.` },
  { to: '/models', label: 'Hardware', icon: Cpu, hue: '#5aa9ff', text: 'Full spec sheets, motherboards and revisions.' },
  { to: '/compare', label: 'Compare', icon: GitCompareArrows, hue: '#f5c542', text: 'Side-by-side specs, to-scale silhouettes.' },
  { to: '/history', label: 'History', icon: Clock, hue: '#ffb547', text: 'From the 2003 reveal to the afterlife.' },
  { to: '/games', label: 'Games', icon: Disc3, hue: '#55d68a', text: `${games.length} essential UMDs, filterable by genre.` },
  { to: '/firmware', label: 'Firmware', icon: Download, hue: '#43d5e6', text: 'Every big system update, 1.00 → 6.61.' },
  { to: '/homebrew', label: 'Homebrew', icon: Terminal, hue: '#a98bff', text: 'Exploits, custom firmware and emulation.' },
  { to: '/guide', label: 'Buyer’s Guide', icon: BookOpen, hue: '#ff7a59', text: 'What to buy, what to check, model decoder.' },
];

function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="relative z-10 border-y border-black/60" style={{ boxShadow: '0 1px 0 rgb(255 255 255 / 0.06) inset, 0 -1px 0 rgb(255 255 255 / 0.06)' }}>
      <div className="lcd !rounded-none py-2.5 overflow-hidden">
        <div className="marquee flex w-max gap-10 whitespace-nowrap">
          {items.map((t, i) => (
            <span key={i} className="lcd-text text-xl leading-none flex items-center gap-10">
              {t}
              <span className="text-[rgb(var(--accent-rgb))] opacity-80">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-28 md:pt-32 pb-12 md:pb-16 overflow-hidden">
      {/* giant outlined backdrop text */}
      <div aria-hidden className="pointer-events-none absolute left-0 right-0 top-[52%] -translate-y-1/2 overflow-hidden select-none">
        <div className="marquee flex w-max" style={{ animationDuration: '90s' }}>
          {[0, 1].map((k) => (
            <span
              key={k}
              className="font-psp whitespace-nowrap pr-[6vw] text-[19vw] leading-none"
              style={{ color: 'transparent', WebkitTextStroke: '1px rgb(255 255 255 / 0.07)' }}
            >
              PLAYSTATION PORTABLE
            </span>
          ))}
        </div>
      </div>

      <Container className="relative">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="lcd lcd-text px-2 py-0.5 text-lg leading-none !rounded-md">v2.0</span>
            <span className="label !text-[11px]" style={{ color: 'var(--accent-hi)' }}>
              The PlayStation Portable, catalogued
            </span>
          </div>
          <h1 className="font-psp chrome-text text-[2.5rem] leading-[1] sm:text-6xl lg:text-[4.6rem] pb-2 text-balance">
            Every PSP. Every colour.
            <br />
            <span className="accent-text" style={{ filter: 'drop-shadow(0 0 30px rgb(var(--accent-rgb) / 0.45))' }}>
              Every detail.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] md:text-lg leading-relaxed text-[var(--ink-dim)]">
            {stats.colorways} colourways, five generations, {games.length} essential games and twenty years of history — one obsessively detailed archive.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative mx-auto mt-10 md:mt-14 w-[calc(100%+1.5rem)] -mx-3 sm:mx-auto sm:w-full max-w-[1000px]"
        >
          <div className="float">
            <PSPDevice />
          </div>
          <div
            aria-hidden
            className="absolute left-1/2 -bottom-10 h-16 w-[80%] -translate-x-1/2 rounded-[50%] blur-2xl"
            style={{ background: 'radial-gradient(ellipse, rgb(var(--accent-rgb) / 0.45), transparent 70%)' }}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-14 flex flex-col items-center gap-6">
          <div className="hidden sm:flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--ink-faint)]">
            <span className="key !py-1 !px-2 !text-[10px]">←</span>
            <span className="key !py-1 !px-2 !text-[10px]">→</span>
            <span className="key !py-1 !px-2 !text-[10px]">↑</span>
            <span className="key !py-1 !px-2 !text-[10px]">↓</span>
            <span className="ml-1 mr-3">browse the XMB</span>
            <span className="key !py-1 !px-2 !text-[10px]">Enter</span>
            <span className="ml-1">open · click the screen, d-pad or drag the nub</span>
          </div>
          <div className="sm:hidden text-xs text-[var(--ink-faint)]">Swipe the screen or tap the d-pad to browse</div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/colors" className="gel">
              Browse {stats.colorways} colourways <ArrowRight size={16} />
            </Link>
            <Link to="/models" className="gel gel-chrome">
              Explore the hardware
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function Stats() {
  return (
    <Container className="relative z-10 -mt-2">
      <div className="chrome-rim">
        <div className="panel !rounded-[22px] p-3 md:p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <LCDStat value="76.4M" ghost="88.8M" label="Sold by Mar 2012" />
          <LCDStat value="5" label="Hardware families" />
          <LCDStat value={String(stats.colorways)} label="Colourways archived" />
          <LCDStat value="1370" ghost="8888" label="Games released" />
          <LCDStat value="333" label="MHz top CPU speed" />
          <LCDStat value="6.61" ghost="8.88" label="Final firmware" />
        </div>
      </div>
    </Container>
  );
}

function Lineup() {
  const maxW = Math.max(...models.map((m) => m.dims.w));
  return (
    <section className="relative z-10 mt-24 md:mt-32">
      <Container>
        <Reveal>
          <SectionHeader
            index="01"
            kicker="The line-up"
            title="Five generations, to scale."
            sub="From the 280 g original to the pocketable Go. Every model shown at its real relative width — tap one for the full spec sheet."
            action={
              <Link to="/compare" className="gel gel-black gel-sm shrink-0">
                Compare specs <GitCompareArrows size={14} />
              </Link>
            }
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative glass px-3 md:px-8 pt-10 pb-6 overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-10 items-end">
              {models.map((m, i) => {
                const img = colorways.find((c) => c.model.id === m.id && c.slug === m.heroColor)?.front;
                return (
                  <Link key={m.id} to={`/models/${m.id}`} className={cx('group flex flex-col items-center', i === 4 && 'col-span-2 md:col-span-1')}>
                    <div className={cx('relative w-full flex items-end justify-center h-[110px] sm:h-[140px] md:h-[120px] lg:h-[150px]', i === 4 && 'max-w-[50%] md:max-w-none')}>
                      <img
                        src={img}
                        alt={m.name}
                        loading="lazy"
                        className="reflect object-contain transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-[1.04]"
                        style={{ width: `${(m.dims.w / maxW) * 100}%`, filter: 'drop-shadow(0 12px 14px rgb(0 0 0 / 0.6))' }}
                      />
                    </div>
                    <div className="mt-10 text-center">
                      <div className="font-psp text-white text-lg leading-none group-hover:text-[var(--accent-hi)] transition-colors">{m.name}</div>
                      <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                        {m.years.split('–')[0].trim()} · {m.weight} g
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {/* glass shelf */}
            <div className="hidden md:block pointer-events-none absolute inset-x-0 top-[57%] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Channels() {
  return (
    <section className="relative z-10 mt-24 md:mt-32">
      <Container>
        <Reveal>
          <SectionHeader index="02" kicker="Channels" title="Pick a channel." sub="Everything in the archive, one tap away." />
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {CHANNELS.map((c, i) => (
            <Reveal key={c.to} delay={i * 0.04}>
              <Link to={c.to} className="group block h-full">
                <Panel className="h-full p-4 md:p-5 transition-transform duration-300 group-hover:-translate-y-1">
                  <span
                    className="app-icon w-12 h-12 md:w-14 md:h-14 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                    style={{ ['--ic' as string]: c.hue, ['--ic-hi' as string]: mix(c.hue, '#ffffff', 0.45), ['--ic-lo' as string]: mix(c.hue, '#000000', 0.45) }}
                  >
                    <c.icon size={24} strokeWidth={2.2} />
                  </span>
                  <div className="mt-4 font-psp text-white text-lg md:text-xl leading-tight flex items-center gap-2">
                    {c.label}
                    <ArrowRight size={16} className="opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  </div>
                  <p className="mt-1.5 text-[13px] leading-snug text-[var(--ink-dim)]">{c.text}</p>
                </Panel>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Spotlight() {
  const daily = useMemo(() => {
    const d = new Date();
    return hashOf(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`) % colorways.length;
  }, []);
  const [idx, setIdx] = useState(daily);
  const cw = colorways[idx];
  const shuffle = () => {
    let n = idx;
    while (n === idx) n = Math.floor(Math.random() * colorways.length);
    setIdx(n);
  };

  return (
    <section className="relative z-10 mt-24 md:mt-32">
      <Container>
        <Reveal>
          <SectionHeader
            index="03"
            kicker={idx === daily ? 'Colourway of the day' : 'Spotlight'}
            title="On the turntable."
            action={
              <button type="button" onClick={shuffle} className="gel gel-sm shrink-0">
                <Shuffle size={14} /> Shuffle
              </button>
            }
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="chrome-rim">
            <div className="panel !rounded-[22px] grid md:grid-cols-[1.35fr_1fr] overflow-hidden">
              <div
                className="relative aspect-[16/10] md:aspect-auto md:min-h-[400px] pinstripe"
                style={{ background: `radial-gradient(60% 55% at 50% 60%, ${cw.color.hex}55, transparent 70%)` }}
              >
                <div className="stage-floor !h-[22%] !bottom-[6%]" style={{ background: `radial-gradient(ellipse, ${cw.color.hex}88, transparent 70%)` }} />
                <AnimatePresence mode="wait">
                  <motion.img
                    key={cw.key}
                    src={cw.front}
                    alt={cw.color.name}
                    initial={{ opacity: 0, rotateY: -35, scale: 0.92 }}
                    animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                    exit={{ opacity: 0, rotateY: 35, scale: 0.92 }}
                    transition={{ duration: 0.45 }}
                    className="reflect absolute inset-x-[8%] top-[10%] h-[68%] w-[84%] object-contain"
                    style={{ filter: 'drop-shadow(0 20px 26px rgb(0 0 0 / 0.6))' }}
                  />
                </AnimatePresence>
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/[0.07]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip chip-accent">{cw.model.name}</span>
                  <span className="chip">{cw.model.year}</span>
                  {cw.color.type === 'limited' && <span className="holo">Limited</span>}
                </div>
                <h3 className="mt-4 font-psp chrome-text text-3xl md:text-4xl leading-[1.05]">{cw.color.name}</h3>
                <p className="mt-3 text-[var(--ink-dim)] leading-relaxed">{cw.color.description}</p>
                <div className="mt-5 flex items-center gap-3">
                  <Swatch hex={cw.color.hex} size={28} />
                  <span className="lcd lcd-text px-2.5 py-1 text-xl leading-none !rounded-md">{cw.color.hex.toUpperCase()}</span>
                </div>
                <div className="mt-6">
                  <Link to={`/colors/${cw.model.id}/${cw.slug}`} className="gel gel-chrome gel-sm">
                    Open in the archive <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Limited() {
  const items = colorways.filter((c) => c.color.type === 'limited');
  return (
    <section className="relative z-10 mt-24 md:mt-32">
      <Container>
        <Reveal>
          <SectionHeader
            index="04"
            kicker={`${items.length} limited editions`}
            title="The rare ones."
            sub="Game bundles, anime collabs, a Coca-Cola promo and hand-crafted Signature Models. Swipe the shelf."
            action={
              <Link to="/colors?type=limited" className="gel gel-black gel-sm shrink-0">
                All limited <ArrowRight size={14} />
              </Link>
            }
          />
        </Reveal>
      </Container>
      <div className="no-scrollbar overflow-x-auto">
        <div className="flex gap-4 shelf-pad pb-6 w-max">
          {items.map((cw) => (
            <div key={cw.key} className="w-[260px] md:w-[300px] shrink-0">
              <ColorCard cw={cw} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineTeaser() {
  const big = history.filter((e) => e.big && e.kind === 'hardware');
  return (
    <section className="relative z-10 mt-24 md:mt-32">
      <Container>
        <Reveal>
          <SectionHeader
            index="05"
            kicker="Timeline"
            title="Twenty years in eight stops."
            action={
              <Link to="/history" className="gel gel-black gel-sm shrink-0">
                Full history <ArrowRight size={14} />
              </Link>
            }
          />
        </Reveal>
      </Container>
      <div className="no-scrollbar overflow-x-auto">
        <div className="relative flex w-max gap-4 shelf-pad pb-4 pt-8">
          <div className="absolute left-0 right-0 top-[38px] h-[3px] rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--accent-rgb)) 8%, rgb(var(--accent-rgb)) 92%, transparent)', boxShadow: '0 0 14px rgb(var(--accent-rgb) / 0.8)' }} />
          {big.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.05}>
              <Link to={e.link ?? '/history'} className="group relative block w-[240px] md:w-[270px] pt-10">
                <span className="absolute left-5 top-[-1px] w-5 h-5 rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, #fff, var(--accent) 50%, var(--accent-lo))', boxShadow: '0 0 0 4px #05070c, 0 0 16px rgb(var(--accent-rgb))' }} />
                <Panel className="p-5 h-full transition-transform group-hover:-translate-y-1">
                  <div className="lcd lcd-text inline-block px-2 py-0.5 text-lg leading-none !rounded-md">{e.date}</div>
                  <div className="mt-3 font-psp text-white text-lg leading-tight">{e.title}</div>
                  <p className="mt-2 text-[13px] leading-snug text-[var(--ink-dim)] line-clamp-3">{e.text}</p>
                </Panel>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trivia() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % TRIVIA.length), 7000);
    return () => clearInterval(t);
  }, [i]);
  const t = TRIVIA[i];
  return (
    <section className="relative z-10 mt-24 md:mt-32">
      <Container>
        <Reveal>
          <div className="chrome-rim max-w-4xl mx-auto">
            <div className="lcd !rounded-[22px] px-6 py-8 md:px-12 md:py-12">
              <div className="flex items-center justify-between gap-4">
                <span className="lcd-text text-xl">DID YOU KNOW? {String(i + 1).padStart(2, '0')}/{String(TRIVIA.length).padStart(2, '0')}</span>
                <div className="flex gap-2 relative z-10">
                  <button type="button" className="key !px-2 !py-1.5" aria-label="Previous fact" onClick={() => setI((n) => (n - 1 + TRIVIA.length) % TRIVIA.length)}>
                    <ChevronLeft size={14} />
                  </button>
                  <button type="button" className="key !px-2 !py-1.5" aria-label="Next fact" onClick={() => setI((n) => (n + 1) % TRIVIA.length)}>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                  <p className="lcd-text mt-6 text-3xl md:text-4xl leading-[1.05]">&gt; {t.q}</p>
                  <p className="lcd-text mt-4 text-xl md:text-2xl leading-snug opacity-80">{t.a}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function Home() {
  useTitle('');
  return (
    <>
      <Hero />
      <Ticker />
      <div className="mt-10 md:mt-14">
        <Stats />
      </div>
      <Lineup />
      <Channels />
      <Spotlight />
      <Limited />
      <TimelineTeaser />
      <Trivia />
    </>
  );
}
