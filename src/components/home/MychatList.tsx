'use client';

import MychatItem from './MychatItem';

const mockProjects = [
  {
    id: '1',
    thumbnail: '🛋️',
    title: '미니멀 원룸 프로젝트',
    date: '2024.01.10',
    tags: ['#미니멀', '#모던', '#무타공'],
  },
  {
    id: '2',
    thumbnail: '🪴',
    title: '내추럴 우드톤 인테리어',
    date: '2024.01.08',
    tags: ['#우드', '#내추럴', '#식물'],
  },
  {
    id: '3',
    thumbnail: '🎨',
    title: '컬러풀 스튜디오',
    date: '2024.01.05',
    tags: ['#컬러풀', '#레트로', '#개성'],
  },
  {
    id: '4',
    thumbnail: '💡',
    title: '북유럽 감성 방',
    date: '2024.01.03',
    tags: ['#북유럽', '#심플', '#화이트'],
  },
  {
    id: '5',
    thumbnail: '🌙',
    title: '다크 모던 인테리어',
    date: '2023.12.28',
    tags: ['#다크', '#모던', '#고급'],
  },
  {
    id: '6',
    thumbnail: '🌸',
    title: '로맨틱 원룸',
    date: '2023.12.25',
    tags: ['#핑크', '#로맨틱', '#감성'],
  },
  {
    id: '7',
    thumbnail: '🏡',
    title: '빈티지 감성 주방 리모델링',
    date: '2023.12.20',
    tags: ['#빈티지', '#주방', '#레트로'],
  },
  {
    id: '8',
    thumbnail: '✨',
    title: '모던 럭셔리 침실',
    date: '2023.12.15',
    tags: ['#럭셔리', '#침실', '#모던'],
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
