/**
 * AI Engine API
 * 이미지를 서버로 전송하고 AI 인테리어 결과를 받아오는 API
 */

const API_BASE_URL = "http://localhost:3001"; // 서버 주소

export interface AiInteriorRequest {
  image: string; // base64 데이터 URL
  imageWidth: number;  // 원본 이미지 가로 크기 (px)
  imageHeight: number; // 원본 이미지 세로 크기 (px)
  circles: Array<{
    x: number;      // 상대 좌표 (0~1), 왼쪽=0, 오른쪽=1
    y: number;      // 상대 좌표 (0~1), 위=0, 아래=1
    radius: number; // 이미지 크기 대비 상대 반지름 (0~1)
  }>;
}

export interface AiInteriorResponse {
  success: boolean;
  resultImageUrl?: string;
  message?: string;
}

/**
 * Base64 데이터 URL을 File 객체로 변환
 */
function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

/**
 * AI 인테리어 이미지 생성 요청
 * @param request - 편집된 이미지와 동그라미 정보
 * @returns AI 생성 결과
 */
export async function generateAiInterior(
  request: AiInteriorRequest
): Promise<AiInteriorResponse> {
  try {
    console.log("🚀 AI 생성 요청:", {
      circlesCount: request.circles.length,
      imageWidth: request.imageWidth,
      imageHeight: request.imageHeight,
      circles: request.circles,
    });

    // FormData 생성
    const formData = new FormData();

    // 이미지 파일 추가
    const imageFile = dataURLtoFile(request.image, "room-image.png");
    formData.append("image", imageFile);

    // 이미지 크기 정보 추가
    formData.append("imageWidth", request.imageWidth.toString());
    formData.append("imageHeight", request.imageHeight.toString());

    // 동그라미 데이터를 JSON으로 추가
    formData.append("circles", JSON.stringify(request.circles));

    console.log("📤 서버로 전송 중...", `${API_BASE_URL}/api/ai-interior`);

    // API 요청
    const response = await fetch(`${API_BASE_URL}/api/ai-interior`, {
      method: "POST",
      body: formData,
      // Content-Type은 FormData 사용 시 자동으로 설정됨 (multipart/form-data)
    });

    console.log("📥 서버 응답:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ 서버 에러 응답:", errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data: AiInteriorResponse = await response.json();
    console.log("✅ AI 생성 성공:", data);
    return data;
  } catch (error) {
    console.error("❌ AI 인테리어 생성 실패:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}
