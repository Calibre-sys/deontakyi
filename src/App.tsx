import { MotionConfig } from "motion/react";
import { Certificates, Contact, Events, Experience, Footer, Hero, Intro, Reading, Research, TopBar, Work } from "@/components/sections";
import { Stage, StageProvider } from "@/components/stage";
import { ViewerProvider } from "@/components/viewer";

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ViewerProvider>
        <StageProvider>
          <a href="#research" className="sr-only z-50 bg-accent px-4 py-3 text-accent-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
            Skip to the research
          </a>
          <div className="lg:grid lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)]">
            <div className="min-w-0">
              <TopBar />
              <main>
                <Hero />
                <Intro />
                <Research />
                <Certificates />
                <Work />
                <Reading />
                <Experience />
                <Events />
                <Contact />
              </main>
            </div>
            <aside aria-label="Pictures for the section in view">
              <Stage />
            </aside>
          </div>
          <Footer />
        </StageProvider>
      </ViewerProvider>
    </MotionConfig>
  );
}
