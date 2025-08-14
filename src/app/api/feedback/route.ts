import { NextResponse } from 'next/server';

interface FeedbackItem {
  id: string;
  category: 'Bug' | 'Feature' | 'Praise' | 'General';
  rating: number; // 1-5
  comment: string;
  userEmail: string;
  status: 'New' | 'Reviewed' | 'Resolved';
  createdAt: string;
}

let FEEDBACK_STORE: FeedbackItem[] = [
  {
    id: 'fb_1',
    category: 'Praise',
    rating: 5,
    comment: 'The PostgreSQL spatial querying response times are phenomenally fast, sub-5ms across our clusters.',
    userEmail: 'devlead@valefflabs.io',
    status: 'Reviewed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'fb_2',
    category: 'Feature',
    rating: 4,
    comment: 'Would love automated Slack webhook notifications when DLQ job queues spike.',
    userEmail: 'infra@cloudops.net',
    status: 'New',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'fb_3',
    category: 'General',
    rating: 5,
    comment: 'Clean architecture and exceptional full-stack developer experience.',
    userEmail: 'cto@saasstarter.co',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

export async function GET() {
  const ratings = FEEDBACK_STORE.map(f => f.rating);
  const avgRating = ratings.length ? parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)) : 0;
  
  return NextResponse.json({
    feedback: FEEDBACK_STORE,
    analytics: {
      total: FEEDBACK_STORE.length,
      averageRating: avgRating,
      ratingDistribution: {
        5: FEEDBACK_STORE.filter(f => f.rating === 5).length,
        4: FEEDBACK_STORE.filter(f => f.rating === 4).length,
        3: FEEDBACK_STORE.filter(f => f.rating === 3).length,
        2: FEEDBACK_STORE.filter(f => f.rating === 2).length,
        1: FEEDBACK_STORE.filter(f => f.rating === 1).length,
      }
    }
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const newItem: FeedbackItem = {
    id: 'fb_' + Date.now(),
    category: body.category || 'General',
    rating: body.rating || 5,
    comment: body.comment || '',
    userEmail: body.userEmail || 'anonymous@user.com',
    status: 'New',
    createdAt: new Date().toISOString()
  };

  FEEDBACK_STORE.unshift(newItem);
  return NextResponse.json({ message: 'Feedback recorded', item: newItem }, { status: 201 });
}
