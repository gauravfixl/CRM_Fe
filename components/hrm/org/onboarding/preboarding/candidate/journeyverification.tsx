export default function JourneyTimeline({ tasks }) {
  // Count completed tasks
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const totalTasks = tasks.length;
  const progress = (completedTasks / totalTasks) * 100;

  // Steps of journey
  const steps = [
    "Invited to candidate portal",
    "Info collection",
    "Offer release",
    "Offer acceptance",
    "Joining",
  ];

  // 🔥 Automatically mark first step as completed
  // and use completedTasks to determine further progress
  let visibleCompletedSteps = 1; // Step 1 always completed

  // Example: after both docs submitted, mark step 2
  if (completedTasks >= 2) {
    visibleCompletedSteps = 2;
  }

  // Later you can add more conditions:
  // if (offerReleased) visibleCompletedSteps = 3;
  // if (offerAccepted) visibleCompletedSteps = 4;
  // if (joined) visibleCompletedSteps = 5;

  return (
    <div className="border rounded-lg p-5 mt-4">
      <h6 className="font-medium mb-4 text-xs">
        You are here in our hiring journey
      </h6>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${
                i < visibleCompletedSteps ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
            <p
              className={`text-sm ${
                i < visibleCompletedSteps ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
