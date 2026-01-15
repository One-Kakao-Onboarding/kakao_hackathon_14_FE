"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { useUserStore } from "@/store/useUserStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Check,
  ArrowRight,
  Camera,
  Edit3,
  Eye,
  Trash2,
} from "lucide-react";

type Step = "upload" | "edit" | "results";

interface Circle {
  x: number;
  y: number;
  radius: number;
}

export default function CanvasPage() {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [circles, setCircles] = useState<Circle[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const { uploadedRoomImg, setUploadedRoomImg } = useUserStore();

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedRoomImg(reader.result as string);
          setCircles([]);
          setEditedImage(null);
        };
        reader.readAsDataURL(file);
      }
    },
    [setUploadedRoomImg]
  );

  // Canvas에 이미지와 동그라미 그리기
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 크기 설정
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    // 이미지 그리기
    ctx.drawImage(image, 0, 0);

    // 동그라미 그리기
    circles.forEach((circle) => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 3;
      ctx.stroke();
    });
  }, [circles]);

  // 이미지 로드 시 Canvas 그리기
  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      drawCanvas();
    }
  }, [circles, drawCanvas]);

  // 마우스/터치 좌표 가져오기
  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCanvasCoordinates(e);
    if (coords) {
      setIsDrawing(true);
      setStartPoint(coords);
    }
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !startPoint) return;

    const coords = getCanvasCoordinates(e);
    if (coords) {
      const radius = Math.sqrt(
        Math.pow(coords.x - startPoint.x, 2) + Math.pow(coords.y - startPoint.y, 2)
      );

      if (radius > 10) {
        setCircles([...circles, { x: startPoint.x, y: startPoint.y, radius }]);
      }
    }

    setIsDrawing(false);
    setStartPoint(null);
  };

  const handleClearCircles = () => {
    setCircles([]);
  };

  const handleSaveEdit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    setEditedImage(dataUrl);
    setCurrentStep("results");
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <MobileContainer>
      <div className="space-y-6">
        {/* Header */}
        <header className="pt-2">
          <h1 className="text-2xl font-bold text-zinc-900">AI 캔버스</h1>
          <p className="text-zinc-500 mt-1">내 방을 새롭게 변신시켜보세요</p>
        </header>

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-2">
          {[
            { step: "upload", icon: Camera, label: "업로드" },
            { step: "edit", icon: Edit3, label: "편집" },
            { step: "results", icon: Eye, label: "결과" },
          ].map((item, index) => {
            const Icon = item.icon;
            const isActive = currentStep === item.step;
            const isPast =
              (currentStep === "edit" && item.step === "upload") ||
              (currentStep === "results" &&
                (item.step === "upload" || item.step === "edit"));

            return (
              <div key={item.step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-purple-200"
                        : isPast
                        ? "bg-green-500 text-white"
                        : "bg-zinc-100 text-zinc-400"
                    }`}
                  >
                    {isPast ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-xs mt-2 ${
                      isActive ? "text-violet-600 font-semibold" : "text-zinc-400"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      isPast ? "bg-green-500" : "bg-zinc-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === "upload" && (
            <motion.div
              key="upload"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <Card className="border-2 border-dashed border-zinc-200 bg-zinc-50/50">
                <CardContent className="p-6">
                  {uploadedRoomImg ? (
                    <div className="relative">
                      <img
                        src={uploadedRoomImg}
                        alt="Uploaded room"
                        className="w-full aspect-[4/3] object-cover rounded-xl"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-3 right-3"
                        onClick={() => setUploadedRoomImg(null)}
                      >
                        다시 선택
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center py-12 cursor-pointer">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-violet-500" />
                      </div>
                      <span className="text-lg font-medium text-zinc-700">
                        내 방 사진 업로드
                      </span>
                      <span className="text-sm text-zinc-400 mt-1">
                        JPG, PNG 형식 지원
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </CardContent>
              </Card>

              <Button
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 h-12 text-base font-medium"
                disabled={!uploadedRoomImg}
                onClick={() => setCurrentStep("edit")}
              >
                다음 단계로
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {currentStep === "edit" && (
            <motion.div
              key="edit"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-900">이미지 편집</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearCircles}
                      disabled={circles.length === 0}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      초기화
                    </Button>
                  </div>
                  <p className="text-sm text-zinc-500">
                    드래그하여 빨간 동그라미를 그려주세요
                  </p>

                  {/* Canvas Container */}
                  <div className="relative bg-zinc-50 rounded-lg overflow-hidden">
                    <img
                      ref={imageRef}
                      src={uploadedRoomImg || ""}
                      alt="Room"
                      className="hidden"
                      onLoad={drawCanvas}
                    />
                    <canvas
                      ref={canvasRef}
                      className="w-full h-auto cursor-crosshair"
                      onMouseDown={handleMouseDown}
                      onMouseUp={handleMouseUp}
                      onTouchStart={handleMouseDown}
                      onTouchEnd={handleMouseUp}
                    />
                  </div>

                  <div className="text-xs text-zinc-400 text-center">
                    {circles.length}개의 동그라미가 그려졌습니다
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={() => setCurrentStep("upload")}
                >
                  이전
                </Button>
                <Button
                  className="flex-[2] bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 h-12 text-base font-medium"
                  onClick={handleSaveEdit}
                >
                  편집 완료
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === "results" && (
            <motion.div
              key="results"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Before/After Comparison */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <Tabs defaultValue="after" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 rounded-none h-12 bg-zinc-100">
                      <TabsTrigger
                        value="before"
                        className="rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none"
                      >
                        원본
                      </TabsTrigger>
                      <TabsTrigger
                        value="after"
                        className="rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none"
                      >
                        편집본
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="before" className="m-0">
                      <img
                        src={uploadedRoomImg || ""}
                        alt="Before"
                        className="w-full aspect-[4/3] object-cover"
                      />
                    </TabsContent>
                    <TabsContent value="after" className="m-0">
                      <img
                        src={editedImage || uploadedRoomImg || ""}
                        alt="After"
                        className="w-full aspect-[4/3] object-cover"
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Info */}
              <div className="text-center text-sm text-zinc-500">
                총 {circles.length}개의 동그라미가 표시되었습니다
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-12"
                  onClick={() => {
                    setCurrentStep("edit");
                  }}
                >
                  다시 편집하기
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 h-12 text-base font-medium"
                  onClick={() => {
                    setCurrentStep("upload");
                    setUploadedRoomImg(null);
                    setCircles([]);
                    setEditedImage(null);
                  }}
                >
                  새로 시작하기
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileContainer>
  );
}
