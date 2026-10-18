import { useRef, useState } from "react";
import { BadgeMaker } from "./BadgeMaker";
import { Dog } from "./Dog";

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={down ? "arrow arrow-down" : "arrow"}
    >
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  );
}

function DogMark() {
  return (
    <svg viewBox="0 0 68 40" aria-hidden="true">
      <path
        d="M17 28V13l-8-1q-7-1-6-5l10-3q8-1 11 10l3 6h27q8 0 8 7v9h-7v-8H25v8h-8z"
        fill="currentColor"
      />
      <path
        d="M60 22q8-5 5-15"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M17 7q9 0 8 13-5 8-9-1z" fill="#f6e884" />
      <circle cx="11" cy="8" r="1.4" fill="#f6e884" />
    </svg>
  );
}

function Flower({ last = false }: { last?: boolean }) {
  return (
    <svg
      className={`strip-flower ${last ? "strip-last" : ""}`}
      viewBox="0 0 50 50"
      aria-hidden="true"
    >
      <path
        d="M25 2c8 0 7 11 7 15 5-6 12-10 16-3 4 7-6 12-10 14 8 0 15 4 11 11-4 7-13 0-17-3 4 8 0 15-7 12-7 3-11-4-7-12-4 3-13 10-17 3-4-7 3-11 11-11-4-2-14-7-10-14 4-7 11-3 16 3 0-4-1-15 7-15Z"
        fill="currentColor"
      />
    </svg>
  );
}

const faq = [
  [
    "Wait, what is Big Weenies Unite?",
    "A playful little corner of the internet for dachshund people. We celebrate the long dogs, the big personalities, and the humans who are completely obsessed with them. Make a badge and wear your weenie pride.",
  ],
  [
    "Do I need a dachshund to belong?",
    "Absolutely not. Dachshund owners, honorary dog aunts, future weenie parents, and people who just point at every long dog on the street: you’re all welcome here.",
  ],
  [
    "Is the badge really free?",
    "As free as a dog hair on your sweater. Add a name, pick a coat and a job title, then download your badge as an SVG image. No account, email, or payment needed.",
  ],
  [
    "Where does my information go?",
    "Nowhere. The badge is made right in your browser. Names and choices stay in the current tab and disappear when you refresh. There’s no member database or mailing list.",
  ],
];

export function App() {
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const badgeTrigger = useRef<HTMLElement | null>(null);

  function openBadge(event: React.MouseEvent<HTMLButtonElement>) {
    badgeTrigger.current = event.currentTarget;
    setBadgeOpen(true);
    setMenuOpen(false);
  }

  function closeBadge() {
    setBadgeOpen(false);
    requestAnimationFrame(() => badgeTrigger.current?.focus());
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="hero-shell" id="top">
        <header className="site-header container">
          <a
            className="wordmark"
            href="#top"
            aria-label="Big Weenies Unite home"
          >
            <DogMark />
            <span>
              big weenies
              <br />
              unite<span className="logo-dot">.</span>
            </span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#the-club">The club</a>
            <a href="#weenie-energy">Weenie energy</a>
            <a href="#questions">FAQs</a>
          </nav>
          <button
            className="button button-outline header-cta"
            type="button"
            onClick={openBadge}
          >
            Make a badge <Arrow />
          </button>
          <button
            className="icon-button menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen ? (
                <path d="m5 5 14 14M19 5 5 19" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </header>
        {menuOpen && (
          <nav
            id="mobile-navigation"
            className="mobile-nav container"
            aria-label="Mobile navigation"
          >
            <a href="#the-club" onClick={() => setMenuOpen(false)}>
              The club <Arrow />
            </a>
            <a href="#weenie-energy" onClick={() => setMenuOpen(false)}>
              Weenie energy <Arrow />
            </a>
            <a href="#questions" onClick={() => setMenuOpen(false)}>
              FAQs <Arrow />
            </a>
          </nav>
        )}
        <main id="main">
          <section className="hero container" aria-labelledby="hero-title">
            <div className="hero-copy">
              <h1 id="hero-title">
                Big weenies
                <br />
                unite<span className="heading-dot">.</span>
              </h1>
              <p className="hero-description">
                A little club for long dogs
                <br className="desktop-break" /> and the people who love them.
              </p>
              <button
                className="button button-primary"
                type="button"
                onClick={openBadge}
              >
                Make your club badge <Arrow />
              </button>
              <p className="hero-note">
                No signups, just a little weenie pride.
              </p>
            </div>
            <div
              className="hero-art"
              role="img"
              aria-label="A very long cinnamon dachshund wearing a yellow bandana, surrounded by playful stars."
            >
              <div className="art-sun" />
              <svg
                className="art-spark spark-one"
                viewBox="0 0 60 60"
                aria-hidden="true"
              >
                <path
                  d="M30 0c3 21 9 27 30 30-21 3-27 9-30 30C27 39 21 33 0 30 21 27 27 21 30 0"
                  fill="currentColor"
                />
              </svg>
              <svg
                className="art-spark spark-two"
                viewBox="0 0 60 60"
                aria-hidden="true"
              >
                <path
                  d="M30 0c3 21 9 27 30 30-21 3-27 9-30 30C27 39 21 33 0 30 21 27 27 21 30 0"
                  fill="currentColor"
                />
              </svg>
              <Dog className="hero-dog" />
              <svg
                className="art-caption"
                viewBox="0 0 190 145"
                aria-hidden="true"
              >
                <g transform="rotate(8 90 60)">
                  <text
                    x="17"
                    y="47"
                    fontFamily="Bricolage Grotesque, sans-serif"
                    fontSize="23"
                    fontWeight="800"
                    fill="#582d23"
                  >
                    100% weenie.
                  </text>
                  <text
                    x="26"
                    y="74"
                    fontFamily="Bricolage Grotesque, sans-serif"
                    fontSize="23"
                    fontWeight="800"
                    fill="#582d23"
                  >
                    0% apologies.
                  </text>
                  <path
                    d="M80 86q25 56-35 43m8-13-13 13 17 5"
                    fill="none"
                    stroke="#582d23"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              <div className="art-ground">
                <span />
              </div>
            </div>
            <a href="#the-club" className="hero-scroll">
              A little more about us <Arrow down />
            </a>
          </section>
          <div className="belief-strip" aria-label="Club values">
            <div className="container">
              <span>Little legs</span>
              <Flower />
              <span>Big personalities</span>
              <Flower />
              <span>Even bigger love</span>
              <Flower last />
            </div>
          </div>
          <section
            className="club-section section container"
            id="the-club"
            aria-labelledby="club-title"
          >
            <div className="club-illustration">
              <div className="club-stamp" aria-hidden="true">
                <svg viewBox="0 0 320 320">
                  <defs>
                    <path
                      id="circle-text"
                      d="M160,160 m-113,0 a113,113 0 1,1 226,0 a113,113 0 1,1 -226,0"
                    />
                  </defs>
                  <circle
                    cx="160"
                    cy="160"
                    r="151"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="160"
                    cy="160"
                    r="100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <text
                    fontSize="25"
                    fontFamily="Bricolage Grotesque, sans-serif"
                    fontWeight="800"
                    fill="currentColor"
                  >
                    <textPath href="#circle-text" startOffset="1%">
                      Long dog appreciation society · Everyone is welcome ·
                    </textPath>
                  </text>
                  <path
                    d="M160 211c-12-17-74-53-74-89 0-34 48-45 74-8 26-37 74-26 74 8 0 36-62 72-74 89"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="stamp-note">You found your people.</div>
            </div>
            <div className="club-copy">
              <h2 id="club-title">
                Long dogs.
                <br />A longer love story.
              </h2>
              <p>
                Some people see a dog. You see a tiny, stubborn soulmate with a
                suspiciously long middle.
              </p>
              <p>
                We get it. This is a place for the blanket burrowers, the snack
                negotiators, and the people who wouldn’t have it any other way.
              </p>
              <a className="text-link" href="#weenie-energy">
                Find your kind of weenie <Arrow />
              </a>
            </div>
          </section>
          <section
            className="energy-section section"
            id="weenie-energy"
            aria-labelledby="energy-title"
          >
            <div className="container">
              <div className="section-heading">
                <h2 id="energy-title">It’s a weenie thing.</h2>
                <p>Different personalities. The same big dog energy.</p>
              </div>
              <div className="energy-grid">
                <article className="energy-item">
                  <div className="energy-art art-peach">
                    <Dog coat="cinnamon" pose="play" />
                    <svg
                      className="small-spark"
                      viewBox="0 0 50 50"
                      aria-hidden="true"
                    >
                      <path
                        d="m25 0 5 20 20 5-20 5-5 20-5-20L0 25l20-5z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <h3>The tiny adventurer</h3>
                  <p>
                    Four-inch legs. A five-mile agenda. Every walk is a very
                    important expedition.
                  </p>
                </article>
                <article className="energy-item">
                  <div className="energy-art art-lilac">
                    <Dog coat="chocolate" pose="sleep" />
                  </div>
                  <h3>The blanket burrower</h3>
                  <p>
                    If there’s a blanket, there’s a weenie under it. Personal
                    space is a shared concept.
                  </p>
                </article>
                <article className="energy-item">
                  <div className="energy-art art-yellow">
                    <Dog coat="midnight" />
                    <svg
                      className="snack"
                      viewBox="0 0 80 80"
                      aria-hidden="true"
                    >
                      <path
                        d="M20 40c-23-8-14-30-1-25 6-16 24-12 24 2l18 27c13 0 17 17 4 22-5 14-25 10-25-4z"
                        fill="#fff8e8"
                        stroke="#582d23"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <h3>The snack supervisor</h3>
                  <p>
                    Always on duty. Especially when a cheese wrapper opens three
                    rooms away.
                  </p>
                </article>
              </div>
            </div>
          </section>
          <section
            className="badge-banner container"
            aria-labelledby="banner-title"
          >
            <div>
              <h2 id="banner-title">You’re one of us.</h2>
              <p>Make it official-ish with a badge for your favorite weenie.</p>
              <button
                type="button"
                className="button button-light"
                onClick={openBadge}
              >
                Make my weenie badge <Arrow />
              </button>
            </div>
            <div className="banner-emblem" aria-hidden="true">
              <DogMark />
              <span>
                Long dog.
                <br />
                Lifelong fan.
              </span>
              <svg viewBox="0 0 60 60">
                <path
                  d="m30 0 6 22 21-8-16 18 16 18-21-8-6 18-6-18-21 8 16-18L3 14l21 8z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </section>
          <section
            className="faq-section section container"
            id="questions"
            aria-labelledby="faq-title"
          >
            <div className="faq-intro">
              <h2 id="faq-title">
                A few long
                <br />
                answers.
              </h2>
              <p>
                Get to know this little club
                <br className="desktop-break" /> and its badge maker.
              </p>
              <DogMark />
            </div>
            <div className="faq-list">
              {faq.map(([question, answer]) => (
                <details key={question}>
                  <summary>
                    {question}
                    <span className="faq-plus" aria-hidden="true" />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>
        </main>
      </div>
      <footer className="site-footer">
        <div className="container footer-content">
          <a
            className="wordmark footer-wordmark"
            href="#top"
            aria-label="Big Weenies Unite home"
          >
            <DogMark />
            <span>
              big weenies
              <br />
              unite.
            </span>
          </a>
          <p>Made for the long dogs and their people.</p>
          <a className="text-link" href="#top">
            Back to top <Arrow down />
          </a>
        </div>
        <div className="container footer-bottom">
          <span>A little fan club. A whole lot of love.</span>
          <span>No signups. Just weenies.</span>
        </div>
      </footer>
      <BadgeMaker open={badgeOpen} onClose={closeBadge} />
    </>
  );
}
