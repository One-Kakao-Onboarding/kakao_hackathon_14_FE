'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Users } from 'lucide-react';
import { getMyVotes, getVote, getVoteResults, Vote } from '@/features/vote-system';
import VoteModal from '@/components/VoteModal';

export default function VotingSection() {
  const [latestVote, setLatestVote] = useState<Vote | null>(null);
  const [showVoteModal, setShowVoteModal] = useState(false);

  useEffect(() => {
    // localStorage에서 가장 최근 투표 가져오기
    const voteIds = getMyVotes();
    if (voteIds.length > 0) {
      const vote = getVote(voteIds[voteIds.length - 1]);
      setLatestVote(vote);
    }

    // 3초마다 투표 결과 업데이트
    const interval = setInterval(() => {
      if (voteIds.length > 0) {
        const vote = getVote(voteIds[voteIds.length - 1]);
        setLatestVote(vote);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleShareClick = () => {
    if (latestVote) {
      setShowVoteModal(true);
    }
  };

  const getShareUrl = (voteId: string) => {
    if (typeof window === 'undefined') return '';
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?vote=${voteId}`;
  };

  // 투표가 없을 때 기본 UI
  if (!latestVote) {
    return (
      <section id="voting" className="py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            친구들에게 <span className="text-blue-600">투표</span> 받기
          </h2>
          <p className="text-gray-600">
            카카오톡으로 공유하고 의견을 받아보세요
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Kakao Share Card */}
          <div className="bg-[#fee500] rounded-2xl p-8 shadow-lg">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle size={24} className="text-gray-900" />
                <h3 className="text-xl font-bold text-gray-900">
                  카카오톡으로 공유하기
                </h3>
              </div>
              <p className="text-gray-800 text-sm">
                A안과 B안 중 친구들이 선택할 수 있도록 투표를 공유해보세요
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 mb-6">
              <div className="text-center py-8 text-gray-500">
                아직 생성된 투표가 없습니다
              </div>
            </div>

            <button
              disabled
              className="w-full py-4 bg-gray-400 text-white rounded-xl font-bold cursor-not-allowed"
            >
              카카오톡 공유하기
            </button>
          </div>

          {/* Voting Result Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Users size={24} className="text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">투표 현황</h3>
            </div>

            <div className="text-center py-12 text-gray-500">
              투표를 생성하면 결과가 여기에 표시됩니다
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 투표가 있을 때
  const results = getVoteResults(latestVote.id);
  const totalVotes = latestVote.votes.length;
  const topTwo = results.slice(0, 2);

  return (
    <>
      <section id="voting" className="py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            친구들에게 <span className="text-blue-600">투표</span> 받기
          </h2>
          <p className="text-gray-600">
            카카오톡으로 공유하고 의견을 받아보세요
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Kakao Share Card */}
          <div className="bg-[#fee500] rounded-2xl p-8 shadow-lg">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle size={24} className="text-gray-900" />
                <h3 className="text-xl font-bold text-gray-900">
                  카카오톡으로 공유하기
                </h3>
              </div>
              <p className="text-gray-800 text-sm">
                A안과 B안 중 친구들이 선택할 수 있도록 투표를 공유해보세요
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{latestVote.userName}</p>
                  <p className="text-xs text-gray-600">인테리어 투표 요청</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {latestVote.products.slice(0, 2).map((product) => (
                  <div key={product.id} className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-700 mt-3">
                어떤 인테리어가 더 좋을까요?
              </p>
            </div>

            <button
              onClick={handleShareClick}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
            >
              카카오톡 공유하기
            </button>
          </div>

          {/* Voting Result Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Users size={24} className="text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">투표 현황</h3>
            </div>

            {totalVotes > 0 ? (
              <>
                <div className="space-y-6">
                  {topTwo.map((result, index) => (
                    <div key={result.productId}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden">
                            <img
                              src={result.product.image}
                              alt={result.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-medium text-gray-900">
                            {result.product.name}
                          </span>
                        </div>
                        <span className="text-xl font-bold text-blue-600">
                          {result.count}표
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            index === 0 ? 'bg-blue-600' : 'bg-gray-400'
                          }`}
                          style={{ width: `${result.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <span className="font-bold">총 {totalVotes}명</span>이 투표에 참여했습니다
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                아직 투표 참여자가 없습니다
              </div>
            )}
          </div>
        </div>
      </section>

      {latestVote && showVoteModal && (
        <VoteModal
          vote={latestVote}
          shareUrl={getShareUrl(latestVote.id)}
          onClose={() => setShowVoteModal(false)}
        />
      )}
    </>
  );
}
