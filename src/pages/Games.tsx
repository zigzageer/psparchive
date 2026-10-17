import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search, Shuffle, X } from 'lucide-react';
import { Container, PageHero, cx } from '../components/ui';
import { UMD, gameHue } from '../components/UMD';
import { GENRES, TAGS, games, type Game } from '../data/games';
import { navigate, useSearch, useTitle } from '../router';
import { sfx } from '../sound';

type Sort = 'year' | 'year-desc' | 'az';

function GameModal({ game, onClose }: { game: Game; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  const h = gameHue(game);
  return (
    <motion.div className="fixed inset-0 z-[130] flex items-end sm:items-center justify-center p-3 sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={game.title}
        initial={{ y: 40, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 30, scale: 0.97, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        className="relative w-full max-w-3xl chrome-rim"
      >
        <div className="panel !rounded-[22px] grid sm:grid-cols-[230px_1fr] gap-6 p-6 md:p-8 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{ background: `radial-gradient(60% 60% at 15% 30%, hsl(${h} 80% 50% / 0.35), transparent 70%)` }}
          />
          <div className="relative w-[170px] sm:w-full mx-auto">
            <UMD game={game} size="lg" />
          </div>
          <div className="relative">
            <button type="button" onClick={onClose} className="key !px-2 !py-1.5 absolute -top-1 right-0" aria-label="Close">
              <X size={14} />
            </button>
            <div className="flex flex-wrap gap-1.5 pr-10">
              <span className="chip chip-accent">{game.genre}</span>
              <span className="chip">{game.year}</span>
              {game.tags.map((t) => (
                <span key={t} className={cx('chip', t === 'Essential' && '!text-[#ffe08a]')}>
                  {t}
                </span>
              ))}
            </div>
            <h2 className="mt-4 font-psp chrome-text text-3xl md:text-4xl leading-[1.05] pb-1">{game.title}</h2>
            <div className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink-faint)]">{game.dev}</div>
            <p className="mt-5 text-[var(--ink-dim)] leading-relaxed text-[15px] md:text-base">{game.blurb}</p>
            <div className="mt-6 lcd px-4 py-3 inline-flex items-center gap-3">
              <span className="led led-green" />
              <span className="lcd-text text-lg leading-none">
                FIRST RELEASED {game.year} · {game.genre.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Games() {
  useTitle('Games');
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialTag = params.get('tag') ?? 'all';
  const [q, setQ] = useState('');
  const [genre, setGenre] = useState<string>('all');
  const [tag, setTag] = useState<string>(initialTag);
  const [sort, setSort] = useState<Sort>('year');
  const [open, setOpen] = useState<Game | null>(null);

  useEffect(() => setTag(initialTag), [initialTag]);

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    const r = games.filter(
      (g) =>
        (genre === 'all' || g.genre === genre) &&
        (tag === 'all' || g.tags.includes(tag)) &&
        (!n || g.title.toLowerCase().includes(n) || g.dev.toLowerCase().includes(n) || g.blurb.toLowerCase().includes(n)),
    );
    return [...r].sort((a, b) => (sort === 'az' ? a.title.localeCompare(b.title) : sort === 'year' ? a.year - b.year || a.title.localeCompare(b.title) : b.year - a.year || a.title.localeCompare(b.title)));
  }, [q, genre, tag, sort]);

  const setTagUrl = (t: string) => {
    sfx.toggle();
    setTag(t);
    navigate(t === 'all' ? '/games' : `/games?tag=${encodeURIComponent(t)}`, { replace: true, keepScroll: true });
  };

  return (
    <>
      <PageHero
        kicker="Game library"
        code={`${games.length} essentials`}
        title={
          <>
            The essential
            <br />
            UMD shelf.
          </>
        }
        sub="Around 1,370 games came out for the PSP. These are the ones worth knowing — the best-sellers, the system-sellers, and the cult classics that never left Japan."
      >
        <button
          type="button"
          className="gel"
          onClick={() => {
            sfx.select();
            setOpen(games[Math.floor(Math.random() * games.length)]);
          }}
        >
          <Shuffle size={16} /> Random UMD
        </button>
      </PageHero>

      <Container>
        <div className="relative md:sticky md:top-[84px] z-30 mb-8">
          <div className="chrome-rim">
            <div className="panel !rounded-[22px] p-3 md:p-4 flex flex-col gap-3">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(166_246_255/0.5)] pointer-events-none z-10" />
                  <input className="lcd-input !pl-9" placeholder="SEARCH TITLE, STUDIO…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search games" />
                </div>
                <div className="flex gap-1.5 well p-1 shrink-0 self-start md:self-auto">
                  {([
                    ['year', 'Oldest'],
                    ['year-desc', 'Newest'],
                    ['az', 'A–Z'],
                  ] as [Sort, string][]).map(([s, l]) => (
                    <button key={s} type="button" className={cx('key !py-2', sort === s && 'is-on')} onClick={() => { sfx.toggle(); setSort(s); }}>
                      {l}
                    </button>
                  ))}
                </div>
                <div className="lcd px-3 py-1.5 !rounded-[10px] flex items-baseline gap-1.5 self-start md:self-auto">
                  <span className="lcd-text text-2xl leading-none">{String(list.length).padStart(2, '0')}</span>
                  <span className="lcd-text text-sm leading-none opacity-60">UMDS</span>
                </div>
              </div>
              <div className="no-scrollbar overflow-x-auto">
                <div className="flex gap-1.5 w-max">
                  <button type="button" className={cx('key !py-1.5', tag === 'all' && 'is-on')} onClick={() => setTagUrl('all')}>
                    All
                  </button>
                  {TAGS.map((t) => (
                    <button key={t} type="button" className={cx('key !py-1.5', tag === t && 'is-on')} onClick={() => setTagUrl(tag === t ? 'all' : t)}>
                      {t}
                    </button>
                  ))}
                  <span className="w-px bg-white/10 mx-1" />
                  <button type="button" className={cx('key !py-1.5', genre === 'all' && 'is-on')} onClick={() => { sfx.toggle(); setGenre('all'); }}>
                    Any genre
                  </button>
                  {GENRES.map((g) => (
                    <button key={g} type="button" className={cx('key !py-1.5', genre === g && 'is-on')} onClick={() => { sfx.toggle(); setGenre(genre === g ? 'all' : g); }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="lcd px-6 py-14 text-center">
            <div className="lcd-text text-3xl">NO DISC</div>
            <p className="lcd-text text-lg opacity-70 mt-2">Please insert a UMD. (Nothing matches those filters.)</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {list.map((g, i) => (
              <motion.button
                key={g.title}
                type="button"
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.015, 0.4) }}
                onClick={() => {
                  sfx.select();
                  setOpen(g);
                }}
                className="group text-left self-start focus-visible:outline-none"
              >
                <div className="transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-[-2deg] group-focus-visible:ring-2 group-focus-visible:ring-[var(--accent-hi)] rounded-[14px]">
                  <UMD game={g} />
                </div>
                <div className="mt-3 text-[13px] font-semibold text-white leading-tight line-clamp-2">{g.title}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                  {g.year} · {g.genre}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </Container>

      <AnimatePresence>{open && <GameModal key={open.title} game={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </>
  );
}
