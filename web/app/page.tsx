import { ABOUT, CONTACT, EDUCATION, HERO, LINKS, SITE, SKILLS, WORK } from "@/content/site";
import { PROJECTS, featuredProject, otherProjects } from "@/content/projects";
import { FeaturedCard, ProjectCard } from "@/components/ProjectCard";
import { RoleRotator } from "@/components/RoleRotator";
import { Reveal } from "@/components/Reveal";
import { Photo } from "@/components/Photo";

export default function HomePage() {
  const featured = featuredProject();
  const others = otherProjects();

  return (
    <>
      <header className="hero" id="top">
        <div className="hero__grid">
          <div>
            <div className="status">{HERO.statusLine}</div>

            <div className="badge">
              <span className="badge__dot" />
              {HERO.badge}
            </div>

            <p className="hero__intro">
              I&apos;m <strong>{SITE.name}</strong>
              {HERO.intro}
            </p>

            <p className="hero__building">
              Currently building <RoleRotator roles={HERO.roles} />
            </p>

            <div className="hero__actions">
              <a className="btn btn--primary" href="#work">
                See selected work →
              </a>
              <a className="btn btn--ghost" href={LINKS.resume} download>
                Download résumé (PDF)
              </a>
            </div>

            <div className="hero__chips">
              {HERO.chips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
          </div>

          <figure className="hero__photo">
            <Photo
              src="/assets/headshot-hero.jpg"
              alt={SITE.name}
              shape="portrait"
              caption="PHOTO GOES HERE · 4:5"
            />
            <figcaption>{HERO.photoCaption}</figcaption>
          </figure>
        </div>
      </header>

      {/* ------------------------------------------------------- work --- */}
      <Reveal className="section section--panel" id="work" data-section="work">
        <div className="work__head">
          <div>
            <div className="eyebrow">
              <span className="eyebrow__pad">U1</span>
              Selected work
            </div>
            <h2 className="h2">Projects I&apos;d happily be quizzed on</h2>
          </div>
          <div className="work__count">
            {String(PROJECTS.length).padStart(2, "0")} modules · click any card
          </div>
        </div>

        <FeaturedCard project={featured} />

        <div className="work__row">
          {others.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Reveal>

      {/* ------------------------------------------------- experience --- */}
      <Reveal className="section" id="experience" data-section="experience">
        <div className="eyebrow">
          <span className="eyebrow__pad">U2</span>
          Experience
        </div>
        <h2 className="h2" style={{ marginBottom: 32 }}>
          Where I&apos;ve been
        </h2>

        <div className="rule">
          <span className="rule__label">Work</span>
          <span className="rule__line" />
        </div>

        {WORK.map((role) => (
          <div className="entry" key={`${role.org}-${role.period}`}>
            <div className="entry__period">{role.period}</div>
            <div>
              <div className="entry__head">
                <h3>{role.role}</h3>
                <span className="entry__org">{role.org}</span>
              </div>
              <p className="entry__detail">{role.detail}</p>
            </div>
          </div>
        ))}

        <div className="rule rule--quiet">
          <span className="rule__label">Education</span>
          <span className="rule__line" />
        </div>

        <div className="entry entry--boxed">
          <div className="entry__period">{EDUCATION.period}</div>
          <div>
            <div className="entry__head">
              <h3>{EDUCATION.role}</h3>
              <span className="entry__org">{EDUCATION.org}</span>
            </div>
            <p className="entry__detail">{EDUCATION.detail}</p>
          </div>
        </div>
      </Reveal>

      {/* ----------------------------------------------------- skills --- */}
      <Reveal className="section section--panel" id="skills" data-section="skills">
        <div className="eyebrow">
          <span className="eyebrow__pad">U3</span>
          Toolkit
        </div>
        <h2 className="h2">What I reach for</h2>

        <div className="toolkit">
          {SKILLS.map((group) => (
            <div className="toolgroup" key={group.title}>
              <div className="toolgroup__title">{group.title}</div>
              <div className="chips">
                {group.items.map((item) => (
                  <span className="chip" key={item}>
                    <i className="chip__mark" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ------------------------------------------------------ about --- */}
      <Reveal className="section" id="about" data-section="about">
        <div className="about__grid">
          <Photo
            src="/assets/headshot-about.jpg"
            alt={SITE.name}
            shape="square"
            caption="ABOUT PHOTO · 1:1"
          />
          <div className="about__body">
            <div className="eyebrow">
              <span className="eyebrow__pad">U4</span>
              About
            </div>
            <h2 className="h2">{ABOUT.heading}</h2>
            {ABOUT.paragraphs.map((text) => (
              <p key={text.slice(0, 24)}>{text}</p>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ---------------------------------------------------- contact --- */}
      <Reveal className="section" id="contact" data-section="contact">
        <div className="contact__grid">
          <div>
            <div className="eyebrow">
              <span className="eyebrow__pad">J1</span>
              Contact
            </div>
            <h2 className="h2 h2--lg">{CONTACT.heading}</h2>
            <p className="contact__blurb">{CONTACT.blurb}</p>
          </div>

          <div className="contact__actions">
            <a className="contact__btn contact__btn--primary" href={`mailto:${SITE.email}`}>
              {SITE.email} <span>→</span>
            </a>
            <a className="contact__btn contact__btn--ghost" href={LINKS.resume} download>
              Résumé — PDF <span>↓</span>
            </a>
            <a
              className="contact__btn contact__btn--ghost"
              href={LINKS.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub <span>↗</span>
            </a>
            {LINKS.linkedin && (
              <a
                className="contact__btn contact__btn--ghost"
                href={LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn <span>↗</span>
              </a>
            )}
          </div>
        </div>
      </Reveal>
    </>
  );
}
