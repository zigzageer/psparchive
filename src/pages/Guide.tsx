import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, ChevronDown, RotateCcw } from 'lucide-react';
import { Container, PageHero, Panel, Reveal, SectionHeader, cx } from '../components/ui';
import { REGIONS, RATING_LABELS, models } from '../data/models';
import { careTips, checklist, faq } from '../data/guide';
import { heroImage } from '../lib/catalog';
import { Link, useTitle } from '../router';
import { sfx } from '../sound';

const BEST_FOR: Record<string, string> = {
  'psp-1000': 'Collectors & battery life',
  'psp-2000': 'Homebrew & TV play',
  'psp-3000': 'Best screen & colours',
  'psp-go': 'Pocketability',
  'psp-street': 'Cheap UMD player',
};

const SERIES: { prefix: RegExp; id: string }[] = [
  { prefix: /^1(\d{3})$/, id: 'psp-1000' },
  { prefix: /^2(\d{3})$/, id: 'psp-2000' },
  { prefix: /^3(\d{3})$/, id: 'psp-3000' },
  { prefix: /^N1(\d{3})$/, id: 'psp-go' },
  { prefix: /^E1(\d{3})$/, id: 'psp-street' },
];

function decode(input: string) {
  const clean = input.toUpperCase().replace(/[\s-]+/g, '').replace(/^PSP/, '');
  const core = clean.match(/^([NE]?\d{4})/)?.[1];
  if (!core) return null;
  for (const s of SERIES) {
    const m = core.match(s.prefix);
    if (m) {
      const digits = m[1].slice(-2);
      const region = REGIONS.find((r) => r.code === digits);
      const model = models.find((x) => x.id === s.id)!;
      return { model, region, code: core };
    }
  }
  return null;
}

const STORE = 'psparchive:checklist';

function useChecklist() {
  const [done, setDone] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORE) ?? '[]');
    } catch {
      return [];
    }
  });
  const save = (v: string[]) => {
    setDone(v);
    try {
      localStorage.setItem(STORE, JSON.stringify(v));
    } catch {
      /* storage unavailable */
    }
  };
  return { done, toggle: (id: string) => save(done.includes(id) ? done.filter((x) => x !== id) : [...done, id]), reset: () => save([]) };
}

function Decoder() {
  const [v, setV] = useState('PSP-3004');
  const r = useMemo(() => decode(v), [v]);
  const examples = ['PSP-1001', 'PSP-2004', 'PSP-3000', 'PSP-N1003', 'PSP-E1004'];
  return (
    <div className="chrome-rim">
      <div className="panel !rounded-[22px] p-5 md:p-7 grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="decoder-input" className="label">
            Model number (on the label under the battery or on the back)
          </label>
          <input id="decoder-input" className="lcd-input mt-3 !text-3xl uppercase" value={v} onChange={(e) => setV(e.target.value)} spellCheck={false} autoComplete="off" />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {examples.map((e) => (
              <button key={e} type="button" className="key !py-1 !px-2 !text-[10px]" onClick={() => { sfx.toggle(); setV(e); }}>
                {e}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[var(--ink-faint)]">
            The last two digits are the region. A two-letter suffix (e.g. PSP-3004 PB) is the colour code. Region only matters for the bundled charger, UMD Video and the default PSN store — games are region-free.
          </p>
        </div>
        <div className="lcd p-5 min-h-[220px] flex flex-col">
          <AnimatePresence mode="wait">
            {r ? (
              <motion.div key={r.code} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
                <div className="lcd-text text-lg opacity-60 leading-none">DECODED</div>
                <div className="lcd-text text-5xl leading-none mt-2">{r.model.name}</div>
                <div className="lcd-text text-xl opacity-80 mt-1">{r.model.nickname.toUpperCase()}</div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <div className="lcd-text text-sm opacity-55 leading-none">REGION</div>
                    <div className="lcd-text text-xl leading-tight">{r.region ? r.region.region.toUpperCase() : 'UNKNOWN'}</div>
                  </div>
                  <div>
                    <div className="lcd-text text-sm opacity-55 leading-none">RELEASED</div>
                    <div className="lcd-text text-xl leading-tight">{r.model.years.toUpperCase()}</div>
                  </div>
                </div>
                <div className="mt-auto pt-4 relative z-10">
                  <Link to={`/models/${r.model.id}`} className="inline-flex items-center gap-1.5 lcd-text text-lg underline underline-offset-4">
                    VIEW SPEC SHEET <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="lcd-text text-lg opacity-60 leading-none">ERROR 80020148</div>
                <div className="lcd-text text-3xl leading-tight mt-2">UNKNOWN MODEL NUMBER</div>
                <p className="lcd-text text-lg opacity-70 mt-3">Try a format like PSP-3004, PSP-N1001 or PSP-E1004.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function Guide() {
  useTitle('Buyer’s guide');
  const { done, toggle, reset } = useChecklist();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const groups = [...new Set(checklist.map((c) => c.group))];
  const pct = Math.round((done.filter((d) => checklist.some((c) => c.id === d)).length / checklist.length) * 100);

  return (
    <>
      <PageHero
        kicker="Buyer’s & collector’s guide"
        code="2026 edition"
        title={
          <>
            Buying a PSP
            <br />
            in 2026.
          </>
        }
        sub="Prices have climbed, batteries have aged, and fakes are everywhere. Here’s how to pick the right model, check a used one, and keep it alive."
      >
        <div className="flex flex-wrap gap-2">
          <Link to="/guide#decoder" className="gel gel-sm">
            Model decoder
          </Link>
          <Link to="/guide#checklist" className="gel gel-chrome gel-sm">
            Inspection checklist
          </Link>
          <Link to="/guide#faq" className="gel gel-black gel-sm">
            FAQ
          </Link>
        </div>
      </PageHero>

      <Container>
        {/* which one */}
        <section>
          <Reveal>
            <SectionHeader index="01" kicker="Which one?" title="Pick your PSP." />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {models.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.05}>
                <Link to={`/models/${m.id}`} className="group block h-full">
                  <Panel className="p-4 h-full flex flex-col">
                    <div className="relative h-24 flex items-center justify-center">
                      <img src={heroImage(m.id, m.heroColor)} alt="" loading="lazy" className="max-h-full w-auto object-contain transition-transform group-hover:-translate-y-1" style={{ filter: 'drop-shadow(0 10px 12px rgb(0 0 0 / 0.6))' }} />
                    </div>
                    <div className="mt-3 font-psp text-white text-lg leading-none">{m.name}</div>
                    <div className="mt-2 chip chip-accent !text-[9px] self-start">{BEST_FOR[m.id]}</div>
                    <div className="mt-4 space-y-2">
                      {(Object.keys(m.ratings) as (keyof typeof m.ratings)[]).map((k) => (
                        <div key={k} className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">{RATING_LABELS[k]}</span>
                          <div className="flex gap-[2px]">
                            {Array.from({ length: 5 }, (_, j) => (
                              <span key={j} className="w-2.5 h-1.5 rounded-[2px]" style={j < m.ratings[k] ? { background: 'var(--accent)', boxShadow: '0 0 5px rgb(var(--accent-rgb) / 0.8)' } : { background: '#1a1d23' }} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Panel>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-5 glass p-5 md:p-6 grid md:grid-cols-[auto_1fr] gap-4 items-center">
              <span className="lcd lcd-text px-3 py-1 text-2xl leading-none !rounded-md self-start">VERDICT</span>
              <p className="text-[15px] leading-relaxed text-[var(--ink-dim)]">
                For most people: a <b className="text-white">PSP-3000</b> if you want the most vivid screen, or a <b className="text-white">PSP-2000</b> if scanlines bother you or you plan to play on a TV. Get a <b className="text-white">Go</b> only if you love the form factor — and budget for M2 storage.
              </p>
            </div>
          </Reveal>
        </section>

        {/* decoder */}
        <section id="decoder" className="mt-24 scroll-mt-28">
          <Reveal>
            <SectionHeader index="02" kicker="Model decoder" title="What’s that number?" sub="Every PSP has a model number like PSP-3004. Type yours to decode its family and region." />
          </Reveal>
          <Reveal>
            <Decoder />
          </Reveal>
        </section>

        {/* checklist */}
        <section id="checklist" className="mt-24 scroll-mt-28">
          <Reveal>
            <SectionHeader
              index="03"
              kicker="Inspection checklist"
              title="Before you hand over cash."
              sub="Tick items off as you inspect a used console. Progress is saved in this browser."
              action={
                <div className="flex items-center gap-3 shrink-0">
                  <div className="lcd px-3 py-1.5 !rounded-[10px]">
                    <span className="lcd-text text-2xl leading-none">{String(pct).padStart(3, ' ')}%</span>
                  </div>
                  <button type="button" className="key !py-2" onClick={reset}>
                    <RotateCcw size={12} /> Reset
                  </button>
                </div>
              }
            />
          </Reveal>
          <div className="h-2 rounded-full well overflow-hidden mb-6">
            <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--accent-lo), var(--accent), var(--accent-hi))', boxShadow: '0 0 12px rgb(var(--accent-rgb))' }} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {groups.map((g) => (
              <Reveal key={g}>
                <Panel className="p-5 h-full">
                  <div className="label mb-3" style={{ color: 'var(--accent-hi)' }}>
                    {g}
                  </div>
                  <ul className="space-y-2">
                    {checklist
                      .filter((c) => c.group === g)
                      .map((c) => {
                        const on = done.includes(c.id);
                        return (
                          <li key={c.id}>
                            <button
                              type="button"
                              onClick={() => {
                                sfx.toggle();
                                toggle(c.id);
                              }}
                              className="w-full text-left flex gap-3 items-start rounded-[12px] p-2.5 -mx-1 hover:bg-white/[0.03] transition-colors"
                              aria-pressed={on}
                            >
                              <span
                                className={cx('mt-0.5 w-5 h-5 rounded-[6px] grid place-items-center shrink-0 transition-all')}
                                style={
                                  on
                                    ? { background: 'linear-gradient(180deg, var(--accent-hi), var(--accent))', boxShadow: '0 0 10px rgb(var(--accent-rgb) / 0.8), inset 0 1px 0 rgb(255 255 255 / 0.6)' }
                                    : { background: '#0a0b0f', boxShadow: 'inset 0 2px 4px rgb(0 0 0 / 0.9), 0 1px 0 rgb(255 255 255 / 0.08)' }
                                }
                              >
                                {on && <Check size={13} strokeWidth={3} className="text-white" />}
                              </span>
                              <span>
                                <span className={cx('block text-[15px] font-medium', on ? 'text-white' : 'text-white/85')}>{c.item}</span>
                                <span className="block text-[13px] leading-snug text-[var(--ink-faint)] mt-0.5">{c.why}</span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                </Panel>
              </Reveal>
            ))}
          </div>
        </section>

        {/* care */}
        <section className="mt-24">
          <Reveal>
            <SectionHeader index="04" kicker="Care & feeding" title="Keep it alive." />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {careTips.map((t, i) => (
              <Reveal key={t.title} delay={(i % 3) * 0.05}>
                <div className="glass p-5 h-full">
                  <h3 className="font-psp text-white text-lg">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-dim)]">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* regions */}
        <section className="mt-24">
          <Reveal>
            <SectionHeader index="05" kicker="Region codes" title="The last two digits." />
          </Reveal>
          <Reveal>
            <div className="lcd p-5 md:p-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
              {REGIONS.map((r) => (
                <div key={r.code} className="flex items-baseline gap-4 border-b border-dashed border-[rgb(166_246_255/0.15)] py-2">
                  <span className="lcd-text text-3xl leading-none w-10">{r.code}</span>
                  <span className="lcd-text text-xl leading-none opacity-80">{r.region.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* faq */}
        <section id="faq" className="mt-24 scroll-mt-28">
          <Reveal>
            <SectionHeader index="06" kicker="FAQ" title="Questions people ask." />
          </Reveal>
          <div className="flex flex-col gap-3 max-w-4xl">
            {faq.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className={cx(open ? 'chrome-rim' : '')}>
                  <div className={cx(open ? 'panel !rounded-[22px]' : 'glass')}>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                      onClick={() => {
                        sfx.toggle();
                        setOpenFaq(open ? null : i);
                      }}
                      aria-expanded={open}
                    >
                      <span className="font-psp text-white text-base md:text-lg leading-snug">{f.q}</span>
                      <ChevronDown size={18} className={cx('shrink-0 transition-transform text-[var(--ink-dim)]', open && 'rotate-180')} />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                          <p className="px-5 pb-5 text-[15px] leading-relaxed text-[var(--ink-dim)]">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </Container>
    </>
  );
}
