import { useEffect, useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react';

// Tiny History-API router. Vercel rewrites every path to index.html (see vercel.json).

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', emit);
}

export function scrollToHash(hash: string, smooth = true) {
  const id = hash.replace(/^#/, '');
  if (!id) return;
  // Wait for the new route to render before looking for the anchor
  let tries = 0;
  const attempt = () => {
    const el = document.getElementById(id);
    // scrollIntoView honours each target's scroll-margin-top (set for the fixed nav)
    if (el) el.scrollIntoView({ behavior: smooth ? 'smooth' : ('instant' as ScrollBehavior), block: 'start' });
    else if (tries++ < 180) requestAnimationFrame(attempt);
  };
  requestAnimationFrame(attempt);
}

export function navigate(to: string, opts: { replace?: boolean; keepScroll?: boolean } = {}) {
  const [pathAndSearch, hash] = to.split('#');
  const current = window.location.pathname + window.location.search;
  if (pathAndSearch === current || pathAndSearch === '') {
    if (hash) {
      window.history.replaceState({}, '', to);
      scrollToHash(hash);
    }
    return;
  }
  if (opts.replace) window.history.replaceState({}, '', to);
  else window.history.pushState({}, '', to);
  if (!opts.keepScroll) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  emit();
  if (hash) scrollToHash(hash, false);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function usePath() {
  return useSyncExternalStore(subscribe, () => window.location.pathname, () => '/');
}

export function useSearch() {
  return useSyncExternalStore(subscribe, () => window.location.search, () => '');
}

/** Match `/models/:id` style patterns. Returns params or null. */
export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split('/').filter(Boolean);
  const s = path.replace(/\/+$/, '').split('/').filter(Boolean);
  if (p.length !== s.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(s[i]);
    else if (p[i] !== s[i]) return null;
  }
  return params;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, onClick, ...rest }: LinkProps) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target && rest.target !== '_self') return;
    e.preventDefault();
    navigate(to);
  };
  return <a href={to} onClick={handle} {...rest} />;
}

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · PSP Archive` : 'PSP Archive — The PlayStation Portable, catalogued';
  }, [title]);
}
