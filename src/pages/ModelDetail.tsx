import { ArrowLeft, ArrowRight, GitCompareArrows } from 'lucide-react';
import { Container, Meter, Panel, Reveal, Screws, cx } from '../components/ui';
import { ColorCard } from '../components/ColorCard';
import { RATING_LABELS, SPEC_ROWS, getModel, models } from '../data/models';
import { colorwaysFor, heroImage } from '../lib/catalog';
import { Link, useTitle } from '../router';
import { NotFound } from './NotFound';

export function ModelDetail({ id }: { id: string }) {
  const m = getModel(id);
  useTitle(m ? `${m.name} — ${m.nickname.split('·')[0].trim()}` : 'Not found');
  if (!m) return <NotFound />;

  const img = heroImage(m.id, m.heroColor);
  const cws = colorwaysFor(m.id);
  const idx = models.indexOf(m);
  const prev = models[(idx - 1 + models.length) % models.length];
  const next = models[(idx + 1) % models.length];
  const groups = [...new Set(SPEC_ROWS.map((r) => r.group))];

  return (
    <div className="pt-28 md:pt-32">
      <Container>
        {/* model switcher */}
        <div className="no-scrollbar overflow-x-auto mb-8">
          <div className="flex gap-1.5 well p-1 w-max">
            {models.map((x) => (
              <Link key={x.id} to={`/models/${x.id}`} className={cx('key !py-2', x.id === m.id && 'is-on')}>
                {x.name}
              </Link>
            ))}
            <Link to="/compare" className="key !py-2">
              <GitCompareArrows size={12} /> Compare
            </Link>
          </div>
        </div>

        {/* hero */}
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="led led-blink" />
              <span className="label !text-[11px]" style={{ color: 'var(--accent-hi)' }}>
                {m.nickname}
              </span>
            </div>
            <h1 className="font-psp chrome-text text-[3.4rem] sm:text-7xl xl:text-8xl leading-[0.95] pb-2 whitespace-nowrap">{m.name}</h1>
            <p className="mt-4 text-xl md:text-2xl text-white/90 font-medium leading-snug">{m.tagline}</p>
            <p className="mt-4 text-[15px] md:text-base leading-relaxed text-[var(--ink-dim)] max-w-xl">{m.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="chip">{m.modelNumbers}</span>
              <span className="chip">{m.years}</span>
              <span className="chip chip-accent">Launch FW {m.launchFirmware}</span>
            </div>
          </div>
          <div className="relative aspect-[16/10]" style={{ background: 'radial-gradient(55% 55% at 50% 60%, rgb(var(--accent-rgb) / 0.3), transparent 70%)' }}>
            <div className="stage-floor" />
            <div className="absolute inset-0 scale-[1.28] origin-center">
              <img src={img} alt={m.name} className="reflect float absolute inset-x-0 top-[6%] h-[74%] w-full object-contain" style={{ filter: 'drop-shadow(0 28px 34px rgb(0 0 0 / 0.65))' }} />
            </div>
          </div>
        </div>

        {/* quick stats */}
        <div className="mt-10 chrome-rim">
          <div className="panel !rounded-[22px] p-3 md:p-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              [m.releases[0].date, `Released · ${m.releases[0].region}`],
              [m.prices.find((p) => p.region === 'USA')?.price.split(' ')[0] ?? m.prices[0].price.split(' ')[0], 'Launch price'],
              [`${m.weight} g`, 'Weight'],
              [m.specs.battery.split(',')[0], 'Battery'],
            ].map(([v, l]) => (
              <div key={l} className="lcd px-4 py-3">
                <div className="lcd-text text-3xl md:text-4xl leading-none truncate">{v}</div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[rgb(166_246_255/0.55)]">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* what changed + ratings */}
        <div className="mt-16 grid lg:grid-cols-[1.3fr_1fr] gap-5">
          <Reveal>
            <Panel className="p-6 md:p-8 h-full">
              <h2 className="font-psp chrome-text text-3xl">What’s new</h2>
              <ul className="mt-5 space-y-3">
                {m.changes.map((c) => (
                  <li key={c} className="flex gap-3 text-[15px] leading-relaxed text-[var(--ink-dim)]">
                    <span className="mt-2 w-2 h-2 rotate-45 shrink-0" style={{ background: 'linear-gradient(135deg, #fff, var(--accent))', boxShadow: '0 0 8px rgb(var(--accent-rgb))' }} />
                    {c}
                  </li>
                ))}
              </ul>
              <hr className="groove my-6" />
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="led led-green" />
                    <span className="label">Strengths</span>
                  </div>
                  <ul className="space-y-2 text-sm text-[var(--ink-dim)]">
                    {m.pros.map((p) => (
                      <li key={p}>+ {p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="led" style={{ background: 'radial-gradient(circle at 35% 30%, #ffd9d9, #ff4a4a 45%, #8a1010)', boxShadow: '0 0 8px #ff4a4a' }} />
                    <span className="label">Weak spots</span>
                  </div>
                  <ul className="space-y-2 text-sm text-[var(--ink-dim)]">
                    {m.cons.map((p) => (
                      <li key={p}>− {p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Panel>
          </Reveal>
          <Reveal delay={0.08}>
            <Panel className="p-6 md:p-8 h-full" screws>
              <h2 className="font-psp chrome-text text-3xl">Archive rating</h2>
              <p className="mt-2 text-sm text-[var(--ink-faint)]">Our take, for buying and playing one today.</p>
              <div className="mt-6 space-y-3.5">
                {(Object.keys(m.ratings) as (keyof typeof m.ratings)[]).map((k) => (
                  <Meter key={k} label={RATING_LABELS[k]} value={m.ratings[k]} />
                ))}
              </div>
              <hr className="groove my-6" />
              <div className="label mb-3">Motherboards</div>
              <div className="flex flex-wrap gap-1.5">
                {m.boards.map((b) => (
                  <span key={b} className="chip">
                    {b}
                  </span>
                ))}
              </div>
            </Panel>
          </Reveal>
        </div>

        {/* spec sheet */}
        <Reveal>
          <section className="mt-16">
            <h2 className="font-psp chrome-text text-3xl md:text-4xl mb-6">Spec sheet</h2>
            <div className="chrome-rim">
              <div className="panel !rounded-[22px] overflow-hidden">
                <Screws inset={12} />
                {groups.map((g) => (
                  <div key={g} className="grid md:grid-cols-[180px_1fr] border-b border-white/[0.06] last:border-0">
                    <div className="px-5 md:px-6 pt-5 md:py-5">
                      <span className="label" style={{ color: 'var(--accent-hi)' }}>
                        {g}
                      </span>
                    </div>
                    <dl className="px-5 md:px-6 pb-4 md:py-3">
                      {SPEC_ROWS.filter((r) => r.group === g).map((r) => (
                        <div key={r.key} className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] gap-3 py-2 border-b border-dashed border-white/[0.06] last:border-0">
                          <dt className="text-sm text-[var(--ink-faint)]">{r.label}</dt>
                          <dd className={cx('text-sm', m.specs[r.key] === '—' ? 'text-[var(--ink-faint)]' : 'text-white/90')}>{m.specs[r.key]}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* release & price */}
        <div className="mt-16 grid md:grid-cols-2 gap-5">
          <Reveal>
            <div className="lcd p-6 h-full">
              <div className="lcd-text text-2xl">RELEASE DATES</div>
              <div className="mt-4 space-y-2">
                {m.releases.map((r) => (
                  <div key={r.region} className="flex justify-between gap-4 border-b border-dashed border-[rgb(166_246_255/0.15)] pb-2">
                    <span className="lcd-text text-xl opacity-70">{r.region.toUpperCase()}</span>
                    <span className="lcd-text text-xl">{r.date.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="lcd p-6 h-full">
              <div className="lcd-text text-2xl">LAUNCH PRICING</div>
              <div className="mt-4 space-y-2">
                {m.prices.map((r) => (
                  <div key={r.region} className="flex justify-between gap-4 border-b border-dashed border-[rgb(166_246_255/0.15)] pb-2">
                    <span className="lcd-text text-xl opacity-70">{r.region.toUpperCase()}</span>
                    <span className="lcd-text text-xl text-right">{r.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* trivia */}
        <section className="mt-16">
          <h2 className="font-psp chrome-text text-3xl md:text-4xl mb-6">Good to know</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {m.trivia.map((t, i) => (
              <Reveal key={t} delay={i * 0.06}>
                <div className="glass p-5 h-full">
                  <span className="lcd lcd-text px-2 py-0.5 text-lg leading-none !rounded-md">#{String(i + 1).padStart(2, '0')}</span>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-dim)]">{t}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* colours */}
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="font-psp chrome-text text-3xl md:text-4xl">
              {cws.length} {m.name} colourway{cws.length === 1 ? '' : 's'}
            </h2>
            <Link to={`/colors?model=${m.id}`} className="key !py-1.5 shrink-0">
              In the archive <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cws.map((c) => (
              <ColorCard key={c.key} cw={c} compact />
            ))}
          </div>
        </section>

        <div className="mt-12 grid grid-cols-2 gap-3">
          <Link to={`/models/${prev.id}`} className="group panel px-5 py-4 flex items-center gap-3">
            <ArrowLeft size={18} className="text-[var(--ink-faint)] group-hover:text-white" />
            <div>
              <div className="label !text-[9px]">Previous</div>
              <div className="font-psp text-white">{prev.name}</div>
            </div>
          </Link>
          <Link to={`/models/${next.id}`} className="group panel px-5 py-4 flex items-center justify-end gap-3 text-right">
            <div>
              <div className="label !text-[9px]">Next</div>
              <div className="font-psp text-white">{next.name}</div>
            </div>
            <ArrowRight size={18} className="text-[var(--ink-faint)] group-hover:text-white" />
          </Link>
        </div>
      </Container>
    </div>
  );
}
