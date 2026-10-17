import { Container } from '../components/ui';
import { Link, useTitle } from '../router';

export function NotFound() {
  useTitle('Page not found');
  return (
    <Container className="pt-40 pb-10">
      <div className="chrome-rim max-w-2xl mx-auto">
        <div className="lcd !rounded-[22px] p-8 md:p-12 text-center">
          <div className="lcd-text text-xl opacity-60">ERROR (80020148)</div>
          <h1 className="lcd-text text-4xl md:text-6xl leading-none mt-4">THE PAGE COULD NOT BE STARTED.</h1>
          <p className="lcd-text text-xl opacity-75 mt-6">This link doesn’t point to anything in the archive.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 relative z-10">
            <Link to="/" className="gel">
              ✕ Return to XMB
            </Link>
            <Link to="/colors" className="gel gel-chrome">
              Browse colourways
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
