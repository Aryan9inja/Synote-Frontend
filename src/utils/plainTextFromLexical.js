function extractTextFromLexicalJSON(lexicalJson) {
  if (!lexicalJson || !lexicalJson.root) return "";

  const nodes = lexicalJson.root.children || [];
  let text = "";

  for (const node of nodes) {
    if (node.type === "paragraph" || node.type === "heading") {
      if (node.children) {
        for (const child of node.children) {
          if (child.type === "text") {
            text += child.text;
          }
        }
      }
      text += "\n"; // line break after paragraph/heading
    }
  }

  return text.trim();
}

export default extractTextFromLexicalJSON