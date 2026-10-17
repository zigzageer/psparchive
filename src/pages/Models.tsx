import { ArrowRight, Camera, MapPin, Tv, Headphones, Mic, Cable, Battery, Monitor, HardDrive, GitCompareArrows, type LucideIcon } from 'lucide-react';
import { Container, PageHero, Panel, Reveal, SectionHeader, cx } from '../components/ui';
import { ACCESSORIES, models } from '../data/models';
import { colorwaysFor, heroImage } from '../lib/catalog';
import { Link, useTitle } from '../router';

const ACC_ICON: Record<string, LucideIcon> = {
  camera: Camera,
  'map-pin': MapPin,
  tv: Tv,
  headphones: Headphones,
  mic: Mic,
  cable: Cable,
  battery: Battery,
  monitor: Monitor,
  'hard-drive': HardDrive,
};

export function Models() {
  useTitle('Hardware');
  return (
    <>
      <PageHero
        kicker="Hardware"
        code="5 families · 2004 – 2014"
        title={
          <>
            Five generations
            <br />
            of PSP.
          </>
        }
        sub="Same 480×272 screen, same 333 MHz CPU — but very different machines. Here’s how the PSP evolved, model by model."
      >
        <Link to="/compare" className="gel">
          Compare side by side <GitCompareArrows size={16} />
        </Link>
      </PageHero>

      <Container className="flex flex-col gap-6 md:gap-8">
        {models.map((m, i) => {
          const img = heroImage(m.id, m.heroColor);
          const count = colorwaysFor(m.id).length;
          return (
            <Reveal key={m.id}>
              <Link to={`/models/${m.id}`} className="group block chrome-rim">
                <div className={cx('panel !rounded-[22px] grid md:grid-cols-2 overflow-hidden')}>
                  <div
                    className={cx('relative aspect-[16/10] md:aspect-auto md:min-h-[360px] pinstripe', i % 2 === 1 && 'md:order-2')}
                    style={{ background: 'radial-gradient(60% 55% at 50% 60%, rgb(var(--accent-rgb) / 0.22), transparent 70%)' }}
                  >
                    <div className="stage-floor" />
                    <img
                      src={img}
                      alt={m.name}
                      loading="lazy"
                      className="reflect absolute inset-x-[8%] top-[10%] h-[68%] w-[84%] object-contain transition-transform duration-500 group-hover:scale-[1.04] group-hover:-translate-y-1"
                      style={{ filter: 'drop-shadow(0 22px 26px rgb(0 0 0 / 0.6))' }}
                    />
                    <span className="absolute left-5 top-5 lcd lcd-text px-2 py-0.5 text-lg leading-none !rounded-md">{m.years}</span>
                  </div>
                  <div className="p-6 md:p-10 flex flex-col justify-center">
                    <div className="label" style={{ color: 'var(--accent-hi)' }}>
                      {m.nickname}
                    </div>
                    <h2 className="mt-2 font-psp chrome-text text-4xl md:text-6xl leading-none pb-1">{m.name}</h2>
                    <p className="mt-3 text-lg text-white/90 font-medium">{m.tagline}</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-dim)]">{m.summary}</p>
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        [`${m.weight}g`, 'Weight'],
                        [m.specs.ram.split(' ')[0] + 'MB', 'RAM'],
                        [m.specs.screen.split(' ')[0], 'Screen'],
                        [String(count), 'Colours'],
                      ].map(([v, l]) => (
                        <div key={l} className="lcd px-3 py-2">
                          <div className="lcd-text text-2xl leading-none">{v}</div>
                          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[rgb(166_246_255/0.55)] mt-1">{l}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <span className="gel gel-chrome gel-sm">
                        Full spec sheet <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </Container>

      <section id="accessories" className="mt-24 md:mt-32 scroll-mt-28">
        <Container>
          <Reveal>
            <SectionHeader index="++" kicker="Peripherals" title="Accessories & add-ons." sub="The PSP’s top port and remote connector supported a surprising range of official hardware." />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACCESSORIES.map((a, i) => {
              const Icon = ACC_ICON[a.icon] ?? HardDrive;
              return (
                <Reveal key={a.name} delay={(i % 3) * 0.05}>
                  <Panel className="p-5 h-full">
                    <div className="flex items-start gap-4">
                      <span className="app-icon w-12 h-12 shrink-0">
                        <Icon size={22} strokeWidth={2.2} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-psp text-white text-lg leading-tight">{a.name}</h3>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          <span className="chip !text-[9px]">{a.year}</span>
                          <span className="chip !text-[9px]">{a.models}</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-[var(--ink-dim)]">{a.text}</p>
                  </Panel>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
