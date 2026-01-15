'use client';

import { useState } from 'react';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { generateAiInterior } from '@/features/ai-engine/api';

export default function AIResultSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    uploadedRoomImg,
    editedImage,
    aiResultImg,
    circles,
    canvasSize,
    moods,
    residenceType,
    setAiResult,
  } = useUserStore();

  // 절대 좌표를 상대 좌표(0~1)로 정규화
  const normalizeCircles = (width: number, height: number) => {
    if (width === 0 || height === 0) return [];

    return circles.map((circle) => ({
      x: circle.x / width,
      y: circle.y / height,
      radius: circle.radius / Math.min(width, height),
    }));
  };

  const handleGenerateAi = async () => {
    if (!editedImage || !canvasSize) {
      setError('이미지 정보를 찾을 수 없습니다. 먼저 사진을 업로드하고 영역을 선택해주세요.');
      return;
    }

    if (circles.length === 0) {
      setError('변경할 영역을 선택해주세요.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 상대 좌표로 변환하여 전송
      const normalizedCircles = normalizeCircles(canvasSize.width, canvasSize.height);

      console.log('📊 Canvas 정보:', {
        width: canvasSize.width,
        height: canvasSize.height,
        circlesCount: circles.length,
        normalizedCircles,
      });

      const result = await generateAiInterior({
        image: editedImage,
        imageWidth: canvasSize.width,
        imageHeight: canvasSize.height,
        circles: normalizedCircles,
      });

      if (result.success && result.resultImageUrl) {
        setAiResult(result.resultImageUrl);
      } else {
        setError(result.message || 'AI 인테리어 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('AI 생성 오류:', error);
      setError('서버와의 통신 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const hasEditedImage = !!editedImage && circles.length > 0;
  const hasAiResult = !!aiResultImg;

  return (
    <section id="ai-result" className="py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          AI가 <span className="text-blue-600">재해석한</span> 내 방
        </h2>
        <p className="text-gray-600">
          {hasAiResult
            ? '슬라이더를 움직여 변화를 확인해보세요'
            : '영역을 선택하고 AI 인테리어를 생성해보세요'}
        </p>
      </div>

      {!hasEditedImage ? (
        // No Image State
        <div className="bg-white rounded-2xl shadow-sm p-10 border border-gray-200">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Sparkles size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              아직 이미지가 준비되지 않았어요
            </h3>
            <p className="text-gray-600 text-center">
              위의 &ldquo;내 방 사진 업로드&rdquo; 섹션에서<br />
              사진을 업로드하고 영역을 선택해주세요
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-8">
          {/* Left: Image Preview/Result */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            {!hasAiResult ? (
              // Preview State
              <div>
                <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4">
                  <img
                    src={editedImage}
                    alt="Edited room"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    선택한 영역이 표시된 이미지입니다
                  </p>
                </div>
              </div>
            ) : (
              // Result State - Before/After Slider
              <div>
                <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
                  {/* Before Image */}
                  <div className="absolute inset-0">
                    <img
                      src={uploadedRoomImg || ''}
                      alt="Before"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* After Image with Clip */}
                  <div
                    className="absolute inset-0"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <img
                      src={aiResultImg}
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Slider Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg z-10"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <div className="flex gap-1">
                        <div className="w-0.5 h-4 bg-gray-400"></div>
                        <div className="w-0.5 h-4 bg-gray-400"></div>
                      </div>
                    </div>
                  </div>

                  {/* Slider Input */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                  />

                  {/* Labels */}
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                    원본
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                    AI 결과
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Controls & Info */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Wand2 size={24} className="text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">AI 생성 설정</h3>
            </div>

            <div className="space-y-6">
              {/* Style Info */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">적용 스타일</label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-bold text-gray-900">
                    {moods.join(', ') || '선택 안 함'}
                  </p>
                </div>
              </div>

              {/* Residence Type Info */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">주거 형태</label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-bold text-gray-900">
                    {residenceType}
                    {residenceType === '월세' && (
                      <span className="text-blue-600 text-xs ml-2">(무타공 제품)</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerateAi}
                disabled={isGenerating}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    AI 생성 중...
                  </>
                ) : hasAiResult ? (
                  <>
                    <Sparkles size={24} />
                    다시 생성하기
                  </>
                ) : (
                  <>
                    <Sparkles size={24} />
                    AI 인테리어 생성하기
                  </>
                )}
              </button>

              {/* Tips */}
              {!hasAiResult && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-bold text-blue-900 mb-2">
                    💡 AI 생성 팁
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 선택한 영역이 명확할수록 결과가 좋습니다</li>
                    <li>• 가구와 벽이 잘 보이는 사진을 사용하세요</li>
                    <li>• 생성 시간은 약 10-30초 소요됩니다</li>
                  </ul>
                </div>
              )}

              {hasAiResult && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-bold text-green-900 mb-1">
                    ✅ AI 생성 완료!
                  </p>
                  <p className="text-sm text-green-700">
                    슬라이더를 움직여 원본과 비교해보세요
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
