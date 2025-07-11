import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getNote, deleteNote } from "../../store/notesSlice.js";
import ReadOnlyEditor from "../richTextEditor/readOnlyEditor.jsx";
import { FiArrowLeft, FiEdit, FiTrash2 } from "react-icons/fi";
import { getNoteSummary } from "../../services/aiService.js";
import extractTextFromLexicalJSON from "../../utils/plainTextFromLexical.js";
import { createEditor } from "lexical";

function FullNote() {
  const [showSummary, setShowSummary] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summary, setSummary] = useState(null);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const note = useSelector((state) => state.notes.currentNote);

  useEffect(() => {
    dispatch(getNote(id));
  }, [id, dispatch]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await dispatch(deleteNote(id)).unwrap();
      navigate("/notes");
    }
  };

  const handleEdit = () => {
    navigate(`/notes/edit/${id}`);
  };

  const handleBack = () => {
    navigate("/notes");
  };

  const handleSummary = async () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }

    setLoadingSummary(true);
    setSummary(null);

    try {
      const plainText = extractTextFromLexicalJSON(note.content);
      console.log(plainText);
      const response = await getNoteSummary({
        noteId: note._id,
        title: note.title,
        content: plainText,
      });

      setSummary(response.data.summary);
      setShowSummary(true);
    } catch (error) {
      console.error("AI Summary Error:", error.message);
      setSummary("Failed to generate summary.");
      setShowSummary(true);
    } finally {
      setLoadingSummary(false);
    }
  };

  if (!note) {
    return <p className="text-center mt-10 text-gray-500">Loading note...</p>;
  }

  return (
    <div className="pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8 bg-light-background dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          {note.title}
        </h1>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
          <ReadOnlyEditor content={note.content} />
        </div>

        {/* Summary Block */}
        {showSummary && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-700 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold mb-2">AI Summary</h2>
            {loadingSummary ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-3/4"></div>
                <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-2/3"></div>
                <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-1/2"></div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{summary}</p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            <FiArrowLeft /> Back
          </button>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FiEdit /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <FiTrash2 /> Delete
          </button>
          <button
            onClick={handleSummary}
            disabled={loadingSummary}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded transition-colors ${
              loadingSummary
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            🧠{" "}
            {showSummary
              ? "Hide Summary"
              : loadingSummary
              ? "Summarizing..."
              : "Summarize"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FullNote;
