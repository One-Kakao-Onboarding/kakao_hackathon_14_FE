'use client';

import { useState, useEffect } from 'react';
import MychatItem from './MychatItem';
import { getRecentProjects } from '@/features/project-storage';

export default function MychatList() {
  const [projects, setProjects] = useState<Array<{
    id: string;
    thumbnail: string;
    title: string;
    date: string;
    tags: string[];
  }>>([]);

  useEffect(() => {
    // localStorage에서 최근 프로젝트 가져오기
    const recentProjects = getRecentProjects(8);

    // MychatItem에 맞게 데이터 변환
    const formattedProjects = recentProjects.map(project => ({
      id: project.id,
      thumbnail: project.afterImage, // AI 결과 이미지를 썸네일로 사용
      title: project.title,
      date: new Date(project.createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\. /g, '.'),
      tags: project.mood.map(m => `#${m}`),
    }));

    setProjects(formattedProjects);
  }, []);

  // 프로젝트가 없을 때
  if (projects.length === 0) {
    return (
      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">최근 프로젝트</h2>
        </div>

        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <p className="text-gray-600 mb-4">아직 생성된 프로젝트가 없습니다</p>
          <p className="text-sm text-gray-500">
            AI 인테리어를 생성하고 프로젝트를 저장해보세요!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          최근 프로젝트 <span className="text-blue-600">({projects.length})</span>
        </h2>
      </div>

      <div className="grid grid-cols-4 gap-x-5 gap-y-10">
        {projects.map((project) => (
          <MychatItem key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
}
