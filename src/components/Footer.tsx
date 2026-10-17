import { Link } from '../router';
import { Logo, NAV_LINKS } from './Nav';
import { Screws } from './ui';
import { models } from '../data/models';

export function Footer() {
  return (
    <footer className="relative z-10 mt-24 md:mt-32 px-3 md:px-5 pb-5">
      <div className="mx-auto max-w-[1320px] chrome-rim">
        <div className="panel !rounded-[22px] px-6 md:px-10 pt-10 pb-6 overflow-hidden">
          <Screws inset={14} />
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Logo size="lg" />
              <p className="mt-5 text-sm leading-relaxed text-[var(--ink-dim)] max-w-sm">
                A fan-built encyclopedia of the PlayStation Portable — every model, every colourway, the games, the firmware and the scene that kept it alive.
              </p>
              <div className="mt-5 lcd inline-flex items-center gap-3 px-3 py-2">
                <span className="led led-green" />
                <span className="lcd-text text-lg leading-none">BEST VIEWED AT 480×272</span>
              </div>
            </div>
            <div>
              <div className="label mb-4">Explore</div>
              <ul className="space-y-2.5">
                {NAV_LINKS.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-[var(--ink-dim)] hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="label mb-4">Models</div>
              <ul className="space-y-2.5">
                {models.map((m) => (
                  <li key={m.id}>
                    <Link to={`/models/${m.id}`} className="text-sm text-[var(--ink-dim)] hover:text-white transition-colors">
                      {m.name} <span className="text-[var(--ink-faint)]">· {m.nickname.split('·')[0].trim()}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/compare" className="text-sm text-[var(--ink-dim)] hover:text-white transition-colors">
                    Compare all
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="label mb-4">Archive</div>
              <ul className="space-y-2.5 text-sm text-[var(--ink-dim)]">
                <li>
                  <a href="https://github.com/zigzageer/psparchive" className="hover:text-white transition-colors" target="_blank" rel="noreferrer">
                    Source on GitHub ↗
                  </a>
                </li>
                <li>
                  <Link to="/colors?type=limited" className="hover:text-white transition-colors">
                    Limited editions
                  </Link>
                </li>
                <li>
                  <Link to="/guide#decoder" className="hover:text-white transition-colors">
                    Model decoder
                  </Link>
                </li>
                <li>
                  <Link to="/guide#checklist" className="hover:text-white transition-colors">
                    Buying checklist
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <hr className="groove my-8" />
          <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between text-[11px] font-mono tracking-wider text-[var(--ink-faint)]">
            <span>
              Fan-made archive. “PlayStation”, “PSP” and related marks are trademarks of Sony Interactive Entertainment Inc. Not affiliated with Sony.
            </span>
            <span className="shrink-0">psp.quest · MIT licensed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
