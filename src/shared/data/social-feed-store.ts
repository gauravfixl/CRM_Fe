import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PostType = "Shoutout" | "Achievement" | "Announcement" | "Poll";
export type ValueTag = "Innovation" | "Teamwork" | "Customer First" | "Excellence" | "Leadership";

export interface PostComment {
    id: string;
    author: string;
    authorInitials: string;
    content: string;
    timestamp: string;
    isOwn?: boolean;
}

export interface PollOption {
    text: string;
    votes: number;
}

export interface SocialPost {
    id: string;
    author: string;
    authorRole: string;
    authorInitials: string;
    timestamp: string;
    content: string;
    type: PostType;
    likes: number;
    comments: PostComment[];
    liked: boolean;
    taggedEmployee?: string;
    valueTag?: ValueTag;
    pollOptions?: PollOption[];
    pollVoted?: number; // index of option voted for
    isOwn?: boolean;
}

interface SocialFeedState {
    posts: SocialPost[];
    addPost: (post: Omit<SocialPost, 'id' | 'timestamp' | 'likes' | 'comments' | 'liked' | 'isOwn'>) => void;
    updatePost: (id: string, updates: Partial<SocialPost>) => void;
    deletePost: (id: string) => void;
    toggleLike: (id: string) => void;
    addComment: (postId: string, content: string) => void;
    deleteComment: (postId: string, commentId: string) => void;
    votePoll: (postId: string, optionIndex: number) => void;
}

const seedPosts: SocialPost[] = [
    {
        id: "p1", author: "HR Admin", authorRole: "People Operations", authorInitials: "HA", timestamp: "2 hours ago", type: "Announcement",
        content: "Team, we're excited to announce our new Flexible Work Policy starting next month! Check the policy center for details.", likes: 24, liked: false,
        comments: [
            { id: "c1", author: "Priya Sharma", authorInitials: "PS", content: "This is amazing! Thanks for listening to employee feedback.", timestamp: "1 hour ago" },
            { id: "c2", author: "Vikram Singh", authorInitials: "VS", content: "Great initiative! Looking forward to it.", timestamp: "45 min ago" },
        ]
    },
    {
        id: "p2", author: "Rajesh Kumar", authorRole: "Engineering Manager", authorInitials: "RK", timestamp: "4 hours ago", type: "Shoutout",
        content: "Huge shoutout to Sneha Rao for going above and beyond on the client demo yesterday! Your preparation and presentation skills are top-notch.", likes: 18, liked: true,
        taggedEmployee: "Sneha Rao", valueTag: "Excellence",
        comments: [{ id: "c3", author: "Amit Joshi", authorInitials: "AJ", content: "Well deserved! Sneha is a rockstar!", timestamp: "3 hours ago" }]
    },
    {
        id: "p3", author: "Kavita Patel", authorRole: "Product Lead", authorInitials: "KP", timestamp: "6 hours ago", type: "Achievement",
        content: "Proud to share that our team shipped the v3.0 release ahead of schedule! Couldn't have done it without this amazing team.", likes: 32, liked: false,
        comments: []
    },
    {
        id: "p4", author: "Deepak Nair", authorRole: "CTO", authorInitials: "DN", timestamp: "1 day ago", type: "Shoutout",
        content: "Recognizing Arjun Reddy for his innovative approach to solving our caching problem. Saved us 40% in infra costs!", likes: 45, liked: true,
        taggedEmployee: "Arjun Reddy", valueTag: "Innovation",
        comments: [
            { id: "c4", author: "Meera Iyer", authorInitials: "MI", content: "Amazing work Arjun!", timestamp: "22 hours ago" },
            { id: "c5", author: "Rahul Verma", authorInitials: "RV", content: "Inspiring! This is the kind of thinking we need more of.", timestamp: "20 hours ago" },
        ]
    },
    {
        id: "p5", author: "Anita Desai", authorRole: "HR Head", authorInitials: "AD", timestamp: "1 day ago", type: "Poll",
        content: "What should be our next team outing activity?", likes: 12, liked: false,
        pollOptions: [
            { text: "Outdoor Adventure", votes: 15 },
            { text: "Cooking Class", votes: 8 },
            { text: "Escape Room", votes: 22 },
            { text: "Sports Day", votes: 18 },
        ],
        comments: []
    },
    {
        id: "p6", author: "Neha Gupta", authorRole: "Engineering Lead", authorInitials: "NG", timestamp: "2 days ago", type: "Shoutout",
        content: "Shoutout to the entire QA team for their incredible attention to detail during the release testing. Zero critical bugs in production!", likes: 28, liked: false,
        valueTag: "Teamwork",
        comments: [{ id: "c6", author: "Suresh Mehta", authorInitials: "SM", content: "Team effort! Thanks for the recognition.", timestamp: "1 day ago" }]
    },
    {
        id: "p7", author: "Vikram Singh", authorRole: "Marketing Head", authorInitials: "VS", timestamp: "3 days ago", type: "Achievement",
        content: "We just crossed 10,000 followers on our LinkedIn company page! Great work by the marketing and branding team.", likes: 56, liked: true,
        comments: []
    },
    {
        id: "p8", author: "Priya Sharma", authorRole: "Senior Developer", authorInitials: "PS", timestamp: "3 days ago", type: "Shoutout",
        content: "Thank you Kavita Patel for being an exceptional mentor. Your guidance helped me grow immensely this quarter.", likes: 19, liked: false,
        taggedEmployee: "Kavita Patel", valueTag: "Leadership",
        comments: []
    },
];

export const useSocialFeedStore = create<SocialFeedState>()(
    persist(
        (set) => ({
            posts: seedPosts,

            addPost: (post) => set((state) => ({
                posts: [
                    {
                        ...post,
                        id: `p-${Date.now()}`,
                        timestamp: "Just now",
                        likes: 0,
                        comments: [],
                        liked: false,
                        isOwn: true
                    },
                    ...state.posts
                ]
            })),

            updatePost: (id, updates) => set((state) => ({
                posts: state.posts.map(p => p.id === id ? { ...p, ...updates } : p)
            })),

            deletePost: (id) => set((state) => ({
                posts: state.posts.filter(p => p.id !== id)
            })),

            toggleLike: (id) => set((state) => ({
                posts: state.posts.map(p => p.id === id ? {
                    ...p,
                    liked: !p.liked,
                    likes: p.liked ? p.likes - 1 : p.likes + 1
                } : p)
            })),

            addComment: (postId, content) => set((state) => ({
                posts: state.posts.map(p => p.id === postId ? {
                    ...p,
                    comments: [...p.comments, {
                        id: `c-${Date.now()}`,
                        author: "You",
                        authorInitials: "ME",
                        content,
                        timestamp: "Just now",
                        isOwn: true
                    }]
                } : p)
            })),

            deleteComment: (postId, commentId) => set((state) => ({
                posts: state.posts.map(p => p.id === postId ? {
                    ...p,
                    comments: p.comments.filter(c => c.id !== commentId)
                } : p)
            })),

            votePoll: (postId, optionIndex) => set((state) => ({
                posts: state.posts.map(p => {
                    if (p.id !== postId || !p.pollOptions) return p;
                    if (p.pollVoted !== undefined) return p; // already voted
                    const opts = p.pollOptions.map((o, i) => i === optionIndex
                        ? { ...o, votes: o.votes + 1 }
                        : o
                    );
                    return { ...p, pollOptions: opts, pollVoted: optionIndex };
                })
            }))
        }),
        { name: 'social-feed-storage' }
    )
);
