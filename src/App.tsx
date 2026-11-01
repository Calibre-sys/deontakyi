import { MotionConfig } from "motion/react";
import { Rail } from "@/components/rail";
import { Abidjan, Contact, Field, Footer, Hero, Lab, Rock, SelfTaught, Soh, Spe } from "@/components/story";
import { ViewerProvider } from "@/components/viewer";

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ViewerProvider>
        <a href="#rock" className="sr-only z-50 bg-accent px-4 py-3 text-accent-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
          Skip to the story
        </a>
        <Rail />
        <main>
          <Hero />
          <Rock />
          <Spe />
          <Field />
          <SelfTaught />
          <Lab />
          <Soh />
          <Abidjan />
          <Contact />
        </main>
        <Footer />
      </ViewerProvider>
    </MotionConfig>
  );
}
