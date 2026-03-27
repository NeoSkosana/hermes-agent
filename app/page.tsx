import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { ToolsSection } from "@/components/tools-section";
import { Platforms } from "@/components/platforms";
import { CodePreview } from "@/components/code-preview";
import { RLTraining } from "@/components/rl-training";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ArchitectureDiagram />
      <section id="tools">
        <ToolsSection />
      </section>
      <section id="platforms">
        <Platforms />
      </section>
      <CodePreview />
      <section id="training">
        <RLTraining />
      </section>
      <Footer />
    </main>
  );
}
