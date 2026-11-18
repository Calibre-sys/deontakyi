import { MotionConfig } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { About, Credentials, Experience, Footer, Header, Hero, MapSection, Moments, ProjectsPage, Publications, Work } from "@/components/site";
import { PageLoader } from "@/components/page-loader";
import { ViewerProvider } from "@/components/viewer";
import { COLLECTIONS } from "@/data";
import { startScramble } from "@/lib/scramble";

export function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const collection = COLLECTIONS.find((c) => c.path === path);
  const [booted, setBooted] = useState(false);
  const onBooted = useCallback(() => setBooted(true), []);

  useEffect(() => {
    document.title = collection
      ? `${collection.title}, Deon Takyi-Amponsem`
      : "Deon Takyi-Amponsem";
  }, [collection]);

  // The text on screen decodes once, as the boot screen leaves.
  useEffect(() => {
    if (!booted) return;
    return startScramble(document.body);
  }, [booted]);

  return (
    <MotionConfig reducedMotion="user">
      <ViewerProvider>
        <PageLoader onDone={onBooted} />
        <a href="#main" className="sr-only z-50 bg-foreground px-4 py-2 text-background focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
          Skip to content
        </a>
        <Header />
        <main id="main">
          {collection ? (
            <ProjectsPage id={collection.id} />
          ) : (
            <>
              <Hero />
              <About />
              <MapSection />
              <Work />
              <Publications />
              <Experience />
              <Credentials />
              <Moments />
            </>
          )}
        </main>
        <Footer />
      </ViewerProvider>
    </MotionConfig>
  );
}
