'use client';

import { useState } from 'react';
import { Check, Heart } from 'lucide-react';
import { Vote, submitVote, getVoteResults } from '@/features/vote-system';

interface VotingPageProps {
  vote: Vote;
  onVoteSubmitted: () => void;
}

export default function VotingPage({ vote, onVoteSubmitted }: VotingPageProps) {
  const [voterName, setVoterName] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(getVoteResults(vote.id));

  const handleSubmit = () => {
    if (!voterName.trim() || !selectedProductId) {
      alert('이름과 상품을 선택해주세요');
      return;
    }

    const success = submitVote(vote.id, voterName.trim(), selectedProductId);
    if (success) {
      setSubmitted(true);
      setResults(getVoteResults(vote.id));
      onVoteSubmitted();
    }
  };

  if (submitted) {
    // 투표 완료 화면
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              투표 완료!
            </h2>
            <p className="text-gray-600">
              {voterName}님의 소중한 의견이 반영되었습니다
            </p>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              현재 투표 결과 ({vote.votes.length}명 참여)
            </h3>
            {results.map((result, index) => (
              <div key={result.productId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={result.product.image}
                      alt={result.product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-bold text-sm">{result.product.name}</p>
                      <p className="text-xs text-gray-500">
                        {result.count}표
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {result.percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      index === 0 ? 'bg-blue-600' : 'bg-blue-400'
                    }`}
                    style={{ width: `${result.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 투표 화면
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {vote.userName}님의 인테리어 투표
          </h1>
          <p className="text-gray-600">
            어떤 가구가 더 어울릴까요? 선택해주세요!
          </p>
        </div>

        {/* AI Result Image */}
        {vote.aiResultImage && (
          <div className="mb-8">
            <img
              src={vote.aiResultImage}
              alt="AI 인테리어 결과"
              className="w-full aspect-video object-cover rounded-xl"
            />
          </div>
        )}

        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이름
          </label>
          <input
            type="text"
            value={voterName}
            onChange={(e) => setVoterName(e.target.value)}
            placeholder="이름을 입력해주세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Products */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            어느 상품이 더 좋을까요?
          </label>
          <div className="grid grid-cols-2 gap-4">
            {vote.products.map((product) => {
              const isSelected = selectedProductId === product.id;

              return (
                <button
                  key={product.id}
                  onClick={() => setSelectedProductId(product.id)}
                  className={`relative border-2 rounded-xl p-4 transition-all text-left ${
                    isSelected
                      ? 'border-blue-500 shadow-lg bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check size={20} className="text-white" />
                    </div>
                  )}

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover rounded-lg mb-3"
                  />

                  <h4 className="font-bold text-sm text-gray-900 mb-1">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">{product.brand}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.features.slice(0, 2).map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <p className="text-base font-bold text-gray-900">
                    {product.price.toLocaleString()}원
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!voterName.trim() || !selectedProductId}
          className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          투표하기
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          투표는 언제든 수정할 수 있습니다
        </p>
      </div>
    </div>
  );
}
