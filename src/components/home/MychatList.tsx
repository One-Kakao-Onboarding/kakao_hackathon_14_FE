'use client';

import MychatItem from './MychatItem';

const mockProjects = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop',
    title: '모던 미니멀 원룸',
    date: '2024.01.10',
    tags: ['#미니멀', '#모던', '#무타공'],
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=400&fit=crop',
    title: '내추럴 우드톤 인테리어',
    date: '2024.01.08',
    tags: ['#우드', '#내추럴', '#원목'],
  },
  {
    id: '3',
    thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop',
    title: '빈티지 감성 인테리어',
    date: '2024.01.05',
    tags: ['#빈티지', '#레트로', '#감성'],
  },
];

export default function MychatList() {
  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">최근 프로젝트</h2>
        <button className="text-sm text-gray-600 hover:text-gray-900">
          전체보기 →
        </button>
      </div>

      <div className="grid grid-cols-4 gap-x-5 gap-y-10">
        {mockProjects.map((project) => (
          <MychatItem key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
}
