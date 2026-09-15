"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Headshot slot.
 *
 * `src` is undefined when the file isn't in public/assets (decided at build
 * time by lib/assets.ts), and the silhouette renders on its own — no request
 * for a missing image, no broken-image icon. Drop the photo in and rebuild;
 * it takes over. The onError fallback is belt-and-braces for a file that
 * exists at build time but fails to load in the browser.
 */
export function Photo({
  src,
  alt,
  shape,
}: {
  src?: string;
  alt: string;
  shape: "portrait" | "square";
}) {
  const [failed, setFailed] = useState(false);
  const portrait = shape === "portrait";
  const showImage = src !== undefined && !failed;

  return (
    <div className={`photo photo--${shape}`}>
      <svg
        className="photo__placeholder"
        viewBox={portrait ? "0 0 400 500" : "0 0 400 400"}
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        {portrait ? (
          <>
            <circle cx={200} cy={196} r={76} fill="#18271D" />
            <path
              d="M200 296c-79 0-134 47-142 122-2 18-3 60-3 82h290c0-22-1-64-3-82-8-75-63-122-142-122z"
              fill="#18271D"
            />
          </>
        ) : (
          <>
            <circle cx={200} cy={152} r={62} fill="#18271D" />
            <path
              d="M200 232c-66 0-112 39-119 102-1 12-2 46-2 66h242c0-20-1-54-2-66-7-63-53-102-119-102z"
              fill="#18271D"
            />
          </>
        )}
      </svg>

      {showImage && (
        <Image
          className="photo__img"
          src={src}
          alt={alt}
          fill
          priority={portrait}
          sizes="(max-width: 900px) 300px, 420px"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
