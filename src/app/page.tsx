'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import TutorialCarousel from '@/components/TutorialCarousel';
import SectionFilter from '@/components/SectionFilter';
import UploadSection from '@/components/sections/UploadSection';
import AIResultSection from '@/components/sections/AIResultSection';
import ProductsSection from '@/components/sections/ProductsSection';
import VotingSection from '@/components/sections/VotingSection';
import ScheduleSection from '@/components/sections/ScheduleSection';
import MychatList from '@/components/home/MychatList';
import VotingPage from '@/components/VotingPage';
import { getVoteIdFromUrl, getVote, Vote } from '@/features/vote-system';

export default function HomePage() {
  const [voteId, setVoteId] = useState<string | null>(null);
  const [vote, setVote] = useState<Vote | null>(null);

  useEffect(() => {
    // URL에서 투표 ID 확인
    const id = getVoteIdFromUrl();
    if (id) {
      setVoteId(id);
      const voteData = getVote(id);
      setVote(voteData);
    }
  }, []);

  // 투표 화면 표시
  if (voteId && vote) {
    return (
      <VotingPage
        vote={vote}
        onVoteSubmitted={() => {
          // 투표 완료 후 데이터 갱신
          const updatedVote = getVote(voteId);
          if (updatedVote) {
            setVote(updatedVote);
          }
        }}
      />
    );
  }

  // 일반 홈 화면
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
