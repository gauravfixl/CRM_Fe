// "use client";

// import React, { useState } from "react";

// type FieldType = "textarea" | "textbox" | "single" | "multi" | "likert";

// type Question = {
//   id: string;
//   title: string;
//   description?: string;
//   fieldType: FieldType;
//   likertScaleType?: string;
//   likertRange?: number;
//   options?: string[];
// };

// type AddProbationFeedbackFormProps = {
//   onSaveForm: (data: {
//     forWho: "evaluators" | "employees";
//     title: string;
//     description: string;
//     questions: Question[];
//   }) => void;
//   onCancel?: () => void;
// };

// export default function AddProbationFeedbackForm({
//   onSaveForm,
//   onCancel,
// }: AddProbationFeedbackFormProps) {
//   const [forWho, setForWho] = useState<"" | "evaluators" | "employees">("");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

//   function makeNewQuestion(): Question {
//     return {
//       id: String(Date.now()) + Math.random().toString(36).slice(2, 7),
//       title: "",
//       description: "",
//       fieldType: "likert",
//       likertScaleType: "Satisfaction",
//       likertRange: 10,
//       options: [],
//     };
//   }

//   function handleAddQuestion() {
//     const q = makeNewQuestion();
//     setQuestions((s) => [...s, q]);
//     setEditingQuestionId(q.id);
//   }

//   function handleDeleteQuestion(id: string) {
//     setQuestions((s) => s.filter((q) => q.id !== id));
//     if (editingQuestionId === id) setEditingQuestionId(null);
//   }
// function handleSaveQuestion(updated: Question) {
//   console.log("🟦 handleSaveQuestion triggered");
//   console.log("Received updated question:", updated);

//   setQuestions((s) => {
//     const updatedList = s.map((q) => (q.id === updated.id ? updated : q));
//     console.log("Updated questions list:", updatedList);
//     return updatedList;
//   });

//   setEditingQuestionId(null);
// }



//   function handleCreateForm() {
//     if (!forWho) return alert("Please select Evaluators or Employees first.");
//     if (!title) return alert("Please enter a title.");

//     onSaveForm({
//       forWho,
//       title,
//       description,
//       questions,
//     });
//   }

//   const lockedForWho = Boolean(title && questions.length > 0);

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-start justify-center p-6">
//       <div className="w-full max-w-3xl bg-white rounded shadow p-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-semibold">Create New Probation Feedback Form</h2>
//           <button className="text-gray-400 hover:text-gray-600" onClick={onCancel}>
//             ✕
//           </button>
//         </div>

//         <div className="mt-4 space-y-6">
//           {/* Who radio */}
//           <div>
//             <label className="block text-sm text-gray-600 mb-2">
//               Who is this form for?
//             </label>
//             <div className="flex items-center gap-6">
//               {["evaluators", "employees"].map((type) => (
//                 <label
//                   key={type}
//                   className={`inline-flex items-center gap-2 cursor-pointer ${
//                     lockedForWho ? "opacity-60" : ""
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="forWho"
//                     value={type}
//                     checked={forWho === type}
//                     onChange={() => !lockedForWho && setForWho(type as any)}
//                     disabled={lockedForWho}
//                   />
//                   <span className="capitalize">{type}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Title + Description */}
//           {forWho && (
//             <div className="space-y-3">
//               <div>
//                 <label className="block text-sm text-gray-600 mb-1">Title</label>
//                 <input
//                   className="w-full border rounded px-3 py-2"
//                   placeholder="Enter title"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-600 mb-1">
//                   Description (Optional)
//                 </label>
//                 <textarea
//                   className="w-full border rounded px-3 py-2 min-h-[80px]"
//                   placeholder="Enter description"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                 />
//               </div>

//               {/* Questions */}
//               <div className="border rounded p-4 bg-white">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-md font-medium">Questions</h3>
//                   <button
//                     className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
//                     onClick={handleAddQuestion}
//                   >
//                     + Add Question
//                   </button>
//                 </div>

//                 {questions.length === 0 ? (
//                   <div className="mt-6 text-center text-gray-500">
//                     <div className="h-36 flex flex-col items-center justify-center">
//                       <div className="mb-2">No Questions Found</div>
//                       <div className="text-xs">
//                         Please add a question to display it here.
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="mt-4 space-y-4">
//                   {questions.map((q, idx) => (
//   <QuestionCard
//     key={q.id}
//     index={idx + 1}
//     question={q}
//     onCancelEdit={() => setEditingQuestionId(null)} // ✅ fixed
//     onDelete={() => handleDeleteQuestion(q.id)}
//     onSave={handleSaveQuestion}
//   />
// ))}

//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="mt-6 flex items-center justify-end gap-3">
//           <button className="px-4 py-2 border rounded" onClick={onCancel}>
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//             onClick={handleCreateForm}
//           >
//             Create Form
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ---------- QuestionCard ----------
// function QuestionCard({
//   question,
//   index,
//   onCancelEdit,
//   onDelete,
//   onSave,
// }: {
//   question: Question;
//   index: number;
//   onCancelEdit: () => void;
//   onDelete: () => void;
//   onSave: (q: Question) => void;
// }) {
//   const [local, setLocal] = useState<Question>(question);

//   React.useEffect(() => setLocal(question), [question]);

//   function updateField<K extends keyof Question>(key: K, val: Question[K]) {
//     setLocal((s) => ({ ...s, [key]: val }));
//   }

//   function addOption() {
//     updateField("options", [...(local.options || []), ""]);
//   }

//   function updateOption(index: number, value: string) {
//     const updated = [...(local.options || [])];
//     updated[index] = value;
//     updateField("options", updated);
//   }

//   function removeOption(index: number) {
//     const updated = [...(local.options || [])];
//     updated.splice(index, 1);
//     updateField("options", updated);
//   }

//   return (
//     <div className="border rounded p-4 bg-white shadow-sm">
//       <div className="flex items-start justify-between">
//         <div className="w-full">
//           <div className="flex items-center gap-3">
//             <div className="text-sm text-gray-500">{index}.</div>
//             <input
//               className="flex-1 border rounded px-3 py-2"
//               placeholder="Question title"
//               value={local.title}
//               onChange={(e) => updateField("title", e.target.value)}
//             />
//             <button
//               className="text-red-500 ml-3"
//               onClick={onDelete}
//               title="Delete question"
//             >
//               🗑️
//             </button>
//           </div>

//           <div className="mt-3">
//             <label className="block text-sm text-gray-600 mb-1">Description</label>
//             <textarea
//               className="w-full border rounded px-3 py-2 min-h-[70px]"
//               placeholder="Enter description"
//               value={local.description}
//               onChange={(e) => updateField("description", e.target.value)}
//             />
//           </div>

//           <div className="mt-3">
//             <label className="block text-sm text-gray-600 mb-1">Field Type</label>
//             <select
//               className="border rounded px-3 py-2 w-full max-w-xs"
//               value={local.fieldType}
//               onChange={(e) => updateField("fieldType", e.target.value as FieldType)}
//             >
//               <option value="textarea">Textarea</option>
//               <option value="textbox">Textbox</option>
//               <option value="single">Single Select Option</option>
//               <option value="multi">Multi Select Option</option>
//               <option value="likert">Likert Scale</option>
//             </select>
//           </div>

//           {(local.fieldType === "single" || local.fieldType === "multi") && (
//             <div className="mt-3 space-y-2">
//               <label className="block text-sm text-gray-600 mb-1">
//                 {local.fieldType === "single"
//                   ? "Single Select Options"
//                   : "Multi Select Options"}
//               </label>
//               {(local.options || []).map((opt, idx) => (
//                 <div key={idx} className="flex items-center gap-2">
//                   <input
//                     className="border rounded px-3 py-1 flex-1"
//                     placeholder={`Option ${idx + 1}`}
//                     value={opt}
//                     onChange={(e) => updateOption(idx, e.target.value)}
//                   />
//                   <button className="text-red-500" onClick={() => removeOption(idx)}>
//                     ✕
//                   </button>
//                 </div>
//               ))}
//               <button
//                 className="text-sm px-2 py-1 border rounded hover:bg-gray-50"
//                 onClick={addOption}
//               >
//                 + Add Option
//               </button>
//             </div>
//           )}

//           {local.fieldType === "likert" && (
//             <div className="mt-3">
//               <label className="block text-sm text-gray-600 mb-1">
//                 Preview (Likert Scale)
//               </label>
//               <div className="flex items-center gap-2">
//                 {Array.from({ length: local.likertRange || 5 }).map((_, i) => (
//                   <div
//                     key={i}
//                     className="w-8 h-8 flex items-center justify-center border rounded"
//                   >
//                     {i + 1}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="mt-4 flex items-center gap-3">
//             <button
//               className="px-3 py-1 border rounded text-sm"
//               onClick={onCancelEdit} // ✅ now cancels edit mode
//             >
//               Cancel
//             </button>
//            <button
//   className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
//   onClick={() => {
//     console.log("🟩 Save button clicked for Question:", local.id);
//     console.log("Question Data:", local);
//     onSave(local); // 🔥 triggers update in parent
//   }}
// >
//   Save changes
// </button>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useState, useEffect } from "react";

// ---------- Types ----------
export type FieldType = "textarea" | "textbox" | "single" | "multi" | "likert";

export type Question = {
  id: string;
  title: string;
  description?: string;
  fieldType: FieldType;
  likertScaleType?: string;
  likertRange?: number;
  options?: string[];
};

interface QuestionCardProps {
  question: Question;
  index: number;
  isEditing: boolean;
  onCancelEdit: () => void;
  onDelete: () => void;
  onSave: (q: Question) => void;
}

type AddProbationFeedbackFormProps = {
  onSaveForm: (data: {
    forWho: "evaluators" | "employees";
    title: string;
    description: string;
    questions: Question[];
  }) => void;
  onCancel?: () => void;
};

// ---------- Parent Form ----------
export default function AddProbationFeedbackForm({
  onSaveForm,
  onCancel,
}: AddProbationFeedbackFormProps) {
  const [forWho, setForWho] = useState<"" | "evaluators" | "employees">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  function makeNewQuestion(): Question {
    return {
      id: String(Date.now()) + Math.random().toString(36).slice(2, 7),
      title: "",
      description: "",
      fieldType: "likert",
      likertScaleType: "Satisfaction",
      likertRange: 5,
      options: [],
    };
  }

  function handleAddQuestion() {
    const q = makeNewQuestion();
    setQuestions((prev) => [...prev, q]);
    setEditingQuestionId(q.id);
  }

  function handleDeleteQuestion(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (editingQuestionId === id) setEditingQuestionId(null);
  }

  function handleSaveQuestion(updated: Question) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q))
    );
    setEditingQuestionId(null);
  }

  function handleCreateForm() {
    if (!forWho) return alert("Please select Evaluators or Employees first.");
    if (!title) return alert("Please enter a title.");

    onSaveForm({
      forWho,
      title,
      description,
      questions,
    });
  }

  const lockedForWho = Boolean(title && questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded shadow p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create New Probation Feedback Form</h2>
          <button className="text-gray-400 hover:text-gray-600" onClick={onCancel}>
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-6">
          {/* Who */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Who is this form for?</label>
            <div className="flex items-center gap-6">
              {["evaluators", "employees"].map((type) => (
                <label
                  key={type}
                  className={`inline-flex items-center gap-2 cursor-pointer ${lockedForWho ? "opacity-60" : ""}`}
                >
                  <input
                    type="radio"
                    name="forWho"
                    value={type}
                    checked={forWho === type}
                    onChange={() => !lockedForWho && setForWho(type as any)}
                    disabled={lockedForWho}
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Title + Description */}
          {forWho && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Title</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Description (Optional)</label>
                <textarea
                  className="w-full border rounded px-3 py-2 min-h-[80px]"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Questions */}
              <div className="border rounded p-4 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium">Questions</h3>
                  <button
                    className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
                    onClick={handleAddQuestion}
                  >
                    + Add Question
                  </button>
                </div>

                {questions.length === 0 ? (
                  <div className="mt-6 text-center text-gray-500">
                    <div className="h-36 flex flex-col items-center justify-center">
                      <div className="mb-2">No Questions Found</div>
                      <div className="text-xs">Please add a question to display it here.</div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    {questions.map((q, idx) => (
                      <QuestionCard
                        key={q.id}
                        index={idx + 1}
                        question={q}
                        isEditing={editingQuestionId === q.id}
                        onCancelEdit={() => setEditingQuestionId(null)}
                        onDelete={() => handleDeleteQuestion(q.id)}
                        onSave={handleSaveQuestion}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button className="px-4 py-2 border rounded" onClick={onCancel}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleCreateForm}>
            Create Form
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- QuestionCard ----------
export function QuestionCard({
  question,
  index,
  isEditing,
  onCancelEdit,
  onDelete,
  onSave,
}: QuestionCardProps) {
  const [local, setLocal] = useState<Question>(question);

  useEffect(() => setLocal(question), [question]);

  function updateField<K extends keyof Question>(key: K, val: Question[K]) {
    setLocal((s) => ({ ...s, [key]: val }));
  }

  function addOption() {
    updateField("options", [...(local.options || []), ""]);
  }

  function updateOption(idx: number, value: string) {
    const updated = [...(local.options || [])];
    updated[idx] = value;
    updateField("options", updated);
  }

  function removeOption(idx: number) {
    const updated = [...(local.options || [])];
    updated.splice(idx, 1);
    updateField("options", updated);
  }

  return (
    <div className="border rounded p-4 bg-white shadow-sm">
      <div className="flex flex-col gap-3">
        {/* Title + Delete */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">{index}.</div>
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="Question title"
            value={local.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
          <button className="text-red-500 ml-3" onClick={onDelete} title="Delete question">
            🗑️
          </button>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[70px]"
            placeholder="Enter description"
            value={local.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>

        {/* Field Type */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Field Type</label>
          <select
            className="border rounded px-3 py-2 w-full max-w-xs"
            value={local.fieldType}
            onChange={(e) => updateField("fieldType", e.target.value as FieldType)}
          >
            <option value="textarea">Textarea</option>
            <option value="textbox">Textbox</option>
            <option value="single">Single Select Option</option>
            <option value="multi">Multi Select Option</option>
            <option value="likert">Likert Scale</option>
          </select>
        </div>

        {/* Options */}
        {(local.fieldType === "single" || local.fieldType === "multi") && (
          <div className="space-y-2">
            {(local.options || []).map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  className="border rounded px-3 py-1 flex-1"
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(idx, e.target.value)}
                />
                <button className="text-red-500" onClick={() => removeOption(idx)}>
                  ✕
                </button>
              </div>
            ))}
            <button className="text-sm px-2 py-1 border rounded hover:bg-gray-50" onClick={addOption}>
              + Add Option
            </button>
          </div>
        )}

        {/* Likert Preview */}
        {local.fieldType === "likert" && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">Preview (Likert Scale)</label>
            <div className="flex items-center gap-2">
              {Array.from({ length: local.likertRange || 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 flex items-center justify-center border rounded"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cancel / Save buttons */}
        {isEditing && (
          <div className="flex items-center gap-3 mt-3">
            <button className="px-3 py-1 border rounded text-sm" onClick={onCancelEdit}>
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
              onClick={() => onSave(local)}
            >
              Save changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
