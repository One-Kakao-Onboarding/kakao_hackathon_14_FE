'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Check, BarChart3 } from 'lucide-react';
import { Vote, getVoteResults } from '@/features/vote-system';

interface VoteModalProps {
  vote: Vote;
  shareUrl: string;
  onClose: () => void;
}

export default function VoteModal({ vote, shareUrl, onClose }: VoteModalProps) {
  const [copied, setCopied] = useState(false);
  const [results, setResults] = useState(getVoteResults(vote.id));

  useEffect(() => {
    // 주기적으로 결과 업데이트 (친구들이 투표하면 반영)
    const interval = setInterval(() => {
      setResults(getVoteResults(vote.id));
    }, 3000);

    return () => clearInterval(interval);
  }, [vote.id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  const totalVotes = vote.votes.length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">투표 생성 완료!</h2>
            <p className="text-sm text-gray-600 mt-1">
              친구들에게 링크를 공유해보세요
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Share URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              공유 링크
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? '복사됨' : '복사'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 카카오톡, 문자 등으로 이 링크를 공유하세요
            </p>
          </div>

          {/* Products */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              투표 상품
            </label>
            <div className="grid grid-cols-2 gap-4">
              {vote.products.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-bold text-sm text-gray-900 mb-1">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-600">{product.brand}</p>
                  <p className="text-sm font-bold text-gray-900 mt-2">
                    {product.price.toLocaleString()}원
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Vote Results */}
          {totalVotes > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={20} className="text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  실시간 투표 결과
                </h3>
                <span className="text-sm text-gray-500">
                  ({totalVotes}명 참여)
                </span>
              </div>

              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={result.productId}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-400">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-bold text-sm text-gray-900">
                            {result.product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {result.count}표
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        {result.percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          index === 0 ? 'bg-blue-600' : 'bg-blue-400'
                        }`}
                        style={{ width: `${result.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Voter List */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  투표 참여자
                </p>
                <div className="flex flex-wrap gap-2">
                  {vote.votes.map((v, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600"
                    >
                      {v.voterName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {totalVotes === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">아직 투표 참여자가 없습니다</p>
              <p className="text-sm text-gray-400 mt-1">
                친구들에게 링크를 공유해보세요!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
