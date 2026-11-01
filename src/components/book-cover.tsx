import { useState } from "react";
import type { Book } from "@/data";
import { cn } from "@/lib/utils";

/** A book cover: the local image if set, then Open Library by ISBN, then a cover set in type. */
export function BookCover({ book, className, eager }: { book: Book; className?: string; eager?: boolean }) {
  const sources = [book.cover, `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`].filter(Boolean) as string[];
  const [attempt, setAttempt] = useState(0);
  const src = sources[attempt];

  return (
    <div className={cn("relative aspect-[2/3]", className)}>
      {src ? (
        <img
          src={src}
          alt={`Cover of ${book.title} by ${book.author}`}
          loading={eager ? "eager" : "lazy"}
          onError={() => setAttempt((n) => n + 1)}
          onLoad={(event) => {
            // Open Library can answer with a 1px placeholder instead of an error.
            if (event.currentTarget.naturalWidth < 20) setAttempt((n) => n + 1);
          }}
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full flex-col justify-between p-[9%]" style={{ background: book.tint[0], color: book.tint[1] }}>
          <span className="font-display text-[clamp(1rem,1.6vw,1.6rem)] leading-[1] font-extrabold tracking-[-0.02em]">{book.title}</span>
          <span className="text-[0.8125rem] leading-snug">{book.author}</span>
        </div>
      )}
    </div>
  );
}
