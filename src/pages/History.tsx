import { useState } from 'react';
import { ArrowRight, Cpu, Download, Disc3, Briefcase, Terminal, type LucideIcon } from 'lucide-react';
import { Container, PageHero, Reveal, cx } from '../components/ui';
import { ERAS, KIND_LABEL, history, type EventKind } from '../data/history';
import { Link, navigate, useTitle } from '../router';
import { sfx } from '../sound';

const KIND_ICON: Record<EventKind, LucideIcon> = {
  hardware: Cpu,
  software: Download,
  games: Disc3,
  business: Briefcase,
  scene: Terminal,
};

const KIND_HUE: Record<EventKind, string> = {
  hardware: '#5aa9ff',
  software: '#43d5e6',
  games: '#55d68a',
  business: '#ffb547',
  scene: '#a98bff',
};

export function History() {
  useTitle('History');
  const [kinds, setKinds] = useState<EventKind[]>([]);
  const toggle = (k: EventKind) => {
    sfx.toggle();
    setKinds((ks) => (ks.includes(k) ? ks.filter((x) => x !== k) : [...ks, k]));
  };
  const visible = history.filter((e) => kinds.length === 0 || kinds.includes(e.kind));

  return (
    <>
      <PageHero
        kicker="History"
        code="2003 → today"
        title={
          <>
            The life and
            <br />
            afterlife of the PSP.
          </>
        }
        sub="From a surprise announcement before E3 2003 to a handheld that’s still being modded, emulated and collected more than twenty years later."
      />

      <Container>
        {/* era rail */}
        <div className="relative md:sticky md:top-[84px] z-30 mb-10">
          <div className="chrome-rim">
            <div className="panel !rounded-[22px] p-2.5 flex flex-col gap-2">
              <div className="no-scrollbar overflow-x-auto">
                <div className="flex gap-1.5 w-max">
                  {ERAS.map((e) => (
                    <button key={e.id} type="button" className="key !py-2" onClick={() => navigate(`/history#${e.id}`)}>
                      {e.label} <span className="opacity-50 normal-case tracking-normal">{e.range}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="no-scrollbar overflow-x-auto">
                <div className="flex gap-1.5 w-max">
                  {(Object.keys(KIND_LABEL) as EventKind[]).map((k) => {
                    const Icon = KIND_ICON[k];
                    return (
                      <button key={k} type="button" className={cx('key !py-2 !px-2.5', kinds.includes(k) && 'is-on')} onClick={() => toggle(k)} aria-pressed={kinds.includes(k)}>
                        <Icon size={12} style={{ color: KIND_HUE[k] }} /> {KIND_LABEL[k]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* spine */}
          <div
            aria-hidden
            className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-[3px] md:-translate-x-1/2 rounded-full"
            style={{ background: 'linear-gradient(180deg, transparent, rgb(var(--accent-rgb)) 3%, rgb(var(--accent-rgb)) 97%, transparent)', boxShadow: '0 0 16px rgb(var(--accent-rgb) / 0.7)' }}
          />

          {ERAS.map((era) => {
            const evs = visible.filter((e) => e.year >= era.from && e.year <= era.to);
            if (!evs.length) return null;
            return (
              <section key={era.id} id={era.id} className="relative scroll-mt-28 md:scroll-mt-52 pb-6">
                <Reveal>
                  <div className="relative flex md:justify-center pl-10 md:pl-0 py-8">
                    <div className="metal rounded-[14px] px-5 py-3 text-center">
                      <div className="font-psp text-2xl md:text-3xl engraved leading-none">{era.label}</div>
                      <div className="mt-1 font-mono text-[10px] font-bold tracking-[0.18em] text-black/55">{era.range}</div>
                    </div>
                  </div>
                  <p className="pl-10 md:pl-0 md:text-center text-[var(--ink-dim)] -mt-3 mb-6 max-w-xl md:mx-auto">{era.blurb}</p>
                </Reveal>

                <div className="flex flex-col gap-5 md:gap-6">
                  {evs.map((e, i) => {
                    const left = i % 2 === 0;
                    const Icon = KIND_ICON[e.kind];
                    return (
                      <Reveal key={e.title + e.date}>
                        <div className={cx('relative grid md:grid-cols-2 md:gap-14', i > 0 && 'md:-mt-16')}>
                          {/* node */}
                          <span
                            className="absolute left-[16.5px] md:left-1/2 top-6 -translate-x-1/2 w-4 h-4 rounded-full z-10"
                            style={{ background: `radial-gradient(circle at 35% 30%, #fff, ${KIND_HUE[e.kind]} 50%, #000)`, boxShadow: `0 0 0 4px #05070c, 0 0 14px ${KIND_HUE[e.kind]}` }}
                          />
                          <div className={cx('pl-10 md:pl-0', left ? 'md:col-start-1 md:text-right' : 'md:col-start-2')}>
                            <div className={cx(e.big ? 'chrome-rim' : '', 'inline-block w-full')}>
                              <div className={cx(e.big ? 'panel !rounded-[22px]' : 'glass', 'p-5 md:p-6 text-left')}>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="lcd lcd-text px-2 py-0.5 text-lg leading-none !rounded-md">{e.date}</span>
                                  <span className="chip" style={{ color: KIND_HUE[e.kind] }}>
                                    <Icon size={11} /> {KIND_LABEL[e.kind]}
                                  </span>
                                </div>
                                <h3 className={cx('mt-3 font-psp text-white leading-tight', e.big ? 'text-2xl' : 'text-xl')}>{e.title}</h3>
                                <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-dim)]">{e.text}</p>
                                {e.link && (
                                  <Link to={e.link} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--accent-hi)' }}>
                                    Read more <ArrowRight size={14} />
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </Container>
    </>
  );
}
