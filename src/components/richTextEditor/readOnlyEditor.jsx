import { useEffect } from "react";
import { useSelector } from "react-redux";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import theme from "../../constants/lexicalTheme";

const SetEditorStatePlugin = () => {
  const [editor] = useLexicalComposerContext();
  const content = useSelector((state) => state.notes.currentNote?.content);

  useEffect(() => {
    if (!content) return;

    try {
      const parsedContent = editor.parseEditorState(content);
      editor.setEditorState(parsedContent);
    } catch (err) {
      console.error("Failed to parse Lexical content:", err);
    }
  }, [content, editor]);

  return null;
};

const ReadOnlyEditor = ({ content }) => {
  const config = {
    namespace: "ReadOnlyNote",
    theme,
    onError: (err) => console.error("Lexical Error", err),
    nodes: [HeadingNode, ListNode, ListItemNode],
  };

  return (
    <LexicalComposer initialConfig={config}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className="prose dark:prose-invert max-w-none outline-none"
            readOnly
          />
        }
        placeholder={<div />}
        ErrorBoundary={({ error }) => (
          <p className="text-red-500">Error: {error.message}</p>
        )}
      />
      <HistoryPlugin />
      <ListPlugin />
      <SetEditorStatePlugin content={content} />
    </LexicalComposer>
  );
};

export default ReadOnlyEditor;
