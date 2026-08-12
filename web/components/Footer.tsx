import { LINKS, SITE } from "@/content/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__credit">
        © {SITE.copyrightYear} {SITE.name} · {SITE.revision}
      </div>
      <div className="footer__links">
        <a className="ul" href={LINKS.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        {/* Empty string in content/site.ts hides this — dead links are worse than none. */}
        {LINKS.linkedin && (
          <a className="ul" href={LINKS.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}
        <a className="ul" href={`mailto:${SITE.email}`}>
          Email
        </a>
      </div>
    </footer>
  );
}
