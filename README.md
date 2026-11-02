# deontakyi — portfolio

Personal site of Deon Takyi-Amponsem. Built with Vite, React, Tailwind CSS v4 and Motion, with components adapted from [beUI](https://beui.dev) (MIT): Arc Picker, Card, Theme Toggle and Action Swap. Tools hang off the work they were used for (`src/components/tools.tsx`). Page sections live in `src/components/site.tsx`.

```bash
npm install
npm run dev      # local preview
npm run build    # production build in dist/
```

## Editing content

All text lives in `src/data.ts`: papers, certificates, projects, books, experience, events and contact details.

- **Add a book:** add an entry to `BOOKS` with its ISBN. The cover is fetched from Open Library. To use your own image, put it in `public/books/` and set `cover: "/books/name.jpg"`.
- **Add a certificate:** put the PDF in `public/evidence/` and a preview image in `public/evidence/previews/` (for example `pdftoppm -f 1 -l 1 -r 110 -jpeg -singlefile cert.pdf preview`), then add it to `CERTS`.
- **Add a project demo:** put the video in `public/media/` and set `video` on the project.
