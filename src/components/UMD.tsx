import type { Game } from '../data/games';
import { hashOf } from '../lib/catalog';

const GENRE_HUE: Record<string, number> = {
  Action: 8,
  'Action RPG': 28,
  RPG: 268,
  Tactics: 210,
  Racing: 190,
  Puzzle: 300,
  Rhythm: 325,
  Platformer: 110,
  Shooter: 0,
  Fighting: 350,
  Stealth: 150,
  Adventure: 40,
  Sports: 95,
};

export function gameHue(g: Game) {
  return (GENRE_HUE[g.genre] ?? 200) + ((hashOf(g.title) % 40) - 20);
}

export function UMD({ game, size = 'md' }: { game: Game; size?: 'md' | 'lg' }) {
  const h = gameHue(game);
  const angle = hashOf(game.title) % 360;
  return (
    <div className="umd w-full">
      <div
        className="umd-label"
        style={{
          background: `linear-gradient(135deg, hsl(${h} 80% 62%), hsl(${h + 30} 75% 42%) 60%, hsl(${h + 50} 70% 28%))`,
          boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.45), inset 0 0 0 1px rgb(0 0 0 / 0.25)',
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: `repeating-linear-gradient(${angle}deg, rgb(255 255 255 / 0.18) 0 2px, transparent 2px 9px)` }}
        />
        <div className="relative flex h-full flex-col justify-between">
          <span
            className={`font-psp leading-[1.02] text-white line-clamp-2 ${size === 'lg' ? 'text-[22px]' : 'text-[12.5px]'}`}
            style={{ textShadow: '0 1px 2px rgb(0 0 0 / 0.5)' }}
          >
            {game.title}
          </span>
          <span className={`font-mono uppercase tracking-[0.18em] text-white/80 ${size === 'lg' ? 'text-[11px]' : 'text-[8px]'}`}>UMD · {game.year}</span>
        </div>
      </div>
      <div className="umd-window">
        <div className="umd-disc" style={{ ['--a' as string]: `${angle}deg` }} />
      </div>
      {/* little shutter notch */}
      <span className="absolute right-[6%] bottom-[44%] w-[5%] h-[3%] rounded-full bg-black/60" />
    </div>
  );
}
