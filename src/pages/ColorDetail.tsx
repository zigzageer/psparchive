import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Link2, RotateCw } from 'lucide-react';
import { Container, Panel, Screws, cx } from '../components/ui';
import { ColorCard, Swatch } from '../components/ColorCard';
import { colorways, colorwaysFor, findColorway } from '../lib/catalog';
import { getModel } from '../data/models';
import { Link, navigate, useTitle } from '../router';
import { sfx } from '../sound';
import { NotFound } from './NotFound';

export function ColorDetail({ modelId, slug }: { modelId: string; slug: string }) {
  const cw = findColorway(modelId, slug);
  useTitle(cw ? `${cw.color.name} ${cw.model.name}` : 'Not found');
  const [view, setView] = useState(0);
  const [copied, setCopied] = useState(false);

  const idx = cw ? colorways.indexOf(cw) : -1;
  const prev = idx > 0 ? colorways[idx - 1] : colorways[colorways.length - 1];
  const next = idx >= 0 && idx < colorways.length - 1 ? colorways[idx + 1] : colorways[0];
  const siblings = useMemo(() => (cw ? colorwaysFor(cw.model.id).filter((c) => c.key !== cw.key) : []), [cw]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowLeft') navigate(`/colors/${prev.model.id}/${prev.slug}`);
      if (e.key === 'ArrowRight') navigate(`/colors/${next.model.id}/${next.slug}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  if (!cw) return <NotFound />;

  const info = getModel(cw.model.id);
  const views = [cw.front, cw.back].filter(Boolean) as string[];
  const extras = cw.images.filter((u) => u !== cw.front && u !== cw.back);
  const limited = cw.color.type === 'limited';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="pt-28 md:pt-32">
      <Container>
        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)] mb-6">
          <Link to="/colors" className="hover:text-white">
            Colours
          </Link>
          <span>/</span>
          <Link to={`/colors?model=${cw.model.id}`} className="hover:text-white whitespace-nowrap">
            {cw.model.name}
          </Link>
          <span>/</span>
          <span className="text-[var(--ink-dim)] truncate">{cw.color.name}</span>
        </nav>

        <div className="grid lg:grid-cols-[1.45fr_1fr] gap-5 items-stretch">
          {/* Showroom */}
          <div className="chrome-rim">
            <div className="panel !rounded-[22px] relative overflow-hidden h-full min-h-[320px] md:min-h-[520px] flex flex-col">
              <Screws inset={14} />
              <div
                className="relative flex-1 pinstripe"
                style={{ background: `radial-gradient(55% 55% at 50% 58%, ${cw.color.hex}66, transparent 72%)` }}
              >
                {/* turntable */}
                <div
                  className="absolute left-1/2 bottom-[17%] w-[74%] h-[15%] -translate-x-1/2 rounded-[50%]"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 40%, rgb(255 255 255 / 0.18), rgb(255 255 255 / 0.03) 60%, transparent 70%)',
                    boxShadow: `0 0 60px ${cw.color.hex}55`,
                  }}
                />
                <div className="stage-floor !bottom-[14%] !h-[20%]" style={{ background: `radial-gradient(ellipse, ${cw.color.hex}88, transparent 70%)` }} />
                <AnimatePresence mode="wait">
                  {views[view] ? (
                    <motion.img
                      key={views[view]}
                      src={views[view]}
                      alt={`${cw.color.name} ${cw.model.name} ${view === 0 ? 'front' : 'back'}`}
                      initial={{ opacity: 0, rotateY: view ? -70 : 70, scale: 0.95 }}
                      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                      exit={{ opacity: 0, rotateY: view ? 70 : -70, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                      className="reflect absolute inset-x-[5%] top-[6%] h-[68%] w-[90%] object-contain object-bottom"
                      style={{ filter: 'drop-shadow(0 24px 30px rgb(0 0 0 / 0.65))' }}
                    />
                  ) : (
                    <div className="absolute inset-x-[20%] top-[30%] h-[30%] rounded-full" style={{ background: cw.color.hex }} />
                  )}
                </AnimatePresence>
                <span className="absolute left-5 top-5 lcd lcd-text px-2 py-0.5 text-lg leading-none !rounded-md">{view === 0 ? 'FRONT' : 'BACK'}</span>
                {limited && <span className="holo absolute right-5 top-5 rotate-[5deg] !text-[11px] !px-3 !py-1.5">Limited edition</span>}
              </div>
              <div className="relative flex items-center justify-between gap-3 px-4 py-3 border-t border-white/[0.07]">
                <div className="flex gap-1.5 well p-1">
                  {views.map((_, i) => (
                    <button key={i} type="button" className={cx('key !py-1.5', view === i && 'is-on')} onClick={() => { sfx.toggle(); setView(i); }}>
                      {i === 0 ? 'Front' : 'Back'}
                    </button>
                  ))}
                </div>
                {views.length > 1 && (
                  <button type="button" className="key !py-1.5" onClick={() => { sfx.toggle(); setView((v) => (v + 1) % views.length); }}>
                    <RotateCw size={13} /> Flip
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <Panel className="p-6 md:p-8 flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <Link to={`/models/${cw.model.id}`} className="chip chip-accent hover:brightness-125">
                {cw.model.name}
              </Link>
              <span className="chip">{cw.model.year}</span>
              <span className={cx('chip', limited && '!text-[#ffd6f3]')}>{limited ? 'Limited' : 'Standard'}</span>
            </div>
            <h1 className="mt-5 font-psp chrome-text text-4xl md:text-5xl leading-[1.02] pb-1">{cw.color.name}</h1>
            <p className="mt-4 text-[var(--ink-dim)] leading-relaxed">{cw.color.description}</p>

            <div className="mt-6 lcd p-4 grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                ['MODEL', cw.model.name],
                ['FAMILY', info?.nickname.split('·')[0].trim() ?? '—'],
                ['FIRST YEAR', cw.model.year],
                ['EDITION', limited ? 'LIMITED' : 'STANDARD'],
                ['FINISH', cw.color.hex.toUpperCase()],
                ['PHOTOS', String(cw.images.length).padStart(2, '0')],
              ].map(([k, v]) => (
                <div key={k} className="min-w-0">
                  <div className="lcd-text text-sm opacity-55 leading-none">{k}</div>
                  <div className="lcd-text text-xl leading-tight truncate uppercase">{v}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-4">
              {/* paint chip */}
              <div className="metal rounded-[12px] p-1.5 pb-2 w-[84px] shrink-0">
                <div className="h-12 rounded-[8px]" style={{ background: `linear-gradient(160deg, rgb(255 255 255 / 0.35), transparent 40%), ${cw.color.hex}`, boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / 0.25)' }} />
                <div className="mt-1.5 text-center font-mono text-[9px] font-bold tracking-wider text-black/70">{cw.color.hex.toUpperCase()}</div>
              </div>
              <p className="text-xs leading-relaxed text-[var(--ink-faint)]">
                Swatch colour is an approximation for browsing. Real finishes are often metallic, pearlescent or matte.
              </p>
            </div>

            <div className="mt-auto pt-7 flex flex-wrap gap-2">
              <Link to={`/models/${cw.model.id}`} className="gel gel-sm">
                {cw.model.name} specs <ArrowRight size={14} />
              </Link>
              <button type="button" onClick={copy} className="gel gel-black gel-sm">
                {copied ? <Check size={14} /> : <Link2 size={14} />} {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
          </Panel>
        </div>

        {/* prev / next */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link to={`/colors/${prev.model.id}/${prev.slug}`} className="group panel px-4 py-3.5 flex items-center gap-3 min-w-0">
            <ChevronLeft size={18} className="text-[var(--ink-faint)] group-hover:text-white shrink-0" />
            <Swatch hex={prev.color.hex} />
            <div className="min-w-0">
              <div className="label !text-[9px]">Previous</div>
              <div className="text-sm text-[var(--ink-dim)] group-hover:text-white truncate">{prev.color.name}</div>
            </div>
          </Link>
          <Link to={`/colors/${next.model.id}/${next.slug}`} className="group panel px-4 py-3.5 flex items-center justify-end gap-3 min-w-0 text-right">
            <div className="min-w-0">
              <div className="label !text-[9px]">Next</div>
              <div className="text-sm text-[var(--ink-dim)] group-hover:text-white truncate">{next.color.name}</div>
            </div>
            <Swatch hex={next.color.hex} />
            <ChevronRight size={18} className="text-[var(--ink-faint)] group-hover:text-white shrink-0" />
          </Link>
        </div>
        <p className="hidden md:block mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-faint)]">Tip: use ← → to flip through the archive</p>

        {extras.length > 0 && (
          <section className="mt-16">
            <h2 className="font-psp chrome-text text-3xl mb-6">From the archive</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {extras.map((u) => (
                <div key={u} className="chrome-rim">
                  <div className="panel !rounded-[22px] overflow-hidden p-2">
                    <img src={u} alt={`${cw.color.name} archive photo`} loading="lazy" className="w-full h-auto rounded-[16px]" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {siblings.length > 0 && (
          <section className="mt-16">
            <div className="flex items-end justify-between gap-4 mb-6">
              <h2 className="font-psp chrome-text text-3xl">More {cw.model.name}</h2>
              <Link to={`/colors?model=${cw.model.id}`} className="key !py-1.5 shrink-0">
                All {siblings.length + 1} <ArrowRight size={12} />
              </Link>
            </div>
            <div className="no-scrollbar overflow-x-auto relative left-1/2 w-screen -translate-x-1/2">
              <div className="flex gap-4 w-max pb-4 shelf-pad">
                {siblings.map((s) => (
                  <div key={s.key} className="w-[240px] md:w-[270px] shrink-0">
                    <ColorCard cw={s} compact />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="mt-10">
          <Link to="/colors" className="key">
            <ArrowLeft size={12} /> Back to all colourways
          </Link>
        </div>
      </Container>
    </div>
  );
}
