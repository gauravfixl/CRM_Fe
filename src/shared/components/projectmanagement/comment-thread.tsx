"use client"

import React, { useState } from "react"
import {
    MessageSquare,
    Send,
    Reply,
    Edit2,
    Trash2,
    MoreVertical,
    Check,
    X
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCommentStore, formatCommentTime } from "@/shared/data/comment-store"

interface CommentThreadProps {
    taskId: string
    projectId?: string
    currentUserId: string
    currentUserName: string
    currentUserAvatar?: string
}

export default function CommentThread({
    taskId,
    projectId,
    currentUserId,
    currentUserName,
    currentUserAvatar
}: CommentThreadProps) {
    const {
        getCommentsByTask,
        createComment,
        updateComment,
        deleteComment,
        addReply,
        getCommentCount
    } = useCommentStore()

    const [newComment, setNewComment] = useState("")
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editContent, setEditContent] = useState("")

    const comments = getCommentsByTask(taskId)
    const commentCount = getCommentCount(taskId)

    const handleCreateComment = () => {
        if (!newComment.trim()) return

        createComment({
            content: newComment,
            taskId,
            projectId,
            createdBy: currentUserId,
            authorName: currentUserName,
            authorAvatar: currentUserAvatar,
            authorRole: "ProjectMember"
        })

        setNewComment("")
    }

    const handleAddReply = (parentId: string) => {
        if (!replyContent.trim()) return

        addReply(parentId, {
            content: replyContent,
            taskId,
            projectId,
            createdBy: currentUserId,
            authorName: currentUserName,
            authorAvatar: currentUserAvatar,
            authorRole: "ProjectMember"
        })

        setReplyContent("")
        setReplyingTo(null)
    }

    const handleUpdateComment = (id: string) => {
        if (!editContent.trim()) return

        updateComment(id, editContent)
        setEditingId(null)
        setEditContent("")
    }

    const handleDeleteComment = (id: string) => {
        if (confirm("Are you sure you want to delete this comment?")) {
            deleteComment(id)
        }
    }

    const startEditing = (id: string, content: string) => {
        setEditingId(id)
        setEditContent(content)
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditContent("")
    }

    const renderComment = (comment: any, isReply = false) => {
        const isEditing = editingId === comment.id
        const isReplying = replyingTo === comment.id
        const isAuthor = comment.createdBy === currentUserId

        return (
            <div key={comment.id} className={isReply ? "ml-12 mt-2" : ""}>
                <Card className={`border-none shadow-sm rounded-2xl ${isReply ? 'bg-slate-50' : 'bg-white'
                    }`}>
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <Avatar className="h-8 w-8 border-2 border-white shadow-sm shrink-0">
                                <AvatarImage src={comment.authorAvatar} />
                                <AvatarFallback className="text-[10px] font-bold bg-indigo-100 text-indigo-700">
                                    {comment.authorName[0]}
                                </AvatarFallback>
                            </Avatar>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[13px] font-bold text-slate-900">
                                            {comment.authorName}
                                        </span>
                                        {comment.authorRole && (
                                            <Badge className="bg-indigo-100 text-indigo-700 text-[9px] font-bold border-none px-2 py-0">
                                                {comment.authorRole}
                                            </Badge>
                                        )}
                                        <span className="text-[10px] text-slate-400 font-semibold">
                                            {formatCommentTime(comment.createdAt)}
                                        </span>
                                        {comment.isEdited && (
                                            <span className="text-[9px] text-slate-400 font-medium italic">
                                                (edited)
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    {isAuthor && !isEditing && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                    <MoreVertical size={14} className="text-slate-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuItem
                                                    onClick={() => startEditing(comment.id, comment.content)}
                                                    className="text-[12px] font-medium"
                                                >
                                                    <Edit2 size={12} className="mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="text-[12px] font-medium text-red-600"
                                                >
                                                    <Trash2 size={12} className="mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>

                                {/* Comment Content */}
                                {isEditing ? (
                                    <div className="space-y-2">
                                        <Textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="min-h-[60px] text-[13px] font-medium rounded-xl resize-none"
                                            placeholder="Edit your comment..."
                                        />
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleUpdateComment(comment.id)}
                                                className="h-7 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold"
                                            >
                                                <Check size={12} className="mr-1" />
                                                Save
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={cancelEditing}
                                                className="h-7 px-3 rounded-lg text-[11px] font-semibold"
                                            >
                                                <X size={12} className="mr-1" />
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-[13px] text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                                            {comment.content}
                                        </p>

                                        {/* Reply Button */}
                                        {!isReply && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setReplyingTo(comment.id)}
                                                className="h-7 px-2 mt-2 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                            >
                                                <Reply size={12} className="mr-1" />
                                                Reply
                                            </Button>
                                        )}
                                    </>
                                )}

                                {/* Reply Input */}
                                {isReplying && (
                                    <div className="mt-3 space-y-2">
                                        <Textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            className="min-h-[60px] text-[13px] font-medium rounded-xl resize-none"
                                            placeholder="Write a reply..."
                                            autoFocus
                                        />
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleAddReply(comment.id)}
                                                className="h-7 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold"
                                            >
                                                <Send size={12} className="mr-1" />
                                                Reply
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    setReplyingTo(null)
                                                    setReplyContent("")
                                                }}
                                                className="h-7 px-3 rounded-lg text-[11px] font-semibold"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Render Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="space-y-2 mt-2">
                        {comment.replies.map((reply: any) => renderComment(reply, true))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-4 font-sans">
            {/* Header */}
            <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-indigo-600" />
                <h3 className="text-[15px] font-bold text-slate-900">Comments</h3>
                <Badge className="bg-slate-100 text-slate-600 text-[10px] font-bold border-none">
                    {commentCount}
                </Badge>
            </div>

            {/* New Comment Input */}
            <Card className="border-none shadow-sm rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 border-2 border-white shadow-sm shrink-0">
                            <AvatarImage src={currentUserAvatar} />
                            <AvatarFallback className="text-[10px] font-bold bg-indigo-100 text-indigo-700">
                                {currentUserName[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <Textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[80px] text-[13px] font-medium bg-white rounded-xl resize-none border-slate-200"
                                placeholder="Add a comment..."
                            />
                            <Button
                                onClick={handleCreateComment}
                                disabled={!newComment.trim()}
                                className="h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-semibold shadow-md shadow-indigo-100"
                            >
                                <Send size={12} className="mr-2" />
                                Comment
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-3">
                {comments.length === 0 ? (
                    <Card className="border-none shadow-sm rounded-2xl bg-slate-50">
                        <CardContent className="p-8 text-center">
                            <MessageSquare size={32} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-[13px] font-semibold text-slate-500">No comments yet</p>
                            <p className="text-[11px] text-slate-400 mt-1">Be the first to comment</p>
                        </CardContent>
                    </Card>
                ) : (
                    comments.map(comment => renderComment(comment))
                )}
            </div>
        </div>
    )
}
