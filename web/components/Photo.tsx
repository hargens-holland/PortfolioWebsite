"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Headshot slot. Until the real file exists in public/assets the silhouette
 * shows instead of a broken-image icon — drop the photo in and it takes over.
 */
export function Photo({
  src,
  alt,
  shape,
  caption,
}: {
  src: string;
  alt: string;
  shape: "portrait" | "square";
  caption: string;
}) {
  const [failed, setFailed] = useState(false);
  const portrait = shape === "portrait";

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

      {!failed && (
        <Image
          className="photo__img"
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 900px) 300px, 420px"
          onError={() => setFailed(true)}
        />
      )}

      {failed && <div className="photo__caption">{caption}</div>}
    </div>
  );
}
