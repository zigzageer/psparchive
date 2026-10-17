import { ShieldCheck, Cpu, Layers, MonitorSmartphone } from 'lucide-react';
import { Container, PageHero, Panel, Reveal, SectionHeader } from '../components/ui';
import { homebrewHighlights, sceneGlossary, sceneTimeline } from '../data/scene';
import { useTitle } from '../router';

const STACK = [
  { icon: Cpu, title: 'Official firmware 6.61', text: 'The base layer. Update any PSP to 6.61 first — every modern tool expects it.' },
  { icon: Layers, title: 'Custom firmware', text: 'ARK-4 or PRO-C (and ME/LME) run on top, adding plugins, ISO loading for your own dumps, and overclocking.' },
  { icon: MonitorSmartphone, title: 'Or emulate', text: 'PPSSPP plays most of the library at higher resolutions on phones, PCs and handheld PCs. On PS Vita, Adrenaline boots a full PSP environment.' },
];

export function Homebrew() {
  useTitle('Homebrew & custom firmware');
  return (
    <>
      <PageHero
        kicker="The scene"
        code="Homebrew & CFW"
        title={
          <>
            Twenty years of
            <br />
            cat and mouse.
          </>
        }
        sub="Few consoles were hacked as thoroughly — or as creatively — as the PSP. A history of the exploits, firmwares and people that turned it into an open handheld."
      />

      <Container>
        <Reveal>
          <div className="glass p-5 md:p-6 flex gap-4 items-start max-w-3xl">
            <ShieldCheck className="shrink-0 mt-0.5" size={22} style={{ color: 'var(--accent-hi)' }} />
            <p className="text-sm md:text-[15px] leading-relaxed text-[var(--ink-dim)]">
              This page documents history. PSP Archive doesn’t host or link to firmware, exploits or copyrighted games — dump and back up discs you own, and support
              developers whose games are still sold today.
            </p>
          </div>
        </Reveal>

        {/* terminal timeline */}
        <section className="mt-16">
          <Reveal>
            <SectionHeader index="01" kicker="Timeline" title="From KXploit to ARK-4." />
          </Reveal>
          <Reveal>
            <div className="chrome-rim">
              <div className="rounded-[22px] overflow-hidden" style={{ background: '#030806', boxShadow: 'inset 0 0 80px rgb(40 255 120 / 0.05)' }}>
                <div className="metal flex items-center gap-2 px-4 py-2.5 !rounded-none">
                  <span className="w-3 h-3 rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, #fff, #ff5f57 50%, #9a1d18)' }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, #fff, #febc2e 50%, #9a6a08)' }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, #fff, #28c840 50%, #0e6b1e)' }} />
                  <span className="ml-3 font-mono text-[11px] font-bold tracking-[0.12em] text-black/60">ms0:/PSP/GAME/history.log</span>
                </div>
                <div className="relative p-5 md:p-8 font-mono text-[13px] md:text-sm leading-relaxed">
                  <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg, rgb(0 0 0 / 0.25) 0 1px, transparent 1px 3px)' }} />
                  <ol className="relative space-y-6">
                    {sceneTimeline.map((e) => (
                      <li key={e.title} className="grid md:grid-cols-[130px_1fr] gap-1 md:gap-6">
                        <span className="text-[#3dff8f]/60">[{e.date}]</span>
                        <div>
                          <div className="text-[#3dff8f]" style={{ textShadow: '0 0 8px rgb(61 255 143 / 0.6)' }}>
                            &gt; {e.title}
                            {e.who && <span className="text-[#3dff8f]/55"> — {e.who}</span>}
                          </div>
                          <p className="mt-1 text-[#b7f5cd]/75">{e.text}</p>
                        </div>
                      </li>
                    ))}
                    <li className="text-[#3dff8f]">
                      &gt; <span className="led-blink">█</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* stack */}
        <section className="mt-24">
          <Reveal>
            <SectionHeader index="02" kicker="State of play" title="How people run a PSP today." sub="The scene settled long ago. In broad strokes, a modern setup looks like this." />
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {STACK.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <Panel className="p-6 h-full" screws>
                  <div className="flex items-center gap-3">
                    <span className="lcd lcd-text px-2 py-0.5 text-lg leading-none !rounded-md">L{i + 1}</span>
                    <s.icon size={20} style={{ color: 'var(--accent-hi)' }} />
                  </div>
                  <h3 className="mt-4 font-psp text-white text-xl">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-dim)]">{s.text}</p>
                </Panel>
              </Reveal>
            ))}
          </div>
        </section>

        {/* highlights */}
        <section className="mt-24">
          <Reveal>
            <SectionHeader index="03" kicker="Notable homebrew" title="What people built." />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {homebrewHighlights.map((h, i) => (
              <Reveal key={h.name} delay={(i % 3) * 0.05}>
                <div className="glass p-5 h-full">
                  <span className="chip chip-accent">{h.kind}</span>
                  <h3 className="mt-3 font-psp text-white text-xl">{h.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-dim)]">{h.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* glossary */}
        <section className="mt-24">
          <Reveal>
            <SectionHeader index="04" kicker="Glossary" title="Speak the language." />
          </Reveal>
          <Reveal>
            <div className="chrome-rim">
              <div className="panel !rounded-[22px] p-2 md:p-3 grid md:grid-cols-2">
                {sceneGlossary.map((g) => (
                  <div key={g.term} className="flex gap-4 p-4 border-b border-white/[0.06] md:[&:nth-last-child(-n+2)]:border-0 last:border-0">
                    <span className="lcd lcd-text px-2 py-1 text-lg leading-none !rounded-md shrink-0 min-w-[78px] text-center">{g.term}</span>
                    <p className="text-sm leading-relaxed text-[var(--ink-dim)]">{g.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      </Container>
    </>
  );
}
