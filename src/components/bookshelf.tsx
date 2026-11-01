import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { type Book, SHELVES } from "@/data";
import { EASE_OUT } from "@/lib/ease";
import { Reveal, Section, Serif } from "./ui";

export function Bookshelf() {
  const total = SHELVES.reduce((sum, shelf) => sum + shelf.books.length, 0);
  return (
    <Section
      id="bookshelf"
      index="04"
      eyebrow="Bookshelf"
      title={
        <>
          What I've been <Serif>reading.</Serif>
        </>
      }
      intro={`I didn't learn this in a classroom. These ${total} books shaped how I build models and how I think about the work.`}
    >
      <div className="grid gap-14">
        {SHELVES.map((shelf) => (
          <Reveal key={shelf.id}>
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold tracking-tight">{shelf.title}</h3>
              <p className="text-sm text-muted-foreground">{shelf.caption}</p>
            </div>
            <div className="relative">
              <ul className="relative z-10 flex flex-wrap items-start gap-x-8 gap-y-12 px-2 sm:gap-x-12 sm:px-6">
                {shelf.books.map((book, i) => (
                  <li key={book.id}>
                    <BookCover book={book} delay={i * 0.08} />
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function BookCover({ book, delay }: { book: Book; delay: number }) {
  const reduce = useReducedMotion();
  const sources = [book.cover, `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`].filter(
    Boolean,
  ) as string[];
  const [attempt, setAttempt] = useState(0);
  const src = sources[attempt];

  return (
    <motion.figure
      className="group w-36 sm:w-44"
      initial={reduce ? false : { opacity: 0, y: 30, rotateX: 20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
    >
      <div className="[perspective:900px]">
        <div className="relative transition-transform duration-500 ease-[var(--ease-out)] [transform-style:preserve-3d] [transform:rotateY(-18deg)] group-hover:[transform:rotateY(-4deg)_translateY(-14px)] motion-reduce:transition-none">
          {/* Page block peeking out to the right. */}
          <div
            aria-hidden
            className="absolute inset-y-[3px] right-0 w-5 translate-x-[14px] rounded-r-sm bg-[repeating-linear-gradient(90deg,#f6f3ea_0_1px,#e3ddce_1px_2px)] [transform:rotateY(90deg)] [transform-origin:left]"
          />
          <div className="relative aspect-[2/3] overflow-hidden rounded-r-md rounded-l-sm shadow-[12px_18px_30px_-12px_rgb(0_0_0/0.55)]">
            {src ? (
              <img
                src={src}
                alt={`Cover of ${book.title} by ${book.author}`}
                loading="lazy"
                onError={() => setAttempt((n) => n + 1)}
                onLoad={(event) => {
                  // Open Library may answer with a tiny placeholder instead of a 404.
                  if (event.currentTarget.naturalWidth < 20) setAttempt((n) => n + 1);
                }}
                className="size-full object-cover"
              />
            ) : (
              <MadeCover book={book} />
            )}
            {/* Spine crease and sheen. */}
            <span aria-hidden className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/35 via-white/10 to-transparent" />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        </div>
      </div>
      {/* Contact shadow, so the book sits on a surface. */}
      <div aria-hidden className="mx-auto mt-2 h-3 w-[90%] rounded-[50%] bg-black/25 blur-md transition-all duration-500 group-hover:w-[70%] group-hover:opacity-60 dark:bg-black/70" />
      <figcaption className="mt-4">
        <p className="text-sm font-semibold leading-snug">{book.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{book.author}</p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{book.note}</p>
      </figcaption>
    </motion.figure>
  );
}

/** A typographic cover for when no image is available. */
function MadeCover({ book }: { book: Book }) {
  const [bg, ink] = book.tint;
  return (
    <div className="flex size-full flex-col justify-between p-3.5" style={{ background: bg, color: ink }}>
      <span className="text-[17px] font-bold leading-[1.05] tracking-tight">{book.title}</span>
      {book.subtitle && <span className="text-[10px] leading-snug opacity-80">{book.subtitle}</span>}
      <span className="font-mono text-[10px] uppercase tracking-wider opacity-80">{book.author}</span>
    </div>
  );
}
