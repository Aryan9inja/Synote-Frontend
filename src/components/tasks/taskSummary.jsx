import { useState } from "react";
import { getTaskSummary } from "../../services/aiService";

function TaskSummary({ taskId }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");

  const handleToggle = async () => {
    if (isVisible) {
      setIsVisible(false);
      return;
    }

    if (summary) {
      setIsVisible(true);
      return;
    }

    try {
      setIsLoading(true);
      const summary = await getTaskSummary({ taskId });
      setSummary(summary);
      setIsVisible(true);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        disabled={isLoading}
        onClick={handleToggle}
        className="text-sm text-green-600 hover:underline"
      >
        {isVisible ? "Hide Summary" : "Show Summary"}
      </button>

      {isVisible && (
        <div className="mt-6 p-2 m-2 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-700 rounded-md shadow-sm text-sm whitespace-pre-wrap">
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-3/4" />
              <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-5/6" />
              <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-2/3" />
            </div>
          ) : (
            <p>{summary}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskSummary;
