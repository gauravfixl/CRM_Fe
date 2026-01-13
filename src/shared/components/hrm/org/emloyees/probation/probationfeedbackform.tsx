// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import AddProbationFeedbackForm from "./addprobationfeedbackform";

// export default function ProbationFeedbackForm() {
//   const [answers, setAnswers] = useState({});
//  const [showForm, setShowForm] = useState(false)
//   const questions = [
//     "Rate the quality of work based on the roles and responsibilities of the employee.",
//     "Rate the employee based on the initiatives taken up by them.",
//     "Does the employee adhere to company policies?",
//     "Rate the employee based on their willingness to accept suggestions and feedback.",
//     "Has the employee demonstrated required competencies to continue in the role? Elaborate your reply.",
//   ];

//   const handleRatingChange = (index, value) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [index]: { ...prev[index], rating: value },
//     }));
//   };

//   const handleTextChange = (index, value) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [index]: { ...prev[index], text: value },
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className=" mx-auto space-y-3">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <h1 className="text-sm font-semibold text-gray-800">Probation Feedback Form</h1>
//           <Button size="sm" className="text-xs px-2 py-1 rounded-md" onClick={() => setShowForm(true)}>+ Create Form</Button>
//         </div>

//         <div className="grid grid-cols-4 gap-3">
//           {/* Sidebar */}
//           <div className="col-span-1 bg-white border rounded-lg shadow-sm">
//             <div className="p-3 space-y-1">
//               <Input placeholder="🔍 Search" className="text-xs h-7" />
//               <div className="text-xs text-gray-700 mt-2 space-y-1">
//                 <div className="font-semibold text-blue-600">Default Evaluator Form</div>
//                 <div>Default Employee Form</div>
//               </div>
//             </div>
//           </div>

//           {/* Main Form */}
//           <Card className="col-span-3 text-xs rounded-lg shadow-sm border">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-semibold text-gray-800">
//                 Default Evaluator Form
//                 <span className="ml-1 text-gray-400 text-[10px]">(Default)</span>
//               </CardTitle>
//             </CardHeader>

//             <CardContent className="space-y-2">
//               {questions.map((q, i) => (
//                 <div key={i} className="border rounded-md p-2 hover:bg-gray-50 transition">
//                   <p className="text-[11px] text-gray-700 mb-2">
//                     {i + 1}. {q}
//                   </p>

//                   {/* Rating Row */}
//                   <div className="flex items-center flex-wrap gap-1 mb-2">
//                     {[...Array(10)].map((_, idx) => (
//                       <button
//                         key={idx}
//                         className={`w-6 h-6 text-[10px] border rounded-md flex items-center justify-center 
//                           ${answers[i]?.rating === idx + 1
//                             ? "bg-blue-600 text-white border-blue-600"
//                             : "bg-white text-gray-700 hover:bg-gray-100"
//                           }`}
//                         onClick={() => handleRatingChange(i, idx + 1)}
//                       >
//                         {idx + 1}
//                       </button>
//                     ))}
//                   </div>

//                   {/* Written Feedback */}
//                   <Textarea
//                     className="text-[11px] h-16"
//                     placeholder="Enter additional feedback..."
//                     value={answers[i]?.text || ""}
//                     onChange={(e) => handleTextChange(i, e.target.value)}
//                   />
//                 </div>
//               ))}

//               <div className="flex justify-end pt-1">
//                 <Button size="sm" className="text-xs px-3 py-1 rounded-md">
//                   Submit Feedback
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//       {showForm ? (
//         <AddProbationFeedbackForm/>
//       ) : (
//         <div className="flex justify-center items-center h-64 text-gray-500 text-sm border border-dashed rounded-md">
//           Click “Add Probation” to create a new feedback form
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AddProbationFeedbackForm from "./addprobationfeedbackform";

export default function ProbationFeedbackForm() {
  const [answers, setAnswers] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [createdForms, setCreatedForms] = useState<any[]>([]);
  const [activeForm, setActiveForm] = useState<any>("evaluatorDefault");

  // ✅ Default evaluator and employee questions as proper objects
  const defaultEvaluatorQuestions = [
    {
      id: "eval-1",
      title: "Rate the quality of work based on the roles and responsibilities of the employee.",
      fieldType: "likert",
      likertRange: 10,
    },
    {
      id: "eval-2",
      title: "Rate the employee based on the initiatives taken up by them.",
      fieldType: "likert",
      likertRange: 10,
    },
    {
      id: "eval-3",
      title: "Does the employee adhere to company policies?",
      fieldType: "likert",
      likertRange: 10,
    },
    {
      id: "eval-4",
      title: "Rate the employee based on their willingness to accept suggestions and feedback.",
      fieldType: "likert",
      likertRange: 10,
    },
    {
      id: "eval-5",
      title: "Has the employee demonstrated required competencies to continue in the role? Elaborate your reply.",
      fieldType: "textarea",
    },
  ];

  const defaultEmployeeQuestions = [
    {
      id: "emp-1",
      title: "Rate the employee based on the initiatives taken up by them.",
      fieldType: "likert",
      likertRange: 10,
    },
    {
      id: "emp-2",
      title: "Does the employee adhere to company policies?",
      fieldType: "likert",
      likertRange: 10,
    },
    {
      id: "emp-3",
      title: "Provide feedback on employee's communication skills.",
      fieldType: "textarea",
    },
  ];

  // Handle answer updates
  const handleRatingChange = (index, value) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: { ...prev[index], rating: value },
    }));
  };

  const handleTextChange = (index, value) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: { ...prev[index], text: value },
    }));
  };

  // Callback for saving newly created forms
  const handleSaveForm = (newFormData) => {
    setCreatedForms((prev) => [...prev, newFormData]);
    setActiveForm(newFormData);
    setShowForm(false);
  };

  // Determine which questions to display based on active form
  const getActiveFormQuestions = () => {
    if (activeForm === "evaluatorDefault") return defaultEvaluatorQuestions;
    if (activeForm === "employeeDefault") return defaultEmployeeQuestions;
    if (activeForm && typeof activeForm === "object") return activeForm.questions || [];
    return [];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto space-y-3">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-sm font-semibold text-gray-800">Probation Feedback Form</h1>
          <Button
            size="sm"
            className="text-xs px-2 py-1 rounded-md"
            onClick={() => setShowForm(true)}
          >
            + Create Form
          </Button>
        </div>

        {/* Conditional Rendering */}
        {showForm ? (
          <AddProbationFeedbackForm
            onCancel={() => setShowForm(false)}
            onSaveForm={handleSaveForm}
          />
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {/* Sidebar */}
            <div className="col-span-1 bg-white border rounded-lg shadow-sm">
              <div className="p-3 space-y-1">
                <Input placeholder="🔍 Search" className="text-xs h-7" />

                <div className="text-xs text-gray-700 mt-2 space-y-1">
                  {/* Default Evaluator Form */}
                 {/* Default Evaluator Form */}
<div
  className={`px-2 py-1 rounded cursor-pointer ${
    activeForm === "evaluatorDefault" ? "bg-blue-100 text-blue-600 font-semibold" : ""
  }`}
  onClick={() => setActiveForm("evaluatorDefault")}
>
  Default Evaluator Form
</div>

{/* Default Employee Form */}
<div
  className={`px-2 py-1 rounded cursor-pointer ${
    activeForm === "employeeDefault" ? "bg-blue-100 text-blue-600 font-semibold" : ""
  }`}
  onClick={() => setActiveForm("employeeDefault")}
>
  Default Employee Form
</div>

{/* Newly created forms */}
{createdForms.map((f) => (
  <div
    key={f.id}
    className={`px-2 py-1 rounded cursor-pointer ${
      typeof activeForm === "object" && activeForm.id === f.id
        ? "bg-blue-100 text-blue-600 font-semibold"
        : ""
    }`}
    onClick={() => setActiveForm(f)}
  >
    {f.title}
  </div>
))}

                </div>
              </div>
            </div>

            {/* Main Form */}
            <Card className="col-span-3 text-xs rounded-lg shadow-sm border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-800">
                  {activeForm && typeof activeForm !== "string"
                    ? activeForm.title
                    : activeForm === "employeeDefault"
                    ? "Default Employee Form"
                    : "Default Evaluator Form"}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                {getActiveFormQuestions().map((q, i) => (
                  <div key={i} className="border rounded-md p-2 hover:bg-gray-50 transition">
                    <p className="text-[11px] text-gray-700 mb-2">{i + 1}. {q.title}</p>

                    {q.fieldType === "textbox" && (
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-1 text-[11px]"
                        value={answers[i]?.text || ""}
                        onChange={(e) => handleTextChange(i, e.target.value)}
                      />
                    )}

                    {q.fieldType === "textarea" && (
                      <Textarea
                        className="text-[11px] h-16"
                        placeholder="Enter additional feedback..."
                        value={answers[i]?.text || ""}
                        onChange={(e) => handleTextChange(i, e.target.value)}
                      />
                    )}

                    {(q.fieldType === "single" || q.fieldType === "multi") && (
                      <div className="flex flex-col gap-1">
                        {q.options?.map((opt, idx) => (
                          <label key={idx} className="text-[11px] flex items-center gap-2">
                            <input
                              type={q.fieldType === "single" ? "radio" : "checkbox"}
                              name={q.fieldType === "single" ? `q-${i}` : `q-${i}-${idx}`}
                              checked={
                                q.fieldType === "single"
                                  ? answers[i]?.selected === idx
                                  : answers[i]?.selected?.includes(idx) || false
                              }
                              onChange={() => {
                                if (q.fieldType === "single") {
                                  setAnswers(prev => ({ ...prev, [i]: { selected: idx } }));
                                } else {
                                  setAnswers(prev => {
                                    const selected = prev[i]?.selected || [];
                                    if (selected.includes(idx)) {
                                      return { ...prev, [i]: { selected: selected.filter(x => x !== idx) } };
                                    } else {
                                      return { ...prev, [i]: { selected: [...selected, idx] } };
                                    }
                                  });
                                }
                              }}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}

                    {q.fieldType === "likert" && (
                      <div className="flex items-center flex-wrap gap-1 mb-2">
                        {[...Array(q.likertRange || 5)].map((_, idx) => (
                          <button
                            key={idx}
                            className={`w-6 h-6 text-[10px] border rounded-md flex items-center justify-center ${
                              answers[i]?.rating === idx + 1
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => handleRatingChange(i, idx + 1)}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-end pt-1">
                  <Button size="sm" className="text-xs px-3 py-1 rounded-md">
                    Submit Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
