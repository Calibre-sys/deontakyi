import { MotionConfig } from "motion/react";
import { Bookshelf } from "@/components/bookshelf";
import { Certifications } from "@/components/certifications";
import { Contact } from "@/components/contact";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Journey } from "@/components/journey";
import { Moments } from "@/components/moments";
import { Research } from "@/components/research";
import { ViewerProvider } from "@/components/viewer";
import { Work } from "@/components/work";

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ViewerProvider>
        <a
          href="#research"
          className="sr-only z-[70] rounded-full bg-foreground px-4 py-2 text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Header />
        <main>
          <Hero />
          <Research />
          <Certifications />
          <Work />
          <Bookshelf />
          <Journey />
          <Moments />
          <Contact />
        </main>
      </ViewerProvider>
    </MotionConfig>
  );
}
