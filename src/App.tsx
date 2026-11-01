import { MotionConfig } from "motion/react";
import { Contact, Credentials, Experience, Footer, Header, Hero, Publications, Reading, Work } from "@/components/site";
import { ViewerProvider } from "@/components/viewer";

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ViewerProvider>
        <a href="#publications" className="sr-only z-50 rounded-md bg-foreground px-4 py-2 text-background focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
          Skip to content
        </a>
        <Header />
        <main>
          <Hero />
          <Publications />
          <Work />
          <Experience />
          <Credentials />
          <Reading />
          <Contact />
        </main>
        <Footer />
      </ViewerProvider>
    </MotionConfig>
  );
}
