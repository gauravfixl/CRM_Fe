"use client"

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useToast } from "@/shared/components/ui/use-toast";
import {
    MessageCircle,
    ThumbsUp,
    Send,
    Image,
    AtSign,
    Star,
    Award,
    TrendingUp,
    Filter,
    Heart,
    Sparkles,
    Users,
    Trophy,
    Megaphone,
    BarChart3,
    ChevronDown,
    ChevronUp
} from "lucide-react";

type PostType = "Shoutout" | "Achievement" | "Announcement" | "Poll";
type ValueTag = "Innovation" | "Teamwork" | "Customer First" | "Excellence" | "Leadership";

type Post = {
    id: string;
    author: string;
    authorRole: string;
    authorInitials: string;
    timestamp: string;
    content: string;
    type: PostType;
    likes: number;
    comments: Comment[];
    liked: boolean;
    taggedEmployee?: string;
    valueTag?: ValueTag;
    pollOptions?: { text: string; votes: number }[];
};

type Comment = {
    id: string;
    author: string;
    authorInitials: string;
    content: string;
    timestamp: string;
};

const mockPosts: Post[] = [
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

const leaderboard = [
    { name: "Sneha Rao", initials: "SR", count: 12 },
    { name: "Arjun Reddy", initials: "AR", count: 10 },
    { name: "Kavita Patel", initials: "KP", count: 8 },
    { name: "Priya Sharma", initials: "PS", count: 7 },
    { name: "Vikram Singh", initials: "VS", count: 6 },
];

const valueColors: Record<ValueTag, string> = {
    Innovation: "bg-blue-100 text-blue-700 border-blue-200",
    Teamwork: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Customer First": "bg-amber-100 text-amber-700 border-amber-200",
    Excellence: "bg-purple-100 text-purple-700 border-purple-200",
    Leadership: "bg-rose-100 text-rose-700 border-rose-200",
};

const SocialFeedPage = () => {
    const { toast } = useToast();
    const [posts, setPosts] = useState(mockPosts);
    const [filter, setFilter] = useState<string>("All");
    const [newPost, setNewPost] = useState("");
    const [newPostType, setNewPostType] = useState<PostType>("Shoutout");
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
    const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

    const filteredPosts = filter === "All" ? posts : posts.filter(p => p.type === filter);

    const handleLike = (postId: string) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
    };

    const toggleComments = (postId: string) => {
        const next = new Set(expandedComments);
        if (next.has(postId)) next.delete(postId); else next.add(postId);
        setExpandedComments(next);
    };

    const handleComment = (postId: string) => {
        const text = commentInputs[postId]?.trim();
        if (!text) return;
        const newComment: Comment = { id: `c-${Date.now()}`, author: "You", authorInitials: "ME", content: text, timestamp: "Just now" };
        setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
        setCommentInputs({ ...commentInputs, [postId]: "" });
    };

    const handleNewPost = () => {
        if (!newPost.trim()) return;
        const post: Post = {
            id: `p-${Date.now()}`, author: "You", authorRole: "Employee", authorInitials: "ME",
            timestamp: "Just now", content: newPost, type: newPostType, likes: 0, liked: false, comments: []
        };
        setPosts([post, ...posts]);
        setNewPost("");
        toast({ title: "Post Published", description: "Your post is now visible to everyone." });
    };

    const handleVote = (postId: string, optionIndex: number) => {
        setPosts(posts.map(p => {
            if (p.id !== postId || !p.pollOptions) return p;
            const opts = [...p.pollOptions];
            opts[optionIndex] = { ...opts[optionIndex], votes: opts[optionIndex].votes + 1 };
            return { ...p, pollOptions: opts };
        }));
        toast({ title: "Vote Recorded" });
    };

    const typeIcon = (type: PostType) => {
        switch (type) {
            case "Shoutout": return <Star size={14} className="text-amber-500" />;
            case "Achievement": return <Trophy size={14} className="text-emerald-500" />;
            case "Announcement": return <Megaphone size={14} className="text-blue-500" />;
            case "Poll": return <BarChart3 size={14} className="text-purple-500" />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="h-20 px-8 flex justify-between items-center bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                        <MessageCircle size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Social Feed</h1>
                        <p className="text-sm font-medium text-slate-500">Company praise wall, shoutouts, and announcements.</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="max-w-6xl mx-auto px-8 py-6 flex gap-6">
                    {/* Main Feed */}
                    <div className="flex-1 space-y-6">
                        {/* Post Creation */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardContent className="p-5 space-y-4">
                                <div className="flex gap-3">
                                    <div className="h-10 w-10 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm shrink-0">ME</div>
                                    <Input placeholder="Share a shoutout, achievement, or announcement..." className="flex-1 bg-slate-50 border-slate-200" value={newPost} onChange={e => setNewPost(e.target.value)} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600 text-xs"><Image size={14} className="mr-1" /> Photo</Button>
                                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600 text-xs"><AtSign size={14} className="mr-1" /> Tag</Button>
                                        <Select value={newPostType} onValueChange={v => setNewPostType(v as PostType)}>
                                            <SelectTrigger className="w-[140px] h-8 text-xs bg-slate-50"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Shoutout">Shoutout</SelectItem>
                                                <SelectItem value="Achievement">Achievement</SelectItem>
                                                <SelectItem value="Announcement">Announcement</SelectItem>
                                                <SelectItem value="Poll">Poll</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button size="sm" className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={handleNewPost}>
                                        <Send size={14} className="mr-1" /> Post
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Filter */}
                        <div className="flex gap-2">
                            {["All", "Shoutouts", "Achievements", "Announcements", "Polls"].map(f => (
                                <Button key={f} variant={filter === (f === "Shoutouts" ? "Shoutout" : f === "Achievements" ? "Achievement" : f === "Announcements" ? "Announcement" : f === "Polls" ? "Poll" : f) ? "default" : "outline"} size="sm"
                                    className={filter === (f === "Shoutouts" ? "Shoutout" : f === "Achievements" ? "Achievement" : f === "Announcements" ? "Announcement" : f === "Polls" ? "Poll" : f) ? "bg-[#8B5CF6] text-white" : "border-slate-200 text-slate-600"}
                                    onClick={() => setFilter(f === "Shoutouts" ? "Shoutout" : f === "Achievements" ? "Achievement" : f === "Announcements" ? "Announcement" : f === "Polls" ? "Poll" : "All")}
                                >
                                    {f}
                                </Button>
                            ))}
                        </div>

                        {/* Posts */}
                        {filteredPosts.map(post => (
                            <Card key={post.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardContent className="p-5 space-y-4">
                                    {/* Author */}
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm">{post.authorInitials}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-900">{post.author}</span>
                                                {typeIcon(post.type)}
                                                <Badge variant="outline" className="text-[10px] px-1.5">{post.type}</Badge>
                                            </div>
                                            <p className="text-xs text-slate-400">{post.authorRole} &middot; {post.timestamp}</p>
                                        </div>
                                    </div>

                                    {/* Kudos badge */}
                                    {post.taggedEmployee && post.valueTag && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
                                            <Sparkles size={16} className="text-amber-500" />
                                            <span className="text-sm font-medium text-amber-800">
                                                {post.author} recognized <strong>{post.taggedEmployee}</strong> for
                                            </span>
                                            <Badge variant="outline" className={valueColors[post.valueTag]}>{post.valueTag}</Badge>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <p className="text-sm text-slate-700 leading-relaxed">{post.content}</p>

                                    {/* Poll */}
                                    {post.pollOptions && (
                                        <div className="space-y-2">
                                            {post.pollOptions.map((opt, i) => {
                                                const totalVotes = post.pollOptions!.reduce((s, o) => s + o.votes, 0);
                                                const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                                                return (
                                                    <div key={i} className="relative cursor-pointer" onClick={() => handleVote(post.id, i)}>
                                                        <div className="h-10 rounded-lg border border-slate-200 overflow-hidden relative">
                                                            <div className="absolute inset-0 bg-purple-50" style={{ width: `${pct}%` }} />
                                                            <div className="relative px-3 h-full flex items-center justify-between">
                                                                <span className="text-sm font-medium text-slate-700">{opt.text}</span>
                                                                <span className="text-xs font-bold text-slate-500">{pct}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <p className="text-xs text-slate-400">{post.pollOptions.reduce((s, o) => s + o.votes, 0)} votes</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                                        <Button variant="ghost" size="sm" className={`text-xs ${post.liked ? "text-[#8B5CF6]" : "text-slate-400"}`} onClick={() => handleLike(post.id)}>
                                            <ThumbsUp size={14} className={`mr-1 ${post.liked ? "fill-[#8B5CF6]" : ""}`} /> {post.likes}
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-xs text-slate-400" onClick={() => toggleComments(post.id)}>
                                            <MessageCircle size={14} className="mr-1" /> {post.comments.length}
                                            {expandedComments.has(post.id) ? <ChevronUp size={12} className="ml-1" /> : <ChevronDown size={12} className="ml-1" />}
                                        </Button>
                                    </div>

                                    {/* Comments */}
                                    {expandedComments.has(post.id) && (
                                        <div className="space-y-3 pl-4 border-l-2 border-slate-100">
                                            {post.comments.map(c => (
                                                <div key={c.id} className="flex gap-2">
                                                    <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px] shrink-0">{c.authorInitials}</div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-slate-700">{c.author}</span>
                                                            <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-600">{c.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex gap-2">
                                                <Input placeholder="Write a comment..." className="h-8 text-xs bg-slate-50" value={commentInputs[post.id] || ""} onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })} onKeyDown={e => e.key === "Enter" && handleComment(post.id)} />
                                                <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => handleComment(post.id)}>
                                                    <Send size={12} />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="w-72 space-y-6 shrink-0">
                        {/* Leaderboard */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardContent className="p-5">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Trophy size={16} className="text-amber-500" /> Top Recognized</h3>
                                <div className="space-y-3">
                                    {leaderboard.map((emp, i) => (
                                        <div key={emp.name} className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-slate-400 w-5">{i + 1}</span>
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-[10px] ${i === 0 ? "bg-amber-500" : i === 1 ? "bg-slate-400" : i === 2 ? "bg-orange-400" : "bg-slate-300"}`}>{emp.initials}</div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-700">{emp.name}</p>
                                            </div>
                                            <Badge variant="outline" className="text-[10px]">{emp.count}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Trending */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardContent className="p-5">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-emerald-500" /> Trending Values</h3>
                                <div className="space-y-2">
                                    {(Object.keys(valueColors) as ValueTag[]).map(v => (
                                        <Badge key={v} variant="outline" className={`${valueColors[v]} mr-1`}>{v}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Most Active */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardContent className="p-5">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Users size={16} className="text-blue-500" /> Most Active</h3>
                                <div className="space-y-2">
                                    {["Rajesh Kumar", "Deepak Nair", "Priya Sharma"].map(name => (
                                        <div key={name} className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[9px]">{name.split(" ").map(n => n[0]).join("")}</div>
                                            <span className="text-xs font-medium text-slate-600">{name}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialFeedPage;
