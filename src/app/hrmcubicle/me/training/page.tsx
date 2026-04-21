"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    BookOpen,
    PlayCircle,
    CheckCircle2,
    Award,
    Clock,
    Star,
    Users,
    Sparkles,
    Download,
    Search,
    X,
    Plus,
    Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/components/ui/use-toast";

type Course = {
    id: number;
    title: string;
    category: string;
    duration: string;
    progress: number;
    lessons: number;
    completedLessons: number;
    instructor: string;
    level: string;
    image: string;
};

type Cert = { id: number; name: string; issuer: string; date: string; expiry: string; file: string };

type Rec = { id: number; title: string; category: string; duration: string; rating: number; enrolled: number; image: string; description: string };

const initialCourses: Course[] = [
    { id: 1, title: "React Advanced Patterns", category: "Technical", duration: "6h 20m", progress: 75, lessons: 18, completedLessons: 14, instructor: "Kent C. Dodds", level: "Advanced", image: "⚛️" },
    { id: 2, title: "Leadership Essentials", category: "Soft Skills", duration: "4h 10m", progress: 45, lessons: 12, completedLessons: 5, instructor: "Simon Sinek", level: "Intermediate", image: "🎯" },
    { id: 3, title: "AWS Solutions Architect", category: "Certification", duration: "24h 00m", progress: 30, lessons: 48, completedLessons: 14, instructor: "Stephane Maarek", level: "Advanced", image: "☁️" },
    { id: 4, title: "POSH Compliance Training", category: "Mandatory", duration: "1h 00m", progress: 100, lessons: 6, completedLessons: 6, instructor: "HR Team", level: "Beginner", image: "🛡️" },
];

const initialCerts: Cert[] = [
    { id: 1, name: "POSH Compliance 2026", issuer: "Company Internal", date: "2026-02-10", expiry: "2027-02-10", file: "posh_2026.pdf" },
    { id: 2, name: "Scrum Master Certified", issuer: "Scrum Alliance", date: "2025-08-22", expiry: "2027-08-22", file: "scrum_master.pdf" },
    { id: 3, name: "Google Analytics IQ", issuer: "Google", date: "2025-11-14", expiry: "2026-11-14", file: "ga_iq.pdf" },
];

const initialRecommended: Rec[] = [
    { id: 101, title: "TypeScript Deep Dive", category: "Technical", duration: "5h", rating: 4.8, enrolled: 1240, image: "📘", description: "Master advanced TypeScript patterns, generics, and type inference." },
    { id: 102, title: "Design Thinking Bootcamp", category: "Soft Skills", duration: "3h 30m", rating: 4.6, enrolled: 892, image: "🎨", description: "Learn user-centered design methods through hands-on exercises." },
    { id: 103, title: "Financial Planning Basics", category: "Personal", duration: "2h", rating: 4.5, enrolled: 456, image: "💹", description: "Understand investing, tax saving, and personal finance fundamentals." },
    { id: 104, title: "Effective Remote Communication", category: "Soft Skills", duration: "1h 45m", rating: 4.7, enrolled: 612, image: "💬", description: "Improve async communication, meeting etiquette, and documentation." },
];

const levelColors: Record<string, string> = {
    Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
    Advanced: "bg-rose-50 text-rose-700 border-rose-200",
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

export default function MyTrainingPage() {
    const { toast } = useToast();
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [certs, setCerts] = useState<Cert[]>(initialCerts);
    const [recommended, setRecommended] = useState<Rec[]>(initialRecommended);
    const [playing, setPlaying] = useState<Course | null>(null);
    const [browseOpen, setBrowseOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [unenrollConfirm, setUnenrollConfirm] = useState<Course | null>(null);

    const totalHours = 45;
    const completedCourses = courses.filter(c => c.progress === 100).length;

    const filteredRec = recommended.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase()));

    const enroll = (r: Rec) => {
        const newCourse: Course = {
            id: Math.max(0, ...courses.map(c => c.id)) + 1,
            title: r.title,
            category: r.category,
            duration: r.duration,
            progress: 0,
            lessons: 10,
            completedLessons: 0,
            instructor: "Course Instructor",
            level: "Intermediate",
            image: r.image,
        };
        setCourses([...courses, newCourse]);
        setRecommended(recommended.filter(x => x.id !== r.id));
        toast({ title: "Enrolled successfully", description: `"${r.title}" added to your learning path.` });
    };

    const playCourse = (c: Course) => {
        setPlaying(c);
    };

    const markLessonComplete = () => {
        if (!playing) return;
        if (playing.completedLessons >= playing.lessons) {
            toast({ title: "Course complete", description: "All lessons already done." });
            return;
        }
        const completed = playing.completedLessons + 1;
        const progress = Math.round((completed / playing.lessons) * 100);
        const updated = { ...playing, completedLessons: completed, progress };
        setCourses(courses.map(c => c.id === playing.id ? updated : c));
        setPlaying(updated);
        if (progress === 100) {
            const newCert: Cert = {
                id: Math.max(0, ...certs.map(c => c.id)) + 1,
                name: updated.title,
                issuer: "Company Learning",
                date: new Date().toISOString().split("T")[0],
                expiry: new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
                file: `${updated.title.toLowerCase().replace(/\s+/g, "_")}.pdf`,
            };
            setCerts([newCert, ...certs]);
            toast({ title: "🎉 Course completed!", description: "Certificate has been added to your certifications." });
        } else {
            toast({ title: "Lesson complete", description: `${completed}/${updated.lessons} lessons done.` });
        }
    };

    const unenroll = () => {
        if (!unenrollConfirm) return;
        setCourses(courses.filter(c => c.id !== unenrollConfirm.id));
        toast({ title: "Unenrolled", description: `Removed "${unenrollConfirm.title}" from your courses.` });
        setUnenrollConfirm(null);
    };

    const downloadCert = (cert: Cert) => {
        toast({ title: "Certificate downloaded", description: `${cert.file} saved to your downloads.` });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#f8fafc] p-6 space-y-6 font-sans" style={{ zoom: "80%" }}>
            <div className="mx-auto space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">My Training</h1>
                        <p className="text-sm text-slate-500 mt-1">Learning path, courses, and certifications</p>
                    </div>
                    <Button onClick={() => setBrowseOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100">
                        <BookOpen size={16} className="mr-2" /> Browse Catalog
                    </Button>
                </div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Enrolled Courses", value: courses.length, icon: BookOpen, color: "indigo" },
                        { label: "Hours Learned", value: `${totalHours}h`, icon: Clock, color: "blue" },
                        { label: "Courses Completed", value: completedCourses, icon: CheckCircle2, color: "emerald" },
                        { label: "Certifications", value: certs.length, icon: Award, color: "amber" },
                    ].map((s, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-xl bg-${s.color}-50 flex items-center justify-center`}>
                                        <s.icon className={`text-${s.color}-600`} size={22} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                                        <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <Card className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <PlayCircle className="text-indigo-600" size={18} />
                                In Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                                {courses.map(c => (
                                    <motion.div key={c.id} variants={itemVariants}>
                                        <div className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all flex items-start gap-4">
                                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center text-3xl shrink-0">{c.image}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h3 className="font-bold text-slate-900 text-sm">{c.title}</h3>
                                                    <Badge className={`${levelColors[c.level]} border text-[10px] font-semibold shrink-0`}>{c.level}</Badge>
                                                </div>
                                                <p className="text-xs text-slate-500 mb-2">by {c.instructor} · {c.duration} · {c.lessons} lessons</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between text-[11px] mb-1">
                                                            <span className="text-slate-500">{c.completedLessons}/{c.lessons} lessons</span>
                                                            <span className="font-bold text-slate-900">{c.progress}%</span>
                                                        </div>
                                                        <Progress value={c.progress} className="h-1.5" />
                                                    </div>
                                                    <Button size="sm" onClick={() => playCourse(c)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs h-8">
                                                        {c.progress === 100 ? "Review" : "Continue"}
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={() => setUnenrollConfirm(c)} className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600">
                                                        <Trash2 size={13} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {courses.length === 0 && (
                                    <div className="text-center py-12 text-slate-400">
                                        <BookOpen size={40} className="mx-auto mb-2 opacity-40" />
                                        <p className="text-sm">No courses enrolled. Browse the catalog to start learning.</p>
                                    </div>
                                )}
                            </motion.div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Award className="text-amber-500" size={18} />
                                Certifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-3">
                            {certs.map(cert => (
                                <div key={cert.id} className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 group hover:shadow-md transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center shrink-0">
                                            <Award className="text-amber-600" size={16} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-slate-900 text-sm leading-tight">{cert.name}</p>
                                            <p className="text-[11px] text-slate-600 mt-0.5">{cert.issuer}</p>
                                            <p className="text-[10px] text-amber-700 mt-1">Valid till {new Date(cert.expiry).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p>
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => downloadCert(cert)} className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-100">
                                            <Download size={14} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {certs.length === 0 && (
                                <div className="text-center py-6 text-slate-400">
                                    <Award size={30} className="mx-auto mb-2 opacity-40" />
                                    <p className="text-xs">Complete courses to earn certificates</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Sparkles className="text-indigo-600" size={18} />
                            Recommended for You
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                        {recommended.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                <Sparkles size={30} className="mx-auto mb-2 opacity-40" />
                                <p className="text-sm">You're all caught up! Check back later for new recommendations.</p>
                            </div>
                        ) : (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {recommended.map(r => (
                                    <motion.div key={r.id} variants={itemVariants}>
                                        <Card className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg hover:border-indigo-200 transition-all">
                                            <CardContent className="p-5 space-y-3">
                                                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center text-3xl">{r.image}</div>
                                                <div>
                                                    <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 border text-[10px]">{r.category}</Badge>
                                                    <h3 className="font-bold text-slate-900 text-sm mt-2">{r.title}</h3>
                                                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{r.description}</p>
                                                </div>
                                                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                                                    <span className="flex items-center gap-1"><Clock size={11} />{r.duration}</span>
                                                    <span className="flex items-center gap-1"><Star size={11} className="text-amber-500 fill-amber-500" />{r.rating}</span>
                                                    <span className="flex items-center gap-1"><Users size={11} />{r.enrolled}</span>
                                                </div>
                                                <Button size="sm" onClick={() => enroll(r)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs h-8">
                                                    <Plus size={12} className="mr-1" /> Enroll
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!playing} onOpenChange={v => !v && setPlaying(null)}>
                <DialogContent className="bg-white rounded-2xl border-none p-0 max-w-2xl overflow-hidden">
                    {playing && (
                        <>
                            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 aspect-video flex items-center justify-center relative">
                                <div className="text-7xl opacity-30">{playing.image}</div>
                                <Button size="sm" onClick={() => setPlaying(null)} variant="ghost" className="absolute top-3 right-3 text-white hover:bg-white/10 h-8 w-8 p-0">
                                    <X size={16} />
                                </Button>
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <p className="text-xs opacity-70">Lesson {playing.completedLessons + 1} of {playing.lessons}</p>
                                    <h3 className="font-bold text-lg">{playing.title}</h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <div className="flex items-center justify-between text-xs mb-2">
                                        <span className="text-slate-500">Course progress</span>
                                        <span className="font-bold text-indigo-700">{playing.progress}%</span>
                                    </div>
                                    <Progress value={playing.progress} className="h-2" />
                                </div>
                                <p className="text-xs text-slate-500">By {playing.instructor} · {playing.duration}</p>
                                <div className="flex gap-2">
                                    <Button variant="ghost" onClick={() => setPlaying(null)} className="flex-1">Close</Button>
                                    <Button onClick={markLessonComplete} className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                                        <CheckCircle2 size={14} className="mr-2" /> {playing.progress === 100 ? "Review Again" : "Mark Lesson Complete"}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={browseOpen} onOpenChange={setBrowseOpen}>
                <DialogContent className="bg-white rounded-2xl border-none p-0 max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100">
                        <DialogHeader className="space-y-2">
                            <DialogTitle className="text-2xl font-bold">Course Catalog</DialogTitle>
                            <DialogDescription>Browse and enroll in courses curated for you.</DialogDescription>
                        </DialogHeader>
                        <div className="relative mt-4">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses by title or category..." className="pl-9" />
                        </div>
                    </div>
                    <div className="overflow-y-auto p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredRec.map(r => (
                                <div key={r.id} className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center text-2xl shrink-0">{r.image}</div>
                                        <div className="flex-1 min-w-0">
                                            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 border text-[9px]">{r.category}</Badge>
                                            <h4 className="font-bold text-sm mt-1">{r.title}</h4>
                                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{r.description}</p>
                                            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                                                <span className="flex items-center gap-1"><Clock size={10} />{r.duration}</span>
                                                <span className="flex items-center gap-1"><Star size={10} className="text-amber-500 fill-amber-500" />{r.rating}</span>
                                            </div>
                                            <Button size="sm" onClick={() => { enroll(r); }} className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs h-8">
                                                <Plus size={11} className="mr-1" /> Enroll
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredRec.length === 0 && (
                                <div className="col-span-2 text-center py-12 text-slate-400">
                                    <BookOpen size={40} className="mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">{recommended.length === 0 ? "All courses enrolled!" : "No courses match your search"}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={!!unenrollConfirm} onOpenChange={v => !v && setUnenrollConfirm(null)}>
                <DialogContent className="bg-white rounded-2xl border-none p-8 max-w-md">
                    <DialogHeader className="space-y-3">
                        <div className="h-12 w-12 bg-rose-50 rounded-xl flex items-center justify-center">
                            <Trash2 className="text-rose-600" size={24} />
                        </div>
                        <DialogTitle className="text-xl font-bold">Unenroll from Course?</DialogTitle>
                        <DialogDescription>
                            "{unenrollConfirm?.title}" will be removed. Progress ({unenrollConfirm?.progress}%) will be lost.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 mt-2">
                        <Button variant="ghost" onClick={() => setUnenrollConfirm(null)}>Cancel</Button>
                        <Button onClick={unenroll} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl">Unenroll</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
