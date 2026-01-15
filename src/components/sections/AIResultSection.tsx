"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, Wand2, Check, MessageCircle } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { generateAiInterior } from "@/features/ai-engine/api";
import { getRecommendedProducts, Product } from "@/features/mock-products";
import { createVote, getShareUrl, Vote } from "@/features/vote-system";
import VoteModal from "@/components/VoteModal";

type Step = "idle" | "analyzing" | "settings" | "ready" | "result";

const MOOD_OPTIONS = [
  { id: "modern", label: "모던", description: "깔끔하고 세련된 현대적 스타일" },
  { id: "minimal", label: "미니멀", description: "단순하고 심플한 감성" },
  { id: "wood", label: "우드", description: "따뜻한 나무 소재 중심" },
  {
    id: "vintage",
    label: "빈티지",
    description: "레트로 감성의 클래식한 느낌",
  },
  { id: "natural", label: "내추럴", description: "자연 친화적인 편안함" },
  {
    id: "industrial",
    label: "인더스트리얼",
    description: "도시적이고 강렬한 느낌",
  },
];

const RESIDENCE_TYPES = [
  { id: "monthly", label: "월세", description: "무타공 제품 위주 추천" },
  { id: "yearly", label: "전세", description: "이동 가능한 가구 추천" },
  { id: "own", label: "자가", description: "맞춤형 시공 가능" },
];

export default function AIResultSection() {
  const [step, setStep] = useState<Step>("idle");
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendedMoods, setRecommendedMoods] = useState<string[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [currentVote, setCurrentVote] = useState<Vote | null>(null);
  const [showVoteModal, setShowVoteModal] = useState(false);

  const {
    uploadedRoomImg,
    editedImage,
    aiResultImg,
    circles,
    canvasSize,
    moods: selectedMoods,
    residenceType,
    setAiResult,
    setUploadedRoomImg,
    setPersona,
  } = useUserStore();

  // editedImage가 업데이트되면 분석 시작
  useEffect(() => {
    if (editedImage && circles.length > 0 && step === "idle") {
      setStep("analyzing");

      // 1.5초 후 랜덤 무드 추천하고 settings로 이동
      setTimeout(() => {
        const shuffled = [...MOOD_OPTIONS].sort(() => Math.random() - 0.5);
        const recommended = shuffled.slice(0, 3).map((m) => m.id);
        setRecommendedMoods(recommended);
        setPersona({ moods: recommended });
        setStep("settings");
      }, 1500);
    }
  }, [editedImage, circles, step]);

  const handleMoodToggle = (moodId: string) => {
    const newMoods = selectedMoods.includes(moodId)
      ? selectedMoods.filter((id) => id !== moodId)
      : [...selectedMoods, moodId];
    setPersona({ moods: newMoods });
  };

  const handleProceedToGenerate = () => {
    if (selectedMoods.length > 0 && residenceType) {
      setStep("ready");
    }
  };

  const handleViewProducts = () => {
    // AI 결과 기반으로 상품 추천
    const products = getRecommendedProducts(selectedMoods, residenceType);
    setRecommendedProducts(products);
    setSelectedProductIds([]);
  };

  const handleRefreshProducts = () => {
    // 상품 다시 추천받기
    const products = getRecommendedProducts(selectedMoods, residenceType);
    setRecommendedProducts(products);
    setSelectedProductIds([]);
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProductIds((prev) => {
      if (prev.includes(productId)) {
        // 이미 선택된 경우 제거
        return prev.filter((id) => id !== productId);
      } else if (prev.length < 2) {
        // 2개 미만일 때만 추가
        return [...prev, productId];
      }
      return prev;
    });
  };

  const handleShareVote = () => {
    // 선택한 상품 정보 가져오기
    const selectedProducts = recommendedProducts.filter(p =>
      selectedProductIds.includes(p.id)
    );

    if (selectedProducts.length !== 2) {
      alert('2개의 상품을 선택해주세요');
      return;
    }

    // 투표 생성
    const vote = createVote(
      '홈즈 사용자', // 실제로는 로그인한 사용자 이름
      selectedProducts,
      aiResultImg || ''
    );

    setCurrentVote(vote);
    setShowVoteModal(true);
  };

  // 개발자 모드: AI 생성 완료 상태로 점프
  const handleDevMockResult = () => {
    // Mock 무드 & 주거 형태 설정
    setPersona({
      moods: ["modern", "minimal"],
      residenceType: "monthly"
    });
    setRecommendedMoods(["modern", "minimal", "wood"]);

    // Mock 원본 이미지 (Before)
    setUploadedRoomImg(
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop"
    );

    // Mock AI 결과 이미지 (After)
    setAiResult(
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop"
    );

    // Result 단계로 이동
    setStep("result");
  };

  // 절대 좌표를 상대 좌표(0~1)로 정규화
  const normalizeCircles = (width: number, height: number) => {
    if (width === 0 || height === 0) return [];

    return circles.map((circle) => ({
      x: circle.x / width,
      y: 1 - circle.y / height, // y축 반전 (Canvas 좌표계 → API 좌표계)
      radius: circle.radius / Math.min(width, height),
    }));
  };

  const handleGenerateAi = async () => {
    if (!editedImage || !canvasSize) {
      setError(
        "이미지 정보를 찾을 수 없습니다. 먼저 사진을 업로드하고 영역을 선택해주세요."
      );
      return;
    }

    if (circles.length === 0) {
      setError("변경할 영역을 선택해주세요.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 상대 좌표로 변환하여 전송
      const normalizedCircles = normalizeCircles(
        canvasSize.width,
        canvasSize.height
      );

      console.log("📊 Canvas 정보:", {
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
        setStep("result");
      } else {
        setError(result.message || "AI 인테리어 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("AI 생성 오류:", error);
      setError("서버와의 통신 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="ai-result" className="py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          AI가 <span className="text-blue-600">재해석한</span> 내 방
        </h2>
        <p className="text-gray-600">
          {step === "result"
            ? "슬라이더를 움직여 변화를 확인해보세요"
            : step === "settings"
            ? "AI가 추천하는 스타일을 선택하고 설정을 완료해주세요"
            : "영역을 선택하고 AI 인테리어를 생성해보세요"}
        </p>
      </div>

      {/* Step: Analyzing Modal */}
      {step === "analyzing" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-12 max-w-md w-full mx-4 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Sparkles size={40} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              AI가 이미지를 분석하고 있어요
            </h3>
            <p className="text-gray-600">잠시만 기다려주세요...</p>
          </div>
        </div>
      )}

      {/* Step: Settings (Mood + Residence Type) */}
      {step === "settings" && (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Mood Selection */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <div className="mb-6">
              <h3 className="text-[24px] leading-[35px] font-medium text-gray-900 mb-2">
                AI 추천 인테리어 무드
              </h3>
              <p className="text-[16px] leading-[23px] text-gray-600">
                분석 결과 추천드리는 스타일입니다. 원하시는 무드를 선택해주세요
                (복수 선택 가능)
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {MOOD_OPTIONS.map((mood) => {
                const isSelected = selectedMoods.includes(mood.id);
                const isRecommended = recommendedMoods.includes(mood.id);

                return (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodToggle(mood.id)}
                    className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {isRecommended && (
                      <span className="absolute top-3 right-3 px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                        AI 추천
                      </span>
                    )}
                    <h4 className="text-[16px] leading-[23px] font-bold text-gray-900 mb-1">
                      {mood.label}
                    </h4>
                    <p className="text-sm text-gray-600">{mood.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Residence Type Selection */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <div className="mb-6">
              <h3 className="text-[24px] leading-[35px] font-medium text-gray-900 mb-2">
                주거 형태
              </h3>
              <p className="text-[16px] leading-[23px] text-gray-600">
                거주 형태에 맞는 가구를 추천해드립니다
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {RESIDENCE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setPersona({ residenceType: type.id })}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    residenceType === type.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h4 className="text-[16px] leading-[23px] font-bold text-gray-900 mb-1">
                    {type.label}
                  </h4>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleProceedToGenerate}
            disabled={selectedMoods.length === 0 || !residenceType}
            className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음 단계로
          </button>
        </div>
      )}

      {/* Step: Idle (No Image) */}
      {step === "idle" && (
        <div className="bg-white rounded-2xl shadow-sm p-10 border border-gray-200">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Sparkles size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              아직 이미지가 준비되지 않았어요
            </h3>
            <p className="text-gray-600 text-center mb-6">
              위의 &ldquo;내 방 사진 업로드&rdquo; 섹션에서
              <br />
              사진을 업로드하고 영역을 선택해주세요
            </p>

            {/* 개발자 모드 버튼 */}
            <button
              onClick={handleDevMockResult}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold text-sm flex items-center gap-2"
            >
              <Sparkles size={18} />
              [DEV] AI 생성 완료 상태로 이동
            </button>
          </div>
        </div>
      )}

      {/* Step: Ready (Preview + Generate) */}
      {step === "ready" && (
        <div className="grid grid-cols-2 gap-8">
          {/* Left: Image Preview */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <div>
              <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4">
                <img
                  src={editedImage || ""}
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
                <label className="text-sm text-gray-600 mb-2 block">
                  적용 스타일
                </label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-bold text-gray-900">
                    {selectedMoods
                      .map(
                        (id) =>
                          MOOD_OPTIONS.find((m) => m.id === id)?.label || id
                      )
                      .join(", ")}
                  </p>
                </div>
              </div>

              {/* Residence Type Info */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  주거 형태
                </label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-bold text-gray-900">
                    {RESIDENCE_TYPES.find((t) => t.id === residenceType)
                      ?.label || residenceType}
                    {residenceType === "monthly" && (
                      <span className="text-blue-600 text-xs ml-2">
                        (무타공 제품)
                      </span>
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
                ) : (
                  <>
                    <Sparkles size={24} />
                    AI 인테리어 생성하기
                  </>
                )}
              </button>

              {/* Tips */}
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

              {/* Back Button */}
              <button
                onClick={() => setStep("settings")}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                설정 다시하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step: Result (Before/After Slider) */}
      {step === "result" && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
          {/* Left: Before/After Slider */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
              {/* Before Image */}
              <div className="absolute inset-0">
                <img
                  src={uploadedRoomImg || ""}
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
                  src={aiResultImg || ""}
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

          {/* Right: Result Info */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles size={24} className="text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">AI 생성 완료!</h3>
            </div>

            <div className="space-y-6">
              {/* Style Info */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  적용 스타일
                </label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-bold text-gray-900">
                    {selectedMoods
                      .map(
                        (id) =>
                          MOOD_OPTIONS.find((m) => m.id === id)?.label || id
                      )
                      .join(", ")}
                  </p>
                </div>
              </div>

              {/* Residence Type Info */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  주거 형태
                </label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-bold text-gray-900">
                    {RESIDENCE_TYPES.find((t) => t.id === residenceType)
                      ?.label || residenceType}
                    {residenceType === "monthly" && (
                      <span className="text-blue-600 text-xs ml-2">
                        (무타공 제품)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Success Message */}
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-bold text-green-900 mb-1">
                  ✅ AI 생성 완료!
                </p>
                <p className="text-sm text-green-700">
                  슬라이더를 움직여 원본과 비교해보세요
                </p>
              </div>

              {/* Regenerate Button */}
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
                ) : (
                  <>
                    <Sparkles size={24} />
                    다시 생성하기
                  </>
                )}
              </button>

              {/* View Products Button */}
              <button
                onClick={handleViewProducts}
                className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg flex items-center justify-center gap-3"
              >
                <Sparkles size={24} />
                AI 추천 상품 보기
              </button>

              {/* Back to Settings Button */}
              <button
                onClick={() => setStep("settings")}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                설정 변경하기
              </button>
            </div>
          </div>
          </div>

          {/* Products Section - 상품 추천 버튼 클릭 시 표시 */}
          {recommendedProducts.length > 0 && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[24px] leading-[35px] font-medium text-gray-900 mb-2">
                    AI가 추천하는 가구
                  </h3>
                  <p className="text-[16px] leading-[23px] text-gray-600">
                    투표를 위해 2개의 상품을 선택해주세요
                  </p>
                </div>
                <button
                  onClick={handleRefreshProducts}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  다시 추천받기
                </button>
              </div>

              {/* Products Grid - 4 columns */}
              <div className="grid grid-cols-4 gap-4">
                {recommendedProducts.map((product) => {
                  const isSelected = selectedProductIds.includes(product.id);

                  return (
                    <button
                      key={product.id}
                      onClick={() => handleProductToggle(product.id)}
                      className={`relative bg-white rounded-xl shadow-sm p-4 border-2 transition-all text-left hover:shadow-md ${
                        isSelected
                          ? "border-blue-500 shadow-lg"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {/* Selection Badge */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center z-10">
                          <Check size={16} className="text-white" />
                        </div>
                      )}

                      {/* Product Image */}
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {product.brand}
                        </p>
                        <h4 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {product.features.slice(0, 2).map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Price */}
                        <p className="text-base font-bold text-gray-900">
                          {product.price.toLocaleString()}원
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Share Vote Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {selectedProductIds.length === 0 && "2개의 상품을 선택해주세요"}
                      {selectedProductIds.length === 1 && "1개 더 선택해주세요"}
                      {selectedProductIds.length === 2 && "✅ 2개 선택 완료!"}
                    </p>
                    <p className="text-xs text-gray-500">
                      친구들에게 공유하여 투표를 받아보세요
                    </p>
                  </div>
                  <button
                    onClick={handleShareVote}
                    disabled={selectedProductIds.length !== 2}
                    className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <MessageCircle size={20} />
                    친구들에게 투표 올리기
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vote Modal */}
      {showVoteModal && currentVote && (
        <VoteModal
          vote={currentVote}
          shareUrl={getShareUrl(currentVote.id)}
          onClose={() => setShowVoteModal(false)}
        />
      )}
    </section>
  );
}
