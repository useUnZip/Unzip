import { Navbar } from "@/components/cansa/Navbar";
import { ScrollRail } from "@/components/cansa/ScrollRail";
import { Hero } from "@/components/cansa/Hero";
import { ProblemSection } from "@/components/cansa/ProblemSection";
import { DefinitionSection } from "@/components/cansa/DefinitionSection";
import { InsideSection } from "@/components/cansa/InsideSection";
import { WorkspaceSection } from "@/components/cansa/WorkspaceSection";
import { AudienceSection } from "@/components/cansa/AudienceSection";
import { HowItWorks } from "@/components/cansa/HowItWorks";
import { CtaSection, Footer } from "@/components/cansa/CtaSection";

const Index = () => {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <ScrollRail />
      <Hero />
      <ProblemSection />
      <DefinitionSection />
      <InsideSection />
      <WorkspaceSection />
      <AudienceSection />
      <HowItWorks />
      <CtaSection />
      <Footer />
    </main>
  );
};

export default Index;
