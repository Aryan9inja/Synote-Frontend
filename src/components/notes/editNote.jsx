import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNote, updateNote } from "../../store/notesSlice.js";
import { useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "../richTextEditor/richTextEditor.jsx";

function EditNote() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const note = useSelector((state) => state.notes.currentNote);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (!note) {
      dispatch(getNote(id));
    } else {
      setTitle(note.title);
    }
  }, [dispatch, id, note]);

  useEffect(() => {
    if (!note) return;
    const isTitleChanged = title !== note.title;
    const isContentChanged =
      JSON.stringify(content) !== JSON.stringify(note.content);
    setIsModified(isTitleChanged || isContentChanged);
  }, [title, content, note]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedNote = { title, content };
      await dispatch(updateNote({ noteId: id, updatedNote }));
      navigate("/notes");
    } catch (err) {
      console.error("Failed to update note:", err);
    }
  };

  const handleCancel = () => {
    navigate("/notes");
  };

  if (!note || !note.content) {
    return <p className="text-gray-500 text-center mt-10">Loading note...</p>;
  }

  return (
    <div className="pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8 bg-light-background dark:bg-gray-900 min-h-screen">
      <form
        onSubmit={handleSave}
        className="max-w-4xl mx-auto flex flex-col gap-6"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 text-lg rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <RichTextEditor
          initialContent={note.content}
          onChange={(editorState) => setContent(editorState)}
        />

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isModified}
            className={`px-6 py-2 text-white rounded-md transition-colors ${
              isModified
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditNote;
