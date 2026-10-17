import { useState } from 'react';
import { Star } from 'lucide-react';
import { Container, PageHero, Reveal, Screws, cx } from '../components/ui';
import { firmware } from '../data/firmware';
import { useTitle } from '../router';
import { sfx } from '../sound';

export function Firmware() {
  useTitle('Firmware history');
  const [milestones, setMilestones] = useState(false);
  const list = firmware.filter((f) => !milestones || f.milestone);

  // releases per year for the bar strip
  const years = Array.from({ length: 12 }, (_, i) => 2004 + i);
  const perYear = years.map((y) => firmware.filter((f) => f.date.includes(String(y)) || (y === 2005 && f.date === 'mid 2005')).length);
  const maxPer = Math.max(...perYear);

  return (
    <>
      <PageHero
        kicker="System software"
        code="1.00 → 6.61"
        title={
          <>
            System
            <br />
            updates.
          </>
        }
        sub="Ten years of firmware turned a game console into a web browser, podcast player, Skype phone, comic reader and PlayStation Store — then locked it all down."
      />

      <Container>
        {/* System update screen */}
        <Reveal>
          <div className="chrome-rim max-w-4xl">
            <div className="panel !rounded-[22px] p-4 md:p-5">
              <Screws inset={12} />
              <div className="lcd p-5 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="lcd-text text-lg opacity-60 leading-none">SYSTEM UPDATE</div>
                    <div className="lcd-text text-4xl md:text-6xl leading-none mt-2">VER 6.61</div>
                  </div>
                  <div className="text-right">
                    <div className="lcd-text text-lg opacity-60 leading-none">RELEASED</div>
                    <div className="lcd-text text-2xl md:text-3xl leading-none mt-2">15 JAN 2015</div>
                  </div>
                </div>
                <div className="mt-6 h-5 rounded-[4px] p-[3px]" style={{ boxShadow: 'inset 0 0 0 1px rgb(166 246 255 / 0.5)' }}>
                  <div className="h-full w-full rounded-[2px] flex gap-[3px]">
                    {Array.from({ length: 40 }, (_, i) => (
                      <span key={i} className="flex-1 bg-[var(--lcd-ink)]" style={{ boxShadow: '0 0 6px rgb(166 246 255 / 0.6)' }} />
                    ))}
                  </div>
                </div>
                <div className="mt-3 flex justify-between">
                  <span className="lcd-text text-lg">UPDATE COMPLETE</span>
                  <span className="lcd-text text-lg opacity-70">100%</span>
                </div>
                <p className="lcd-text text-lg opacity-70 mt-3 leading-snug">No newer system software will ever be released. 6.61 is the version to run — every modern CFW is built on it.</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* release density */}
        <Reveal>
          <div className="mt-10 glass p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="label">Notable releases per year</span>
              <span className="label hidden sm:inline">2004 – 2015</span>
            </div>
            <div className="flex items-end gap-1.5 md:gap-3 h-28">
              {years.map((y, i) => (
                <div key={y} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex flex-col-reverse gap-[3px]">
                    {Array.from({ length: maxPer }, (_, k) => (
                      <span
                        key={k}
                        className="h-[10px] w-full rounded-[2px]"
                        style={k < perYear[i] ? { background: 'linear-gradient(180deg, var(--accent-hi), var(--accent))', boxShadow: '0 0 8px rgb(var(--accent-rgb) / 0.6)' } : { background: '#14171d', boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 0.9)' }}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[9px] md:text-[10px] text-[var(--ink-faint)]">{String(y).slice(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-12 flex items-center justify-between gap-4 mb-6">
          <h2 className="font-psp chrome-text text-3xl md:text-4xl">Changelog</h2>
          <button type="button" className={cx('key !py-2', milestones && 'is-on')} onClick={() => { sfx.toggle(); setMilestones((m) => !m); }} aria-pressed={milestones}>
            <Star size={12} /> Milestones only
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {list.map((f, i) => (
            <Reveal key={f.version} delay={Math.min(i * 0.02, 0.2)}>
              <div className={cx('grid grid-cols-[92px_1fr] md:grid-cols-[150px_130px_1fr] gap-4 items-start p-4 md:p-5', f.milestone ? 'panel' : 'glass')}>
                <div className="lcd px-2.5 py-2 text-center !rounded-[10px]">
                  <div className="lcd-text text-2xl md:text-3xl leading-none whitespace-nowrap">{f.version.split(' ')[0]}</div>
                  {f.version.includes('–') && <div className="lcd-text text-sm opacity-60 leading-none mt-1">{f.version.split('–')[1].trim()}</div>}
                </div>
                <div className="hidden md:block pt-1.5 font-mono text-xs uppercase tracking-[0.14em] text-[var(--ink-faint)]">{f.date}</div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-psp text-white text-lg leading-tight">{f.headline}</h3>
                    {f.milestone && (
                      <span className="chip chip-accent !text-[9px]">
                        <Star size={9} /> Milestone
                      </span>
                    )}
                    <span className="md:hidden font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">{f.date}</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-[var(--ink-dim)]">
                    {f.notes.map((n) => (
                      <li key={n} className="flex gap-2">
                        <span className="text-[var(--accent-hi)]">›</span>
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-xs text-[var(--ink-faint)] max-w-2xl">
          Dates are first public release (usually Japan). Minor security-only builds are folded into the nearest notable version.
        </p>
      </Container>
    </>
  );
}
