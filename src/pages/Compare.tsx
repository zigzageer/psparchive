import { useMemo, useState } from 'react';
import { Container, PageHero, Panel, Reveal, cx } from '../components/ui';
import { SPEC_ROWS, models } from '../data/models';
import { heroImage } from '../lib/catalog';
import { Link, useTitle } from '../router';
import { sfx } from '../sound';

const LINE_COLORS = ['#ffb547', '#5aa9ff', '#55d68a', '#ff6fb5', '#a98bff'];

export function Compare() {
  useTitle('Compare models');
  const [picked, setPicked] = useState<string[]>(['psp-1000', 'psp-2000', 'psp-3000', 'psp-go', 'psp-street']);
  const [diffOnly, setDiffOnly] = useState(false);

  const sel = models.filter((m) => picked.includes(m.id));
  const toggle = (id: string) => {
    sfx.toggle();
    setPicked((p) => (p.includes(id) ? (p.length > 1 ? p.filter((x) => x !== id) : p) : [...p, id]));
  };

  const rows = useMemo(
    () => SPEC_ROWS.filter((r) => !diffOnly || new Set(sel.map((m) => m.specs[r.key])).size > 1),
    [diffOnly, sel],
  );

  const maxW = Math.max(...models.map((m) => m.dims.w));
  const maxWeight = Math.max(...models.map((m) => m.weight));
  const svgW = 480;
  const scale = (svgW - 40) / maxW;

  return (
    <>
      <PageHero
        kicker="Compare"
        code="Side by side"
        title={
          <>
            Which PSP
            <br />
            is which?
          </>
        }
        sub="Pick the models to compare. Rows where the models differ are highlighted; the silhouettes and bars below are drawn to scale."
      />
      <Container>
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between mb-6">
          <div className="no-scrollbar overflow-x-auto">
            <div className="flex gap-1.5 well p-1 w-max">
              {models.map((m) => (
                <button key={m.id} type="button" className={cx('key !py-2', picked.includes(m.id) && 'is-on')} onClick={() => toggle(m.id)} aria-pressed={picked.includes(m.id)}>
                  {m.name}
                </button>
              ))}
            </div>
          </div>
          <button type="button" className={cx('key !py-2 self-start', diffOnly && 'is-on')} onClick={() => { sfx.toggle(); setDiffOnly((d) => !d); }} aria-pressed={diffOnly}>
            <span className={cx('led', !diffOnly && 'led-off')} /> Differences only
          </button>
        </div>

        {/* table */}
        <div className="chrome-rim">
          <div className="panel !rounded-[22px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 bg-[#121419] text-left px-4 py-4 w-[150px]">
                      <span className="label">Spec</span>
                    </th>
                    {sel.map((m) => (
                      <th key={m.id} className="px-4 py-4 text-left align-bottom min-w-[170px]">
                        <Link to={`/models/${m.id}`} className="group block">
                          <img src={heroImage(m.id, m.heroColor)} alt="" className="h-14 w-auto object-contain mb-2 transition-transform group-hover:-translate-y-0.5" style={{ filter: 'drop-shadow(0 6px 8px rgb(0 0 0 / 0.6))' }} />
                          <div className="font-psp text-white text-base leading-none">{m.name}</div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)] mt-1">{m.nickname.split('·')[0]}</div>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const vals = sel.map((m) => m.specs[r.key]);
                    const differs = new Set(vals).size > 1;
                    return (
                      <tr key={r.key} className="border-t border-white/[0.06]">
                        <th scope="row" className="sticky left-0 z-10 bg-[#101216] text-left font-normal px-4 py-3 align-top">
                          <div className="text-[var(--ink-dim)]">{r.label}</div>
                          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">{r.group}</div>
                        </th>
                        {vals.map((v, i) => (
                          <td
                            key={i}
                            className={cx('px-4 py-3 align-top leading-snug', v === '—' ? 'text-[var(--ink-faint)]' : differs ? 'text-white' : 'text-[var(--ink-dim)]')}
                            style={differs && v !== '—' ? { background: 'linear-gradient(90deg, rgb(var(--accent-rgb) / 0.08), transparent)' } : undefined}
                          >
                            {v}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={sel.length + 1} className="px-4 py-10 text-center text-[var(--ink-faint)]">
                        Pick at least two models to see differences.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* to-scale silhouettes */}
        <div className="mt-10 grid lg:grid-cols-2 gap-5">
          <Reveal>
            <Panel className="p-6 h-full">
              <h2 className="font-psp chrome-text text-2xl">Footprint, to scale</h2>
              <p className="mt-1 text-sm text-[var(--ink-faint)]">Outlines overlaid at true width × height (mm).</p>
              <svg viewBox={`0 0 ${svgW} 200`} className="mt-6 w-full h-auto" role="img" aria-label="Model outlines drawn to scale">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M20 0H0V20" fill="none" stroke="rgb(255 255 255 / 0.05)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width={svgW} height="200" fill="url(#grid)" />
                {sel.map((m) => {
                  const w = m.dims.w * scale;
                  const h = m.dims.h * scale;
                  const ci = models.indexOf(m);
                  return (
                    <rect
                      key={m.id}
                      x={(svgW - w) / 2}
                      y={(200 - h) / 2}
                      width={w}
                      height={h}
                      rx={h * 0.42}
                      fill={`${LINE_COLORS[ci]}10`}
                      stroke={LINE_COLORS[ci]}
                      strokeWidth="1.5"
                      style={{ filter: `drop-shadow(0 0 6px ${LINE_COLORS[ci]}88)` }}
                    />
                  );
                })}
              </svg>
              <div className="mt-4 flex flex-wrap gap-3">
                {sel.map((m) => (
                  <span key={m.id} className="flex items-center gap-2 text-xs text-[var(--ink-dim)]">
                    <span className="w-3 h-3 rounded-sm" style={{ background: LINE_COLORS[models.indexOf(m)] }} />
                    {m.name} · {m.dims.w}×{m.dims.h}×{m.dims.d} mm
                  </span>
                ))}
              </div>
            </Panel>
          </Reveal>
          <Reveal delay={0.06}>
            <Panel className="p-6 h-full">
              <h2 className="font-psp chrome-text text-2xl">Weight & thickness</h2>
              <p className="mt-1 text-sm text-[var(--ink-faint)]">Lighter is better in a pocket; the original is a hefty 280 g.</p>
              <div className="mt-6 space-y-5">
                {sel.map((m) => {
                  const segs = 24;
                  const on = Math.round((m.weight / maxWeight) * segs);
                  const color = LINE_COLORS[models.indexOf(m)];
                  return (
                    <div key={m.id}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-white font-semibold">{m.name}</span>
                        <span className="font-mono text-[var(--ink-dim)]">
                          {m.weight} g · {m.dims.d} mm
                        </span>
                      </div>
                      <div className="flex gap-[3px]">
                        {Array.from({ length: segs }, (_, i) => (
                          <span
                            key={i}
                            className="h-3 flex-1 rounded-[2px]"
                            style={i < on ? { background: color, boxShadow: `0 0 6px ${color}aa` } : { background: '#14171d', boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 0.9)' }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </Reveal>
        </div>
      </Container>
    </>
  );
}
