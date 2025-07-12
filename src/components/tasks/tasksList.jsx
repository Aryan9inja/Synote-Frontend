import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../../store/tasksSlice.js";
import { FiEdit, FiTrash, FiPlus, FiCheck, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import TaskSummary from "./taskSummary.jsx";

function TaskList() {
  const [showForm, setShowForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  const tasks = useSelector((state) => state.tasks.tasks);
  const loading = useSelector((state) => state.tasks.loading);
  const error = useSelector((state) => state.tasks.error);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  const resetForm = () => {
    setTaskTitle("");
    setDueDate("");
    setIsEditing(false);
    setEditTaskId(null);
    setShowForm(false);
  };

  const handleSaveTask = () => {
    if (!taskTitle.trim()) return;

    if (isEditing) {
      dispatch(
        updateTask({
          taskId: editTaskId,
          updatedTitle: taskTitle,
          newDueDate: dueDate ? new Date(dueDate).toISOString() : null,
        })
      );
    } else {
      dispatch(
        createTask({
          title: taskTitle,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        })
      );
    }

    resetForm();
  };

  const handleEdit = (task) => {
    setTaskTitle(task.title);
    setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setIsEditing(true);
    setEditTaskId(task._id);
    setShowForm(true);
  };

  const handleCancel = () => resetForm();

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="relative w-full p-4">
      {/* Form for create/edit */}
      {showForm && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 mb-4 border border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-600 rounded-md shadow">
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Enter task title"
            className="flex-1 px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Due Date (Optional):
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveTask}
              className="text-green-600 hover:text-green-800 text-xl"
              title={isEditing ? "Update Task" : "Save Task"}
            >
              <FiCheck />
            </button>
            <button
              onClick={handleCancel}
              className="text-red-600 hover:text-red-800 text-xl"
              title="Cancel"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}

      {/* Tasks List */}
      {loading && <p className="text-gray-500">Loading tasks...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <p className="text-xl text-gray-500 mb-4">No tasks yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="text-lg" />
            Create Your First Task
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded bg-white shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {task.title}
                </h3>
                {task.dueDate && (
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    Due: {formatDate(task.dueDate)}
                  </p>
                )}
                {/* ✅ Link to subtasks */}
                <Link
                  to={`/tasks/${task._id}/subtasks`}
                  className="mt-2 inline-block text-blue-500 hover:underline text-sm"
                >
                  View Subtasks
                </Link>
                <TaskSummary taskId={task._id} />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(task)}
                  className="text-blue-500 hover:text-blue-700 text-xl"
                  title="Edit"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => dispatch(deleteTask(task._id))}
                  className="text-red-500 hover:text-red-700 text-xl"
                  title="Delete"
                >
                  <FiTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Create Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          title="Create Task"
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="text-2xl" />
        </button>
      )}
    </div>
  );
}

export default TaskList;
