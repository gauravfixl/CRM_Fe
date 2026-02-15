"use client"

import React, { useState, useRef, useEffect } from "react"
import { useCollaborationStore, Comment } from "@/shared/data/collaboration-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MoreHorizontal, Send, Edit2, Trash2, CheckCircle2, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import CommentThread from "./comment-thread"

interface TaskCommentsProps {
    taskId: string;
}

export default function TaskComments({ taskId }: TaskCommentsProps) {
    const { getCommentsByTask, addComment } = useCollaborationStore()
    const allComments = getCommentsByTask(taskId)

    // Filter for root comments (no parentId)
    const rootComments = allComments.filter(c => !c.parentId)

    const [newComment, setNewComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll logic
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [allComments.length])

    const handleSubmit = async () => {
        if (!newComment.trim()) return
        setIsSubmitting(true)

        setTimeout(() => {
            addComment(taskId, newComment, {
                id: "u1",
                name: "Gaurav Garg",
                avatar: "https://i.pravatar.cc/150?u=u1"
            })
            setNewComment("")
            setIsSubmitting(false)
        }, 600)
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Comment Input */}
            <div className="flex gap-4">
                <Avatar className="h-10 w-10 border-2 border-slate-100 shadow-sm flex-shrink-0">
                    <AvatarImage src="https://i.pravatar.cc/150?u=u1" />
                    <AvatarFallback>GG</AvatarFallback>
                </Avatar>
                <div className="flex-1 relative">
                    <Textarea
                        placeholder="Add a high-level comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSubmit()
                            }
                        }}
                        className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-sm font-medium focus:bg-white focus:border-indigo-200 focus:outline-none transition-all min-h-[100px] resize-none pr-12"
                    />
                    <Button
                        size="icon"
                        disabled={isSubmitting || !newComment.trim()}
                        onClick={handleSubmit}
                        className={`absolute bottom-3 right-3 h-8 w-8 rounded-lg shadow-lg transition-all ${isSubmitting || !newComment.trim() ? 'bg-slate-200 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95'}`}
                    >
                        {isSubmitting ? <Loader2 size={14} className="animate-spin text-white" /> : <Send size={14} className="text-white" />}
                    </Button>
                </div>
            </div>

            {/* Comments List (Threaded) */}
            <div ref={scrollRef} className="space-y-8 max-h-[600px] overflow-y-auto custom-scrollbar pr-2 pb-10">
                {rootComments.length === 0 ? (
                    <div className="text-center py-10 opacity-40">
                        <MessageSquare size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">No communication streams detected</p>
                    </div>
                ) : (
                    rootComments.map((comment) => (
                        <CommentThread
                            key={comment.id}
                            comment={comment}
                            allComments={allComments}
                            taskId={taskId}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

function MessageSquare(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    )
}
