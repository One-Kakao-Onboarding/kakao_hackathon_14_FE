"use client";

import { useState, useCallback } from "react";
import { Upload, X, Camera, Image as ImageIcon } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import EditCanvas from "./EditCanvas";

export default function UploadSection() {
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    uploadedRoomImg,
    setUploadedRoomImg,
    setCircles,
    setEditedImage,
    setCanvasSize,
  } = useUserStore();

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // 파일 크기 체크 (10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert("파일 크기는 10MB 이하여야 합니다.");
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedRoomImg(reader.result as string);
          setCircles([]);
          setEditedImage(null);
          setCanvasSize(null);
          setIsEditMode(false);
        };
        reader.readAsDataURL(file);
      }
    },
    [setUploadedRoomImg, setCircles, setEditedImage, setCanvasSize]
  );

  const handleRemoveImage = () => {
    setUploadedRoomImg(null);
    setCircles([]);
    setEditedImage(null);
    setCanvasSize(null);
    setIsEditMode(false);
  };

  const handleStartEdit = () => {
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    setIsEditMode(false);
  };

  return (
    <section id="upload" className="pt-8 pb-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        내 방 사진 업로드
      </h2>

      {!isEditMode ? (
        <div className="grid grid-cols-2 gap-8">
          {/* Left: Upload/Preview */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            {!uploadedRoomImg ? (
              <label className="block cursor-pointer">
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Upload size={32} className="text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    사진을 업로드하세요
                  </h3>
                  <p className="text-sm text-gray-600">
                    JPG, PNG 파일 (최대 10MB)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </label>
            ) : (
              <div>
                <div className="relative">
                  <img
                    src={uploadedRoomImg}
                    alt="Uploaded room"
                    className="w-full aspect-[4/3] object-cover rounded-xl"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                  >
                    <X size={18} className="text-gray-700" />
                  </button>
                </div>
                <div className="mt-6 flex gap-3">
                  <label className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center cursor-pointer text-sm">
                    다른 사진 선택
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <button
                    onClick={handleStartEdit}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    영역 선택하기
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Instructions */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Camera size={24} className="text-blue-600" />
              <h3 className="text-[24px] leading-[35px] font-bold text-gray-900">
                사진 업로드 가이드
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="text-[16px] leading-[23px] font-bold text-gray-900 mb-1">
                      밝은 조명에서 촬영하세요
                    </h4>
                    <p className="text-[16px] leading-[23px] text-gray-600">
                      자연광이나 밝은 실내 조명에서 촬영하면 AI가 더 정확하게
                      분석합니다
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="text-[16px] leading-[23px] font-bold text-gray-900 mb-1">
                      방 전체가 보이도록
                    </h4>
                    <p className="text-[16px] leading-[23px] text-gray-600">
                      가구와 공간이 잘 보이도록 촬영해주세요
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="text-[16px] leading-[23px] font-bold text-gray-900 mb-1">
                      영역 선택하기
                    </h4>
                    <p className="text-[16px] leading-[23px] text-gray-600">
                      업로드 후 변경하고 싶은 영역을 동그라미로 선택해주세요
                    </p>
                  </div>
                </div>
              </div>

              {uploadedRoomImg && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon size={18} className="text-blue-600" />
                    <p className="text-[16px] leading-[23px] font-medium text-blue-900">
                      이미지 업로드 완료!
                    </p>
                  </div>
                  <p className="text-[16px] leading-[23px] text-blue-700">
                    영역 선택하기 버튼을 눌러 변경할 영역을 지정해주세요
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Edit Mode - 2/3 Width
        <div className="w-2/3 mx-auto">
          <EditCanvas onSaveEdit={handleSaveEdit} />
        </div>
      )}
    </section>
  );
}
