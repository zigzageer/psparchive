import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, X } from 'lucide-react';
import { Container, PageHero, Reveal, cx } from '../components/ui';
import { ColorCard } from '../components/ColorCard';
import { colorways, FAMILIES, stats } from '../lib/catalog';
import { pspData } from '../data';
import { navigate, useSearch, useTitle } from '../router';
import { sfx } from '../sound';

const FAMILY_HEX: Record<string, string> = {
  black: '#16171b',
  white: '#f2f2f2',
  silver: '#bfc5cc',
  blue: '#2f6fe0',
  red: '#d42a2a',
  pink: '#ff7fc0',
  purple: '#a07ad8',
  green: '#3ec76a',
  yellow: '#ffe14d',
  gold: '#e3c27a',
  bronze: '#b87333',
};

function useParams() {
  const search = useSearch();
  const p = new URLSearchParams(search);
  return {
    model: p.get('model') ?? 'all',
    type: (p.get('type') ?? 'all') as 'all' | 'standard' | 'limited',
    family: p.get('family') ?? 'all',
    q: p.get('q') ?? '',
  };
}

function setParam(key: string, value: string) {
  const p = new URLSearchParams(window.location.search);
  if (!value || value === 'all') p.delete(key);
  else p.set(key, value);
  const qs = p.toString();
  navigate(`/colors${qs ? `?${qs}` : ''}`, { replace: true, keepScroll: true });
}

export function Colors() {
  useTitle('Colour Archive');
  const { model, type, family, q } = useParams();

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return colorways.filter(
      (c) =>
        (model === 'all' || c.model.id === model) &&
        (type === 'all' || c.color.type === type) &&
        (family === 'all' || c.family === family) &&
        (!needle || c.color.name.toLowerCase().includes(needle) || c.model.name.toLowerCase().includes(needle) || c.color.description.toLowerCase().includes(needle)),
    );
  }, [model, type, family, q]);

  const groups = pspData
    .map((m) => ({ model: m, items: filtered.filter((c) => c.model.id === m.id) }))
    .filter((g) => g.items.length);

  const active = model !== 'all' || type !== 'all' || family !== 'all' || q !== '';

  return (
    <>
      <PageHero
        kicker="The Colour Archive"
        code={`${stats.colorways} finishes`}
        title={
          <>
            Every finish
            <br />
            ever shipped.
          </>
        }
        sub={`${stats.standard} standard colours and ${stats.limited} limited editions across five models — photographed front and back. Filter by model, colour family or edition.`}
      />

      <Container>
        {/* Filter console */}
        <div className="relative md:sticky md:top-[84px] z-40 mb-8">
          <div className="chrome-rim">
            <div className="panel !rounded-[22px] p-3 md:p-4 flex flex-col gap-3">
              <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
                <div className="relative flex-1 min-w-0">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(166_246_255/0.5)] pointer-events-none z-10" />
                  <input
                    className="lcd-input !pl-9"
                    placeholder="SEARCH COLOURWAYS…"
                    value={q}
                    onChange={(e) => setParam('q', e.target.value)}
                    aria-label="Search colourways"
                  />
                </div>
                <div className="no-scrollbar flex gap-1.5 overflow-x-auto well p-1 shrink-0">
                  {['all', ...pspData.map((m) => m.id)].map((id) => (
                    <button
                      key={id}
                      type="button"
                      className={cx('key !py-2', model === id && 'is-on')}
                      onClick={() => {
                        sfx.toggle();
                        setParam('model', id);
                      }}
                    >
                      {id === 'all' ? 'All' : pspData.find((m) => m.id === id)!.name.replace('PSP ', 'PSP·')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
                <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-1 px-0.5">
                  <button
                    type="button"
                    onClick={() => setParam('family', 'all')}
                    className={cx('key !py-1.5 !px-2.5 shrink-0', family === 'all' && 'is-on')}
                  >
                    Any colour
                  </button>
                  {FAMILIES.map((f) => (
                    <button
                      key={f}
                      type="button"
                      title={f}
                      aria-label={`${f} colours`}
                      aria-pressed={family === f}
                      onClick={() => {
                        sfx.toggle();
                        setParam('family', family === f ? 'all' : f);
                      }}
                      className="shrink-0 w-7 h-7 rounded-full transition-transform hover:scale-110"
                      style={{
                        background: `radial-gradient(circle at 35% 28%, rgb(255 255 255 / 0.9), ${FAMILY_HEX[f]} 45%, ${FAMILY_HEX[f]})`,
                        boxShadow:
                          family === f
                            ? `0 0 0 2px #06080d, 0 0 0 4px var(--accent-hi), 0 0 14px ${FAMILY_HEX[f]}`
                            : 'inset 0 -2px 3px rgb(0 0 0 / 0.35), 0 0 0 1px rgb(0 0 0 / 0.6), 0 3px 6px rgb(0 0 0 / 0.5)',
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex gap-1 well p-1">
                    {(['all', 'standard', 'limited'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={cx('key !py-1.5', type === t && 'is-on')}
                        onClick={() => {
                          sfx.toggle();
                          setParam('type', t);
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="lcd px-3 py-1.5 !rounded-[10px] flex items-baseline gap-1.5">
                    <span className="lcd-text text-2xl leading-none">{String(filtered.length).padStart(2, '0')}</span>
                    <span className="lcd-text text-sm leading-none opacity-60">FOUND</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {active && (
          <div className="mb-6 flex items-center gap-3">
            <button type="button" className="key !py-1.5" onClick={() => navigate('/colors', { replace: true, keepScroll: true })}>
              <X size={12} /> Clear filters
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="lcd px-6 py-14 text-center">
            <div className="lcd-text text-3xl">NO DATA</div>
            <p className="lcd-text text-lg opacity-70 mt-2">No colourways match those filters.</p>
          </div>
        )}

        <div className="flex flex-col gap-16">
          {groups.map(({ model: m, items }) => (
            <section key={m.id} aria-labelledby={`g-${m.id}`}>
              <Reveal>
                <div className="metal rounded-[14px] px-4 py-2.5 mb-6 flex items-center justify-between gap-4">
                  <div className="flex items-baseline gap-3 min-w-0">
                    <h2 id={`g-${m.id}`} className="font-psp text-xl md:text-2xl engraved leading-none">
                      {m.name}
                    </h2>
                    <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.14em] text-black/55 truncate">{m.description}</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-black/60 shrink-0">
                    {m.year} · {items.length} {items.length === 1 ? 'FINISH' : 'FINISHES'}
                  </span>
                </div>
              </Reveal>
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {items.map((cw, i) => (
                  <motion.div key={cw.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}>
                    <ColorCard cw={cw} />
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
