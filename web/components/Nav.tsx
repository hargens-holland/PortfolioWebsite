"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_SECTIONS, SITE } from "@/content/site";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <Link className="nav__brand" href="/">
          {SITE.name}
        </Link>

        <div className="nav__links">
          {NAV_SECTIONS.map((item) => (
            <Link key={item.href} className="nav__link ul" href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="nav__cta" href="/#contact">
            Get in touch
          </Link>
        </div>

        <button
          className="nav__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="nav-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <div className="nav__mobile" id="nav-mobile">
          {NAV_SECTIONS.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href="/#contact" onClick={() => setOpen(false)}>
            Get in touch
          </Link>
        </div>
      )}
    </>
  );
}
