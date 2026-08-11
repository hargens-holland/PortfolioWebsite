import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="eyebrow">
        <span className="eyebrow__pad">E4</span>
        404
      </div>
      <h1 className="h2 h2--lg">No continuity.</h1>
      <p className="contact__blurb">
        That page isn&apos;t on the board. The trace probably went somewhere else.
      </p>
      <div className="hero__actions">
        <Link className="btn btn--primary" href="/">
          Back to the homepage →
        </Link>
      </div>
    </section>
  );
}
