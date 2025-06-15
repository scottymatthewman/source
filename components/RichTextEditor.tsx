"use dom"

import '@blocknote/core/style.css';
import { BlockNoteViewRaw, useCreateBlockNote } from '@blocknote/react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isDarkMode?: boolean;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder, 
  className,
  isDarkMode 
}: RichTextEditorProps) {
    const editor = useCreateBlockNote({
        initialContent: [
          {
            type: "paragraph",
            content: "Welcome to this demo!",
          },
          {
            type: "heading",
            content: "This is a heading block",
          },
          {
            type: "paragraph",
            content: "This is a paragraph block",
          },
          {
            type: "paragraph",
          },
        ],
      });

  useEffect(() => {
    if (editor && value) {
      try {
        const content = JSON.parse(value);
        if (Array.isArray(content)) {
          editor.replaceBlocks(editor.topLevelBlocks, content);
        }
      } catch (e) {
        console.error('Failed to parse editor content:', e);
        // If parsing fails, set empty content
        editor.replaceBlocks(editor.topLevelBlocks, []);
      }
    }
  }, [value, editor]);

  return (
    <div className={`w-full ${className || ''}`}>
      <BlockNoteViewRaw editor={editor} />
    </div>
  );
}