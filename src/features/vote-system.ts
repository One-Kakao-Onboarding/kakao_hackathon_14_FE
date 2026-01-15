import { Product } from './mock-products';

export interface Vote {
  id: string;
  userId: string;
  userName: string;
  products: Product[];
  aiResultImage: string;
  createdAt: string;
  votes: VoteResult[];
}

export interface VoteResult {
  voterId: string;
  voterName: string;
  selectedProductId: string;
  votedAt: string;
}

// 투표 생성
export function createVote(
  userName: string,
  products: Product[],
  aiResultImage: string
): Vote {
  const voteId = Date.now().toString();

  const vote: Vote = {
    id: voteId,
    userId: 'user_' + Math.random().toString(36).substr(2, 9),
    userName,
    products,
    aiResultImage,
    createdAt: new Date().toISOString(),
    votes: []
  };

  // localStorage에 저장
  localStorage.setItem(`vote_${voteId}`, JSON.stringify(vote));

  // 내 투표 목록에 추가
  const myVotes = getMyVotes();
  myVotes.push(voteId);
  localStorage.setItem('my_votes', JSON.stringify(myVotes));

  return vote;
}

// 투표 조회
export function getVote(voteId: string): Vote | null {
  const voteData = localStorage.getItem(`vote_${voteId}`);
  if (!voteData) return null;

  try {
    return JSON.parse(voteData);
  } catch {
    return null;
  }
}

// 투표 참여
export function submitVote(
  voteId: string,
  voterName: string,
  selectedProductId: string
): boolean {
  const vote = getVote(voteId);
  if (!vote) return false;

  // 이미 투표한 사용자인지 확인 (간단히 이름으로)
  const existingVote = vote.votes.find(v => v.voterName === voterName);
  if (existingVote) {
    // 기존 투표 업데이트
    existingVote.selectedProductId = selectedProductId;
    existingVote.votedAt = new Date().toISOString();
  } else {
    // 새 투표 추가
    vote.votes.push({
      voterId: 'voter_' + Math.random().toString(36).substr(2, 9),
      voterName,
      selectedProductId,
      votedAt: new Date().toISOString()
    });
  }

  // 업데이트된 투표 저장
  localStorage.setItem(`vote_${voteId}`, JSON.stringify(vote));

  return true;
}

// 내 투표 목록 조회
export function getMyVotes(): string[] {
  const myVotesData = localStorage.getItem('my_votes');
  if (!myVotesData) return [];

  try {
    return JSON.parse(myVotesData);
  } catch {
    return [];
  }
}

// 투표 결과 집계
export function getVoteResults(voteId: string): {
  productId: string;
  product: Product;
  count: number;
  percentage: number;
}[] {
  const vote = getVote(voteId);
  if (!vote) return [];

  const totalVotes = vote.votes.length;
  const results = vote.products.map(product => {
    const count = vote.votes.filter(v => v.selectedProductId === product.id).length;
    return {
      productId: product.id,
      product,
      count,
      percentage: totalVotes > 0 ? (count / totalVotes) * 100 : 0
    };
  });

  return results.sort((a, b) => b.count - a.count);
}

// 공유 URL 생성
export function getShareUrl(voteId: string): string {
  if (typeof window === 'undefined') return '';

  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?vote=${voteId}`;
}

// URL에서 투표 ID 추출
export function getVoteIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  return params.get('vote');
}
