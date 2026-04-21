/**
 * Hire Store BE ↔ FE Mappers
 *
 * Backend: CRM_Tech_Be (MongoDB + Mongoose)
 * Frontend: Zustand store types in hire-store.ts
 *
 * Enum drift notes:
 *  - Candidate stage: BE has 8 stages w/ underscores, FE has 6
 *  - Interview status: BE has 3, FE has 5 (Completed/Scheduled/Cancelled/No Show/Rescheduled)
 *  - Offer approvalStatus: BE has 3 (Pending/Accepted/Rejected), FE has 6
 *  - Job workflow: BE has 3 (Open/Closed/Filled), FE has 6
 */

import type { Job, Candidate, Interview, Offer } from "./hire-store";

/* ---------------------------------------------------------------------- */
/*                          STAGE / STATUS MAPPERS                         */
/* ---------------------------------------------------------------------- */

export const candidateStageBeToFe = (be: string | undefined): Candidate["stage"] => {
    switch (be) {
        case "Applied":
        case "New":
            return "New";
        case "Screening":
        case "Shortlisted":
            return "Screening";
        case "Interview_Scheduled":
        case "Interview_Completed":
        case "Interview":
            return "Interview";
        case "Offered":
        case "Offer":
            return "Offer";
        case "Hired":
            return "Hired";
        case "Rejected":
            return "Rejected";
        default:
            return "New";
    }
};

export const candidateStageFeToBe = (fe: Candidate["stage"]): string => {
    switch (fe) {
        case "New":
            return "Applied";
        case "Screening":
            return "Screening";
        case "Interview":
            return "Interview_Scheduled";
        case "Offer":
            return "Offered";
        case "Hired":
            return "Hired";
        case "Rejected":
            return "Rejected";
        default:
            return "Applied";
    }
};

export const jobWorkflowBeToFe = (
    be: string | undefined
): Job["workflowStatus"] => {
    switch (be) {
        case "Open":
            return "Active";
        case "Closed":
            return "Closed";
        case "Filled":
            return "Closed";
        default:
            return "Draft";
    }
};

export const jobWorkflowFeToBe = (fe: Job["workflowStatus"]): string => {
    switch (fe) {
        case "Active":
        case "Approved":
        case "Pending Approval":
        case "Draft":
            return "Open";
        case "On Hold":
            return "Open";
        case "Closed":
            return "Closed";
        default:
            return "Open";
    }
};

export const offerStatusBeToFe = (
    be: string | undefined
): Offer["approvalStatus"] => {
    switch (be) {
        case "Pending":
            return "Sent";
        case "Accepted":
            return "Accepted";
        case "Rejected":
            return "Rejected";
        default:
            return "Draft";
    }
};

export const offerStatusFeToBe = (fe: Offer["approvalStatus"]): string => {
    switch (fe) {
        case "Accepted":
            return "Accepted";
        case "Rejected":
            return "Rejected";
        case "Sent":
        case "Pending Approval":
        case "Approved":
            return "Pending";
        default:
            return "Pending";
    }
};

export const interviewStatusBeToFe = (
    be: string | undefined
): Interview["status"] => {
    switch (be) {
        case "Scheduled":
            return "Scheduled";
        case "Completed":
            return "Completed";
        case "Cancelled":
            return "Cancelled";
        default:
            return "Scheduled";
    }
};

export const interviewStatusFeToBe = (
    fe: Interview["status"]
): "Scheduled" | "Completed" | "Cancelled" => {
    switch (fe) {
        case "Completed":
            return "Completed";
        case "Cancelled":
        case "No Show":
            return "Cancelled";
        case "Scheduled":
        case "Rescheduled":
            return "Scheduled";
        default:
            return "Scheduled";
    }
};

export const interviewModeBeToFe = (
    be: string | undefined
): Interview["mode"] => {
    switch (be) {
        case "Phone":
            return "Phone";
        case "Video":
            return "Video";
        case "In-person":
            return "In-person";
        default:
            return "Video";
    }
};

export const interviewModeFeToBe = (
    fe: Interview["mode"]
): "Phone" | "Video" | "In-person" => {
    return fe;
};

/* ---------------------------------------------------------------------- */
/*                             BE → FE MAPPERS                             */
/* ---------------------------------------------------------------------- */

export const mapJobFromApi = (j: any): Job => {
    const id = j?._id ?? j?.id ?? "";
    const deptName =
        typeof j?.department === "object"
            ? j.department?.name ?? ""
            : j?.department ?? "";
    return {
        id: String(id),
        title: j?.title ?? "",
        department: deptName,
        location: j?.location ?? "",
        type: (j?.employmentType as Job["type"]) ?? "Full-time",
        experience: j?.experience ?? "",
        salaryRange: j?.salaryRange ?? "",
        description: j?.description ?? "",
        skills: Array.isArray(j?.tags) ? j.tags : [],
        hiringManagerId: j?.hiringManager ?? j?.createdBy?._id ?? j?.createdBy ?? "",
        recruiters: Array.isArray(j?.recruiters) ? j.recruiters : [],
        workflowStatus: jobWorkflowBeToFe(j?.status),
        approvalChain: Array.isArray(j?.approvalChain) ? j.approvalChain : [],
        applicantsCount: Number(j?.applicantsCount ?? 0),
        postedDate: j?.postedDate
            ? new Date(j.postedDate).toISOString().split("T")[0]
            : j?.createdAt
              ? new Date(j.createdAt).toISOString().split("T")[0]
              : "",
        views: Number(j?.views ?? 0),
        logs: Array.isArray(j?.logs) ? j.logs : [],
    };
};

export const mapCandidateFromApi = (c: any): Candidate => {
    const id = c?._id ?? c?.id ?? "";
    const jobId =
        typeof c?.jobApplication === "object"
            ? c.jobApplication?._id ?? ""
            : c?.jobApplication ?? c?.jobId ?? "";
    return {
        id: String(id),
        jobId: String(jobId),
        firstName: c?.firstName ?? "",
        lastName: c?.lastName ?? "",
        email: c?.email ?? "",
        phone: c?.phoneNumber ?? c?.phone ?? "",
        location: c?.location ?? "",
        source: c?.source ?? "Other",
        resumeUrl: c?.resume ?? c?.resumeUrl ?? "",
        parsedSkills: Array.isArray(c?.skills) ? c.skills : [],
        tags: Array.isArray(c?.tags) ? c.tags : [],
        stage: candidateStageBeToFe(c?.status),
        stageEnteredDate: c?.lastUpdated
            ? new Date(c.lastUpdated).toISOString()
            : c?.updatedAt
              ? new Date(c.updatedAt).toISOString()
              : new Date().toISOString(),
        rating: Number(c?.rating ?? 0),
        communicationLog: Array.isArray(c?.stageHistory)
            ? c.stageHistory.map((s: any, idx: number) => ({
                  id: `LOG-${idx}-${s?.changedAt ?? Date.now()}`,
                  action: "Stage Changed",
                  details: `Moved to ${s?.stage ?? "Unknown"}`,
                  timestamp: s?.changedAt
                      ? new Date(s.changedAt).toISOString()
                      : new Date().toISOString(),
                  performer: typeof s?.changedBy === "object" ? s.changedBy?.email ?? "System" : "System",
              }))
            : [],
        notes: Array.isArray(c?.notes)
            ? c.notes.map((n: any, idx: number) => ({
                  id: `NOTE-${idx}`,
                  text: typeof n === "string" ? n : n?.text ?? "",
                  author: "System",
                  timestamp: new Date().toISOString(),
              }))
            : [],
        appliedDate: c?.appliedDate
            ? new Date(c.appliedDate).toLocaleDateString()
            : c?.createdAt
              ? new Date(c.createdAt).toLocaleDateString()
              : "",
    };
};

export const mapInterviewFromApi = (i: any): Interview => {
    const id = i?._id ?? i?.id ?? "";
    const candidate = i?.candidate;
    const candidateId =
        typeof candidate === "object" ? candidate?._id ?? "" : candidate ?? "";
    const job = i?.jobPosting;
    const jobId = typeof job === "object" ? job?._id ?? "" : job ?? "";
    const mainInterviewer = i?.interviewer;
    const interviewerId =
        typeof mainInterviewer === "object"
            ? mainInterviewer?._id ?? ""
            : mainInterviewer ?? "";

    const scheduled = i?.scheduledDate ? new Date(i.scheduledDate) : null;
    const dateStr = scheduled ? scheduled.toISOString().split("T")[0] : "";
    const timeStr = scheduled
        ? `${String(scheduled.getHours()).padStart(2, "0")}:${String(
              scheduled.getMinutes()
          ).padStart(2, "0")}`
        : "";

    return {
        id: String(id),
        candidateId: String(candidateId),
        jobId: String(jobId),
        title:
            (typeof job === "object" ? job?.title : "") ||
            `${i?.interviewType ?? "Interview"} Round`,
        interviewers: interviewerId ? [String(interviewerId)] : [],
        panel: Array.isArray(i?.panel)
            ? i.panel.map((p: any) => ({
                  employeeId: typeof p === "object" ? p?._id ?? "" : p ?? "",
                  name:
                      typeof p === "object"
                          ? `${p?.firstName ?? ""} ${p?.lastName ?? ""}`.trim()
                          : "",
                  email: typeof p === "object" ? p?.email ?? "" : "",
              }))
            : [],
        date: dateStr,
        time: timeStr,
        duration: "1 hour",
        mode: interviewModeBeToFe(i?.interviewType),
        meetingLink: i?.meetingLink ?? "",
        location: i?.location ?? "",
        status: interviewStatusBeToFe(i?.status),
        scorecards: Array.isArray(i?.feedbacks)
            ? i.feedbacks.map((f: any) => ({
                  interviewerId:
                      typeof f?.interviewer === "object"
                          ? f.interviewer?._id ?? ""
                          : f?.interviewer ?? "",
                  interviewerName:
                      typeof f?.interviewer === "object"
                          ? `${f.interviewer?.firstName ?? ""} ${f.interviewer?.lastName ?? ""}`.trim()
                          : "",
                  skillsRating: [],
                  overallScore: Number(f?.rating ?? 0),
                  feedback: f?.comments ?? "",
                  submittedAt: f?.createdAt
                      ? new Date(f.createdAt).toISOString()
                      : new Date().toISOString(),
              }))
            : [],
        preparationNotes: i?.followUp ?? "",
    };
};

export const mapOfferFromApi = (o: any): Offer => {
    const id = o?._id ?? o?.id ?? "";
    const candidate = o?.candidate;
    const candidateId =
        typeof candidate === "object" ? candidate?._id ?? "" : candidate ?? "";
    const candidateName =
        typeof candidate === "object"
            ? `${candidate?.firstName ?? ""} ${candidate?.lastName ?? ""}`.trim()
            : "";
    const candidateEmail =
        typeof candidate === "object" ? candidate?.email ?? "" : "";
    const job = o?.jobPosting;
    const jobId = typeof job === "object" ? job?._id ?? "" : job ?? "";

    const details = o?.offerDetails ?? {};
    const base = Number(details?.baseSalary ?? 0);
    const bonus = Number(details?.bonus ?? 0);
    const totalCtc = base + bonus;
    const currency = details?.currency ?? "INR";

    return {
        id: String(id),
        candidateId: String(candidateId),
        jobId: String(jobId),
        candidateName,
        candidateEmail,
        role: details?.jobTitle ?? (typeof job === "object" ? job?.title : "") ?? "",
        department: typeof job === "object" ? (job?.department?.name ?? "") : "",
        ctc: `${currency === "INR" ? "₹" : currency + " "}${totalCtc.toLocaleString("en-IN")}`,
        salaryBreakdown: [
            { component: "Base Salary", amount: base, isTaxable: true },
            { component: "Bonus", amount: bonus, isTaxable: true },
        ],
        totalCtc,
        joiningDate: o?.offerDate
            ? new Date(o.offerDate).toISOString().split("T")[0]
            : "",
        expiryDate: o?.expiryDate
            ? new Date(o.expiryDate).toISOString().split("T")[0]
            : "",
        templateId: "OT-1",
        approvalStatus: offerStatusBeToFe(o?.status),
        version: 1,
        benefits: Array.isArray(details?.benefits) ? details.benefits : [],
        signatureStatus: o?.signedDocumentUrl ? "Signed" : "Not Sent",
        emailStatus: "Not Sent",
        history: [],
        createdAt: o?.createdAt
            ? new Date(o.createdAt).toISOString()
            : new Date().toISOString(),
    };
};

/* ---------------------------------------------------------------------- */
/*                             FE → BE MAPPERS                             */
/* ---------------------------------------------------------------------- */

/**
 * Build the BE payload for creating a Job Posting.
 * BE requires: title, description, department (ObjectId), position (ObjectId),
 * location, employmentType.
 * Optional: qualifications[], responsibilities[], tags[], closingDate, openingCount.
 *
 * NOTE: `department` and `position` must be valid ObjectIds on the server.
 * If the caller doesn't provide them, the backend call will fail — UI must
 * surface a clear error.
 */
export const mapJobToCreatePayload = (
    input: Partial<Job> & {
        department: string;
        position: string;
        title: string;
        description: string;
        location: string;
        type: Job["type"];
        closingDate?: string;
        openingCount?: number;
    }
) => ({
    title: input.title,
    description: input.description,
    department: input.department,
    position: input.position,
    location: input.location,
    employmentType: input.type,
    qualifications: [],
    responsibilities: [],
    tags: input.skills ?? [],
    closingDate: input.closingDate,
    openingCount: input.openingCount ?? 1,
});

export const mapJobToUpdatePayload = (updates: Partial<Job>) => {
    const out: Record<string, any> = {};
    if (updates.title !== undefined) out.title = updates.title;
    if (updates.description !== undefined) out.description = updates.description;
    if (updates.location !== undefined) out.location = updates.location;
    if (updates.type !== undefined) out.employmentType = updates.type;
    if (updates.skills !== undefined) out.tags = updates.skills;
    return out;
};

export const mapCandidateToCreatePayload = (input: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    jobId: string;
    source?: string;
    stage?: Candidate["stage"];
    location?: string;
    linkedInProfile?: string;
    portfolio?: string;
    resumeUrl?: string;
    skills?: string[];
    experience?: number;
    education?: string;
    expectedSalary?: number;
    currentSalary?: number;
    noticePeriod?: string;
}) => ({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phoneNumber: input.phone ?? "",
    location: input.location ?? "Remote",
    linkedInProfile: input.linkedInProfile ?? "https://linkedin.com",
    portfolio: input.portfolio ?? undefined,
    resume: input.resumeUrl ?? "https://example.com/resume.pdf",
    jobApplication: input.jobId,
    source: input.source ?? "Other",
    skills: input.skills ?? [],
    experience: Number(input.experience ?? 0),
    education: input.education ?? "Not specified",
    expectedSalary: Number(input.expectedSalary ?? 0),
    currentSalary: Number(input.currentSalary ?? 0),
    noticePeriod: input.noticePeriod ?? "Immediate",
    status: candidateStageFeToBe((input.stage ?? "New") as Candidate["stage"]),
});

export const mapCandidateToUpdatePayload = (updates: Partial<Candidate>) => {
    const out: Record<string, any> = {};
    if (updates.firstName !== undefined) out.firstName = updates.firstName;
    if (updates.lastName !== undefined) out.lastName = updates.lastName;
    if (updates.email !== undefined) out.email = updates.email;
    if (updates.phone !== undefined) out.phoneNumber = updates.phone;
    if (updates.location !== undefined) out.location = updates.location;
    if (updates.source !== undefined) out.source = updates.source;
    if (updates.tags !== undefined) out.tags = updates.tags;
    if (updates.parsedSkills !== undefined) out.skills = updates.parsedSkills;
    if (updates.rating !== undefined) out.rating = updates.rating;
    if (updates.stage !== undefined)
        out.status = candidateStageFeToBe(updates.stage);
    if (updates.resumeUrl !== undefined) out.resume = updates.resumeUrl;
    return out;
};

export const mapInterviewToCreatePayload = (input: {
    candidateId: string;
    jobId: string;
    interviewerId: string;
    date: string;
    time: string;
    mode: Interview["mode"];
    panel?: string[];
    followUp?: string;
}) => {
    const scheduledDate = new Date(`${input.date}T${input.time || "10:00"}:00`);
    return {
        candidate: input.candidateId,
        jobPosting: input.jobId,
        interviewer: input.interviewerId,
        scheduledDate: scheduledDate.toISOString(),
        interviewType: interviewModeFeToBe(input.mode),
        panel: input.panel ?? [],
        followUp: input.followUp ?? "",
    };
};

export const mapOfferToCreatePayload = (input: {
    candidateId: string;
    jobId: string;
    offerDate: string;
    baseSalary: number;
    bonus?: number;
    currency?: string;
    payFrequency?: "Monthly" | "Annually";
    benefits?: string[];
    jobTitle?: string;
    location?: string;
}) => ({
    candidate: input.candidateId,
    jobPosting: input.jobId,
    offerDate: new Date(input.offerDate).toISOString(),
    offerDetails: {
        baseSalary: Number(input.baseSalary),
        bonus: Number(input.bonus ?? 0),
        currency: input.currency ?? "INR",
        payFrequency: input.payFrequency ?? "Monthly",
        benefits: input.benefits ?? [],
        jobTitle: input.jobTitle ?? "",
        location: input.location ?? "",
    },
});

export const mapOfferToUpdatePayload = (updates: Partial<Offer>) => {
    const out: Record<string, any> = {};
    if (updates.role !== undefined) {
        out.offerDetails = { ...(out.offerDetails ?? {}), jobTitle: updates.role };
    }
    if (updates.totalCtc !== undefined) {
        out.offerDetails = {
            ...(out.offerDetails ?? {}),
            baseSalary: updates.totalCtc,
        };
    }
    if (updates.joiningDate !== undefined)
        out.offerDate = new Date(updates.joiningDate).toISOString();
    if (updates.benefits !== undefined) {
        out.offerDetails = {
            ...(out.offerDetails ?? {}),
            benefits: updates.benefits,
        };
    }
    if (updates.approvalStatus !== undefined)
        out.status = offerStatusFeToBe(updates.approvalStatus);
    return out;
};
