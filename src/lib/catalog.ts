import { pspData, type PSPModel } from '../data';
import { slugify } from '../utils';
import blobManifest from '../blob-manifest.json';

const manifest = blobManifest as Record<string, string[]>;

export type Colorway = {
  key: string; // `${modelId}/${slug}`
  slug: string;
  model: PSPModel;
  color: PSPModel['colors'][number];
  family: string;
  front?: string;
  back?: string;
  images: string[];
};

export const FAMILIES = ['black', 'white', 'silver', 'blue', 'red', 'pink', 'purple', 'green', 'yellow', 'gold', 'bronze'] as const;

const FAMILY_WORDS: [string, string[]][] = [
  ['pink', ['pink', 'rose', 'blossom', 'akb']],
  ['purple', ['purple', 'lavender', 'lilac']],
  ['green', ['green', 'mint', 'turquoise', 'miku', 'peace walker', 'portable ops']],
  ['yellow', ['yellow', 'simpsons']],
  ['gold', ['gold', 'champagne']],
  ['bronze', ['bronze', 'monster hunter portable 2nd']],
  ['red', ['red', 'coca', 'spider', 'chains of olympus', 'gundam giren']],
  ['silver', ['silver', 'final fantasy vii', 'gundam vs', 'kingdom']],
  ['blue', ['blue']],
  ['white', ['white', 'star wars', 'dissidia', 'uta no']],
  ['black', ['black', 'signature', 'ghost of sparta', 'gran turismo', 'one piece', 'winning']],
];

function familyOf(name: string, hex: string) {
  const n = name.toLowerCase();
  for (const [fam, words] of FAMILY_WORDS) if (words.some((w) => n.includes(w))) return fam;
  const v = parseInt(hex.slice(1), 16);
  const l = ((v >> 16) & 255) + ((v >> 8) & 255) + (v & 255);
  return l < 120 ? 'black' : l > 680 ? 'white' : 'silver';
}

function sortImages(urls: string[]) {
  return [...urls].sort((a, b) => {
    const rank = (u: string) => (u.includes('/front') ? 0 : u.includes('/back') ? 1 : 2);
    return rank(a) - rank(b);
  });
}

export const colorways: Colorway[] = pspData.flatMap((model) =>
  model.colors.map((color) => {
    const slug = slugify(color.name);
    const key = `${model.id}/${slug}`;
    const fromBlob = manifest[key] ? sortImages(manifest[key]) : [];
    const images = fromBlob.length ? fromBlob : ([color.imageUrl, color.backImageUrl].filter(Boolean) as string[]);
    const front = fromBlob.find((u) => u.includes('/front')) ?? fromBlob[0] ?? color.imageUrl;
    const back = fromBlob.find((u) => u.includes('/back')) ?? color.backImageUrl;
    return { key, slug, model, color, family: familyOf(color.name, color.hex), front, back, images };
  }),
);

export function findColorway(modelId: string, slug: string) {
  return colorways.find((c) => c.model.id === modelId && c.slug === slug);
}

export function colorwaysFor(modelId: string) {
  return colorways.filter((c) => c.model.id === modelId);
}

export function heroImage(modelId: string, slug: string) {
  return findColorway(modelId, slug)?.front;
}

export const stats = {
  colorways: colorways.length,
  limited: colorways.filter((c) => c.color.type === 'limited').length,
  standard: colorways.filter((c) => c.color.type === 'standard').length,
  images: colorways.reduce((n, c) => n + c.images.length, 0),
};

/** Deterministic pseudo-random from a string, for stable per-item decoration. */
export function hashOf(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
