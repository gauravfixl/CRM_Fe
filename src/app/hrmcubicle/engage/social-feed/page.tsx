"use client"

import React, { useState, useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { useToast } from "@/shared/components/ui/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import {
    MessageCircle,
    ThumbsUp,
    Send,
    Image as ImageIcon,
    AtSign,
    Star,
    TrendingUp,
    Sparkles,
    Users,
    Trophy,
    Megaphone,
    BarChart3,
    ChevronDown,
    ChevronUp,
    MoreHorizontal,
    Edit,
    Trash2,
    Plus,
    X
} from "lucide-react";
import { useSocialFeedStore, type PostType, type ValueTag, type SocialPost } from "@/shared/data/social-feed-store";
import { required, minLength, maxLength, runValidators } from "@/shared/utils/engage-validation";

const employeeSuggestions = [
    "Priya Sharma", "Rajesh Kumar", "Sneha Rao", "Vikram Singh", "Amit Joshi",
    "Kavita Patel", "Deepak Nair", "Meera Iyer", "Arjun Reddy", "Neha Gupta",
    "Suresh Mehta", "Rahul Verma", "Anita Desai", "Karan Malhotra"
];

const valueColors: Record<ValueTag, string> = {
    Innovation: "bg-blue-100 text-blue-700 border-blue-200",
    Teamwork: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Customer First": "bg-amber-100 text-amber-700 border-amber-200",
    Excellence: "bg-purple-100 text-purple-700 border-purple-200",
    Leadership: "bg-rose-100 text-rose-700 border-rose-200",
};

type FilterValue = "All" | PostType;

const filterOptions: { label: string; value: FilterValue }[] = [
    { label: "All", value: "All" },
    { label: "Shoutouts", value: "Shoutout" },
    { label: "Achievements", value: "Achievement" },
    { label: "Announcements", value: "Announcement" },
    { label: "Polls", value: "Poll" },
];

const typeIcon = (type: PostType) => {
    switch (type) {
        case "Shoutout": return <Star size={14} className="text-amber-500" />;
        case "Achievement": return <Trophy size={14} className="text-emerald-500" />;
        case "Announcement": return <Megaphone size={14} className="text-blue-500" />;
        case "Poll": return <BarChart3 size={14} className="text-purple-500" />;
    }
};

const SocialFeedPage = () => {
    const { toast } = useToast();
    const { posts, addPost, updatePost, deletePost, toggleLike, addComment, deleteComment, votePoll } = useSocialFeedStore();

    const [filter, setFilter] = useState<FilterValue>("All");
    const [newPost, setNewPost] = useState("");
    const [newPostType, setNewPostType] = useState<PostType>("Shoutout");
    const [newPostTag, setNewPostTag] = useState("");
    const [newPostValue, setNewPostValue] = useState<ValueTag | "">("");
    const [newPollOptions, setNewPollOptions] = useState<string[]>(["", ""]);
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
    const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);

    // Edit post dialog
    const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
    const [editContent, setEditContent] = useState("");
    const [editTag, setEditTag] = useState("");
    const [editValue, setEditValue] = useState<ValueTag | "">("");

    const filteredPosts = useMemo(
        () => filter === "All" ? posts : posts.filter(p => p.type === filter),
        [posts, filter]
    );

    const toggleComments = (postId: string) => {
        const next = new Set(expandedComments);
        if (next.has(postId)) next.delete(postId); else next.add(postId);
        setExpandedComments(next);
    };

    const handleComment = (postId: string) => {
        const text = commentInputs[postId]?.trim();
        if (!text) return;
        if (text.length < 2) {
            toast({ title: "Comment Too Short", description: "Comment must be at least 2 characters.", variant: "destructive" });
            return;
        }
        if (text.length > 500) {
            toast({ title: "Comment Too Long", description: "Max 500 characters.", variant: "destructive" });
            return;
        }
        addComment(postId, text);
        setCommentInputs({ ...commentInputs, [postId]: "" });
    };

    const resetNewPostForm = () => {
        setNewPost("");
        setNewPostTag("");
        setNewPostValue("");
        setNewPollOptions(["", ""]);
    };

    const handleNewPost = () => {
        const contentError = runValidators(
            required(newPost, "content", "Post content"),
            minLength(newPost, 3, "content", "Post content"),
            maxLength(newPost, 2000, "content", "Post content")
        );
        if (contentError) {
            toast({ title: "Invalid Post", description: contentError.message, variant: "destructive" });
            return;
        }
        if (newPostTag && newPostTag.length > 80) {
            toast({ title: "Tag Too Long", description: "Employee name must be under 80 characters.", variant: "destructive" });
            return;
        }

        let pollOptions: { text: string; votes: number }[] | undefined = undefined;
        if (newPostType === "Poll") {
            const validOptions = newPollOptions.map(o => o.trim()).filter(Boolean);
            if (validOptions.length < 2) {
                toast({ title: "Poll needs options", description: "Add at least 2 poll options.", variant: "destructive" });
                return;
            }
            if (validOptions.length > 8) {
                toast({ title: "Too Many Options", description: "Max 8 poll options.", variant: "destructive" });
                return;
            }
            const duplicates = new Set(validOptions.map(o => o.toLowerCase()));
            if (duplicates.size !== validOptions.length) {
                toast({ title: "Duplicate Options", description: "Each option must be unique.", variant: "destructive" });
                return;
            }
            if (validOptions.some(o => o.length > 100)) {
                toast({ title: "Option Too Long", description: "Each option must be under 100 characters.", variant: "destructive" });
                return;
            }
            pollOptions = validOptions.map(text => ({ text, votes: 0 }));
        }

        addPost({
            author: "You",
            authorRole: "Employee",
            authorInitials: "ME",
            content: newPost,
            type: newPostType,
            taggedEmployee: newPostTag || undefined,
            valueTag: newPostValue || undefined,
            pollOptions
        });

        resetNewPostForm();
        toast({ title: "Post Published", description: "Your post is now visible to everyone." });
    };

    const handleInsertTag = (name: string) => {
        setNewPostTag(name);
        setShowTagSuggestions(false);
    };

    const addPollOption = () => setNewPollOptions([...newPollOptions, ""]);
    const removePollOption = (idx: number) => setNewPollOptions(newPollOptions.filter((_, i) => i !== idx));
    const updatePollOption = (idx: number, value: string) => {
        const next = [...newPollOptions];
        next[idx] = value;
        setNewPollOptions(next);
    };

    const openEditPost = (post: SocialPost) => {
        setEditingPost(post);
        setEditContent(post.content);
        setEditTag(post.taggedEmployee ?? "");
        setEditValue(post.valueTag ?? "");
    };

    const handleSaveEdit = () => {
        if (!editingPost) return;
        const contentError = runValidators(
            required(editContent, "content", "Content"),
            minLength(editContent, 3, "content", "Content"),
            maxLength(editContent, 2000, "content", "Content")
        );
        if (contentError) {
            toast({ title: "Invalid Content", description: contentError.message, variant: "destructive" });
            return;
        }
        if (editTag && editTag.length > 80) {
            toast({ title: "Tag Too Long", description: "Employee name must be under 80 characters.", variant: "destructive" });
            return;
        }
        updatePost(editingPost.id, {
            content: editContent,
            taggedEmployee: editTag || undefined,
            valueTag: editValue || undefined
        });
        setEditingPost(null);
        toast({ title: "Post Updated" });
    };

    const handleDeletePost = (id: string) => {
        deletePost(id);
        toast({ title: "Post Deleted" });
    };

    const handleDeleteComment = (postId: string, commentId: string) => {
        deleteComment(postId, commentId);
        toast({ title: "Comment Removed" });
    };

    const leaderboard = useMemo(() => {
        const recipients = posts
            .filter(p => p.taggedEmployee)
            .reduce((acc, p) => {
                const name = p.taggedEmployee!;
                acc[name] = (acc[name] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
        return Object.entries(recipients)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({
                name,
                initials: name.split(" ").map(n => n[0]).join(""),
                count
            }));
    }, [posts]);

    const filteredSuggestions = employeeSuggestions.filter(
        s => s.toLowerCase().includes(newPostTag.toLowerCase()) && s !== newPostTag
    );

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
                                    <div className="flex-1 space-y-1">
                                        <Textarea
                                            placeholder="Share a shoutout, achievement, or announcement..."
                                            className="bg-slate-50 border-slate-200 min-h-[60px] resize-none"
                                            value={newPost}
                                            maxLength={2000}
                                            onChange={e => setNewPost(e.target.value)}
                                        />
                                        <p className="text-[10px] text-slate-400">{newPost.length}/2000 • min 3</p>
                                    </div>
                                </div>

                                {/* Tag field (inline) */}
                                {(newPostType === "Shoutout" || newPostTag) && (
                                    <div className="flex items-center gap-2 pl-[52px]">
                                        <AtSign size={14} className="text-slate-400" />
                                        <div className="relative flex-1">
                                            <Input
                                                placeholder="Tag an employee (optional)"
                                                className="h-8 text-xs bg-slate-50"
                                                value={newPostTag}
                                                maxLength={80}
                                                onChange={e => { setNewPostTag(e.target.value); setShowTagSuggestions(true); }}
                                                onFocus={() => setShowTagSuggestions(true)}
                                                onBlur={() => setTimeout(() => setShowTagSuggestions(false), 150)}
                                            />
                                            {showTagSuggestions && newPostTag && filteredSuggestions.length > 0 && (
                                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-40 overflow-auto">
                                                    {filteredSuggestions.slice(0, 5).map(s => (
                                                        <div
                                                            key={s}
                                                            className="px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer"
                                                            onMouseDown={() => handleInsertTag(s)}
                                                        >
                                                            {s}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {newPostType === "Shoutout" && (
                                            <Select value={newPostValue} onValueChange={v => setNewPostValue(v as ValueTag)}>
                                                <SelectTrigger className="w-[140px] h-8 text-xs bg-slate-50">
                                                    <SelectValue placeholder="Value tag" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(Object.keys(valueColors) as ValueTag[]).map(v => (
                                                        <SelectItem key={v} value={v}>{v}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                )}

                                {/* Poll options builder */}
                                {newPostType === "Poll" && (
                                    <div className="pl-[52px] space-y-2">
                                        <Label className="text-xs text-slate-500">Poll Options</Label>
                                        {newPollOptions.map((opt, i) => (
                                            <div key={i} className="flex gap-2">
                                                <Input
                                                    placeholder={`Option ${i + 1}`}
                                                    className="h-8 text-xs bg-slate-50"
                                                    value={opt}
                                                    maxLength={100}
                                                    onChange={e => updatePollOption(i, e.target.value)}
                                                />
                                                {newPollOptions.length > 2 && (
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-400" onClick={() => removePollOption(i)}>
                                                        <X size={12} />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        {newPollOptions.length < 8 && (
                                            <Button size="sm" variant="outline" className="text-xs" onClick={addPollOption}>
                                                <Plus size={12} className="mr-1" /> Add Option
                                            </Button>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-slate-400 hover:text-slate-600 text-xs"
                                            onClick={() => toast({ title: "Photo upload", description: "Image upload requires backend integration." })}
                                        >
                                            <ImageIcon size={14} className="mr-1" /> Photo
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-slate-400 hover:text-slate-600 text-xs"
                                            onClick={() => setShowTagSuggestions(true)}
                                        >
                                            <AtSign size={14} className="mr-1" /> Tag
                                        </Button>
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
                            {filterOptions.map(f => (
                                <Button
                                    key={f.value}
                                    variant={filter === f.value ? "default" : "outline"}
                                    size="sm"
                                    className={filter === f.value ? "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]" : "border-slate-200 text-slate-600"}
                                    onClick={() => setFilter(f.value)}
                                >
                                    {f.label}
                                </Button>
                            ))}
                        </div>

                        {/* Posts */}
                        {filteredPosts.length === 0 ? (
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-12 text-center">
                                <p className="text-slate-400 text-lg">No posts to show.</p>
                            </Card>
                        ) : filteredPosts.map(post => (
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
                                                {post.isOwn && <Badge variant="outline" className="text-[10px] px-1.5 bg-purple-50 text-purple-600 border-purple-200">You</Badge>}
                                            </div>
                                            <p className="text-xs text-slate-400">{post.authorRole} &middot; {post.timestamp}</p>
                                        </div>
                                        {post.isOwn && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditPost(post)}>
                                                        <Edit size={12} className="mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-rose-500" onClick={() => handleDeletePost(post.id)}>
                                                        <Trash2 size={12} className="mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>

                                    {/* Kudos badge */}
                                    {post.taggedEmployee && post.valueTag && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 flex-wrap">
                                            <Sparkles size={16} className="text-amber-500" />
                                            <span className="text-sm font-medium text-amber-800">
                                                {post.author} recognized <strong>{post.taggedEmployee}</strong> for
                                            </span>
                                            <Badge variant="outline" className={valueColors[post.valueTag]}>{post.valueTag}</Badge>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                                    {/* Poll */}
                                    {post.pollOptions && (
                                        <div className="space-y-2">
                                            {post.pollOptions.map((opt, i) => {
                                                const totalVotes = post.pollOptions!.reduce((s, o) => s + o.votes, 0);
                                                const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                                                const isVoted = post.pollVoted === i;
                                                return (
                                                    <div
                                                        key={i}
                                                        className={`relative ${post.pollVoted === undefined ? "cursor-pointer" : "cursor-default"}`}
                                                        onClick={() => post.pollVoted === undefined && votePoll(post.id, i)}
                                                    >
                                                        <div className={`h-10 rounded-lg border overflow-hidden relative ${isVoted ? "border-purple-300" : "border-slate-200"}`}>
                                                            <div className={`absolute inset-0 ${isVoted ? "bg-purple-100" : "bg-purple-50"}`} style={{ width: `${pct}%` }} />
                                                            <div className="relative px-3 h-full flex items-center justify-between">
                                                                <span className={`text-sm font-medium ${isVoted ? "text-purple-700" : "text-slate-700"}`}>
                                                                    {opt.text} {isVoted && "✓"}
                                                                </span>
                                                                <span className="text-xs font-bold text-slate-500">{pct}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <p className="text-xs text-slate-400">
                                                {post.pollOptions.reduce((s, o) => s + o.votes, 0)} votes
                                                {post.pollVoted !== undefined && " · You voted"}
                                            </p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                                        <Button variant="ghost" size="sm" className={`text-xs ${post.liked ? "text-[#8B5CF6]" : "text-slate-400"}`} onClick={() => toggleLike(post.id)}>
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
                                                <div key={c.id} className="flex gap-2 group">
                                                    <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px] shrink-0">{c.authorInitials}</div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-slate-700">{c.author}</span>
                                                            <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                                                            {c.isOwn && (
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-500"
                                                                    onClick={() => handleDeleteComment(post.id, c.id)}
                                                                >
                                                                    <Trash2 size={10} />
                                                                </Button>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-600">{c.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Write a comment..."
                                                    className="h-8 text-xs bg-slate-50"
                                                    value={commentInputs[post.id] || ""}
                                                    maxLength={500}
                                                    onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                                    onKeyDown={e => e.key === "Enter" && handleComment(post.id)}
                                                />
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
                                    {leaderboard.length === 0 ? (
                                        <p className="text-xs text-slate-400">No recognitions yet.</p>
                                    ) : leaderboard.map((emp, i) => (
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
                                <div className="flex flex-wrap gap-2">
                                    {(Object.keys(valueColors) as ValueTag[]).map(v => (
                                        <Badge key={v} variant="outline" className={valueColors[v]}>{v}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Most Active */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardContent className="p-5">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Users size={16} className="text-blue-500" /> Most Active</h3>
                                <div className="space-y-2">
                                    {Array.from(new Set(posts.map(p => p.author))).slice(0, 3).map(name => (
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

            {/* Edit Post Dialog */}
            <Dialog open={!!editingPost} onOpenChange={(val) => { if (!val) setEditingPost(null); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Post</DialogTitle>
                        <DialogDescription>Update your post content.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Content</Label>
                            <Textarea
                                value={editContent}
                                maxLength={2000}
                                onChange={e => setEditContent(e.target.value)}
                                rows={4}
                            />
                            <p className="text-[10px] text-slate-400">{editContent.length}/2000 • min 3</p>
                        </div>
                        {editingPost?.type === "Shoutout" && (
                            <>
                                <div className="space-y-2">
                                    <Label>Tagged Employee</Label>
                                    <Input
                                        value={editTag}
                                        maxLength={80}
                                        onChange={e => setEditTag(e.target.value)}
                                        placeholder="e.g. Priya Sharma"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Value Tag</Label>
                                    <Select value={editValue || "none"} onValueChange={v => setEditValue(v === "none" ? "" : v as ValueTag)}>
                                        <SelectTrigger><SelectValue placeholder="Select value" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            {(Object.keys(valueColors) as ValueTag[]).map(v => (
                                                <SelectItem key={v} value={v}>{v}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingPost(null)}>Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={handleSaveEdit}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SocialFeedPage;
