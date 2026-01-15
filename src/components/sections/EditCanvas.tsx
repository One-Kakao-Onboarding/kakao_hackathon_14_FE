'use client';

import { useRef, useEffect, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

interface EditCanvasProps {
  onSaveEdit?: () => void;
}

export default function EditCanvas({ onSaveEdit }: EditCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDrawingRef = useRef(false);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);

  const {
    uploadedRoomImg,
    circles,
    setCircles,
    setEditedImage,
    setCanvasSize,
  } = useUserStore();

  // Canvas에 이미지와 동그라미 그리기
  const drawCanvas = useCallback(
    (tempCircle?: { x: number; y: number; radius: number }) => {
      const canvas = canvasRef.current;
      const image = imageRef.current;
      if (!canvas || !image) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 캔버스 크기 설정
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      // 이미지 그리기
      ctx.drawImage(image, 0, 0);

      // 저장된 동그라미 그리기
      circles.forEach((circle) => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ef4444'; // red-500
        ctx.lineWidth = 3;
        ctx.stroke();
      });

      // 임시 동그라미 그리기 (드래그 중)
      if (tempCircle && tempCircle.radius > 0) {
        ctx.beginPath();
        ctx.arc(tempCircle.x, tempCircle.y, tempCircle.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]); // 점선으로 표시
        ctx.stroke();
        ctx.setLineDash([]); // 점선 해제
      }
    },
    [circles]
  );

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
    if ('touches' in e) {
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
      isDrawingRef.current = true;
      startPointRef.current = coords;
    }
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current || !startPointRef.current) return;

    const coords = getCanvasCoordinates(e);
    if (coords) {
      // 시작점과 끝점의 중심을 원의 중심으로
      const centerX = (startPointRef.current.x + coords.x) / 2;
      const centerY = (startPointRef.current.y + coords.y) / 2;

      // 시작점에서 끝점까지 거리의 절반을 반지름으로
      const radius =
        Math.sqrt(
          Math.pow(coords.x - startPointRef.current.x, 2) +
            Math.pow(coords.y - startPointRef.current.y, 2)
        ) / 2;

      // 실시간으로 임시 동그라미 그리기
      drawCanvas({ x: centerX, y: centerY, radius });
    }
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current || !startPointRef.current) return;

    const coords = getCanvasCoordinates(e);
    if (coords) {
      // 시작점과 끝점의 중심을 원의 중심으로
      const centerX = (startPointRef.current.x + coords.x) / 2;
      const centerY = (startPointRef.current.y + coords.y) / 2;

      // 시작점에서 끝점까지 거리의 절반을 반지름으로
      const radius =
        Math.sqrt(
          Math.pow(coords.x - startPointRef.current.x, 2) +
            Math.pow(coords.y - startPointRef.current.y, 2)
        ) / 2;

      if (radius > 5) {
        // 기존 동그라미를 덮어쓰기 (최대 1개만 유지)
        setCircles([{ x: centerX, y: centerY, radius }]);
      }
    }

    isDrawingRef.current = false;
    startPointRef.current = null;
  };

  const handleClearCircles = () => {
    setCircles([]);
  };

  const handleSaveEdit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Canvas 크기 정보를 저장
    setCanvasSize({
      width: canvas.width,
      height: canvas.height,
    });

    const dataUrl = canvas.toDataURL('image/png');
    setEditedImage(dataUrl);

    // 콜백 실행 (부모 컴포넌트에서 다음 단계 처리)
    if (onSaveEdit) {
      onSaveEdit();
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">이미지 편집</h3>
            <p className="text-sm text-gray-600 mt-1">
              드래그하여 변경할 영역을 선택해주세요 (1개만 가능)
            </p>
          </div>
          <button
            onClick={handleClearCircles}
            disabled={circles.length === 0}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Trash2 size={16} />
            초기화
          </button>
        </div>

        {/* Canvas Container */}
        <div className="relative bg-gray-50 rounded-lg overflow-hidden">
          <img
            ref={imageRef}
            src={uploadedRoomImg || ''}
            alt="Room"
            className="hidden"
            onLoad={drawCanvas}
          />
          <canvas
            ref={canvasRef}
            className="w-full h-auto cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          />
        </div>

        <div className="text-sm text-gray-500 text-center mt-3">
          {circles.length > 0 ? '✅ 영역이 선택되었습니다' : '영역을 선택해주세요'}
        </div>
      </div>

      <button
        onClick={handleSaveEdit}
        disabled={circles.length === 0}
        className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        편집 완료
      </button>
    </div>
  );
}
