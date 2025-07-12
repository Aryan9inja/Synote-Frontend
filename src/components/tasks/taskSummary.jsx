import { useState } from "react";
import { getTaskSummary } from "../../services/aiService";

function TaskSummary({ taskId }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState(null);

  const handleToggle = async () => {
    if (isVisible) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    setError(null);
    setIsLoading(true);

    if (summary) {
      setIsLoading(false);
      return;
    }

    try {
      const summary = await getTaskSummary({ taskId });
      setSummary(summary);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
      setError(err.message || "Failed to load summary.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        disabled={isLoading}
        onClick={handleToggle}
        className={
          isLoading
            ? "cursor-not-allowed text-sm text-gray-400"
            : "text-sm text-green-600 hover:underline"
        }
      >
        {isVisible ? "Hide Summary" : "Show Summary"}
      </button>

      {isVisible && (
        <div className="mt-6 p-2 m-2 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-700 rounded-md shadow-sm text-sm whitespace-pre-wrap">
          {error ? (
            <div className="flex items-center justify-center text-red-600 dark:text-red-400 text-sm text-center">
              ⚠️ {error}
            </div>
          ) : isLoading ? (
            <div className="mt-4 text-blue-600 dark:text-blue-200 text-sm italic animate-pulse">
              Loading summary...
            </div>
          ) : (
            <div>
              <h2 className="mb-2 font-semibold">AI Summary =&gt;</h2>
              <p>{summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskSummary;
