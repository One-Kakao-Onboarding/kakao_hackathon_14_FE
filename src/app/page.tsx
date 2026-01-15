import HeroSection from '@/components/HeroSection';
import TutorialCarousel from '@/components/TutorialCarousel';
import SectionFilter from '@/components/SectionFilter';
import UploadSection from '@/components/sections/UploadSection';
import AIResultSection from '@/components/sections/AIResultSection';
import ProductsSection from '@/components/sections/ProductsSection';
import VotingSection from '@/components/sections/VotingSection';
import ScheduleSection from '@/components/sections/ScheduleSection';
import MychatList from '@/components/home/MychatList';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TutorialCarousel />
      <SectionFilter />
      <div className="w-[1280px] mx-auto">
        <UploadSection />
        <AIResultSection />
        <ProductsSection />
        <VotingSection />
        <ScheduleSection />

        <section id="projects" className="py-16">
          <MychatList />
        </section>
      </div>
    </>
  );
}
