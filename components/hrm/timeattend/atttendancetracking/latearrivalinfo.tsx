export default function LateArrivalInfo() {
  return (
    <div className="w-80 border-l bg-gray-50 p-4 text-[11px] overflow-y-auto">
      <p className="font-semibold mb-2 text-gray-700 text-xs">
        What is a late arrival penalty?
      </p>
      <p className="mb-3 text-gray-600 text-xs">
        This is the scenario where the employee is penalised for arriving at work after the designated shift start time.
      </p>

      <p className="font-semibold mb-2 text-gray-700 text-xs">
        What is the difference between number of late arrival incidents and total hours of late arrival?
      </p>
      <p className="mb-3 text-gray-600 text-xs">
        <span className="font-medium">Late arrival incidents</span> restrict the number of late arrivals to work within a time period.
        For e.g., you may allow employees two late arrivals in a month before implementing penalties.
      </p>
      <p className="mb-3 text-gray-600 text-xs">
        <span className="font-medium">Total hours of late arrival</span> restricts an employee’s cumulative tardiness within a time period,
        irrespective of the number of occurrences. For example, allowing 2 hours of late arrival within a week lets employees
        distribute this time flexibly — like 1 hour late for 2 days or 2 hours on a single day.
      </p>

      <p className="font-semibold mb-2 text-gray-700 text-xs">
        What is penalisation cycle?
      </p>
      <p className="mb-3 text-gray-600 text-xs">
        The penalisation cycle refers to the duration during which employee penalties are taken into account.
      </p>

      <p className="font-semibold mb-2 text-gray-700 text-xs">
        What is the difference between monthly and weekly cycle?
      </p>
      <p className="mb-1 text-gray-600 text-xs">
        <span className="font-medium">Monthly Cycle:</span> If configured, penalties are considered on a monthly basis, starting from the 1st to the last day of the month.
        Note that if a policy is assigned mid-month, attendance tracking begins at the end of that month.
      </p>
      <p className="text-gray-600 text-xs">
        <span className="font-medium">Weekly Cycle:</span> If configured, penalties are considered on a weekly basis, from Monday to Sunday.
        If a policy is assigned mid-week, attendance tracking starts at the end of that week.
      </p>
    </div>
  );
}
