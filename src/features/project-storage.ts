// API 응답 타입 정의
export interface AIResponse {
  success: boolean;
  message: string;
  circle_info: {
    center_x: number;
    center_y: number;
    radius: number;
    category: string;
    confidence: number;
    description: string;
    gemini_recommendations: string[];
    placement_surface: string;
  };
  background_mood: {
    primary_style: string;
    category: string;
    confidence: number;
    warmth_score: number;
    dominant_colors: string[];
  };
  recommended_products: Array<{
    product_id: string;
    name: string;
    category: string;
    price: number;
    image_url: string;
    match_score: number;
    match_details: {
      color_similarity: number;
      physics_similarity: number;
      style_similarity: number;
      keyword_match_score: number;
      spatial_suitability_score: number;
      product_placement_type: string;
      original_mood_score: number;
    };
  }>;
  edited_image_base64?: string; // Before 이미지
  final_image_base64?: string; // After 이미지
}

// 저장할 프로젝트 타입
export interface SavedProject {
  id: string;
  title: string;
  createdAt: string;
  beforeImage: string; // base64 or URL
  afterImage: string; // base64 or URL
  mood: string[];
  residenceType: string;
  circleInfo: AIResponse['circle_info'];
  backgroundMood: AIResponse['background_mood'];
  recommendedProducts: AIResponse['recommended_products'];
}

// 프로젝트 저장
export function saveProject(
  title: string,
  beforeImage: string,
  afterImage: string,
  mood: string[],
  residenceType: string,
  response: AIResponse
): SavedProject {
  const projectId = Date.now().toString();

  const project: SavedProject = {
    id: projectId,
    title,
    createdAt: new Date().toISOString(),
    beforeImage,
    afterImage,
    mood,
    residenceType,
    circleInfo: response.circle_info,
    backgroundMood: response.background_mood,
    recommendedProducts: response.recommended_products,
  };

  // localStorage에 저장
  localStorage.setItem(`project_${projectId}`, JSON.stringify(project));

  // 내 프로젝트 목록에 추가
  const myProjects = getMyProjects();
  myProjects.unshift(projectId); // 최신순으로 추가
  localStorage.setItem('my_projects', JSON.stringify(myProjects));

  return project;
}

// 프로젝트 조회
export function getProject(projectId: string): SavedProject | null {
  const projectData = localStorage.getItem(`project_${projectId}`);
  if (!projectData) return null;

  try {
    return JSON.parse(projectData);
  } catch {
    return null;
  }
}

// 내 프로젝트 목록 조회
export function getMyProjects(): string[] {
  const myProjectsData = localStorage.getItem('my_projects');
  if (!myProjectsData) return [];

  try {
    return JSON.parse(myProjectsData);
  } catch {
    return [];
  }
}

// 프로젝트 삭제
export function deleteProject(projectId: string): boolean {
  try {
    // 프로젝트 데이터 삭제
    localStorage.removeItem(`project_${projectId}`);

    // 목록에서 제거
    const myProjects = getMyProjects();
    const updatedProjects = myProjects.filter(id => id !== projectId);
    localStorage.setItem('my_projects', JSON.stringify(updatedProjects));

    return true;
  } catch {
    return false;
  }
}

// 최근 프로젝트 N개 가져오기
export function getRecentProjects(count: number = 10): SavedProject[] {
  const projectIds = getMyProjects().slice(0, count);
  return projectIds
    .map(id => getProject(id))
    .filter((project): project is SavedProject => project !== null);
}
