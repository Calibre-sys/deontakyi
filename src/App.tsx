import { MotionConfig } from "motion/react";
import { useEffect } from "react";
import { Contact, Credentials, Experience, Footer, Header, Hero, ProjectsPage, Publications, Reading, Work } from "@/components/site";
import { ViewerProvider } from "@/components/viewer";
import { COLLECTIONS } from "@/data";

export function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const collection = COLLECTIONS.find((c) => c.path === path);

  useEffect(() => {
    document.title = collection
      ? `${collection.title} · Deon Takyi-Amponsem`
      : "Deon Takyi-Amponsem · Machine learning engineer";
  }, [collection]);

  return (
    <MotionConfig reducedMotion="user">
      <ViewerProvider>
        <a href="#main" className="sr-only z-50 rounded-md bg-foreground px-4 py-2 text-background focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
          Skip to content
        </a>
        <Header />
        <main id="main">
          {collection ? (
            <ProjectsPage id={collection.id} />
          ) : (
            <>
              <Hero />
              <Publications />
              <Work />
              <Experience />
              <Credentials />
              <Reading />
              <Contact />
            </>
          )}
        </main>
        <Footer />
      </ViewerProvider>
    </MotionConfig>
  );
}
