"use dom";

import React, { useRef } from "react";

export default function DomTest() {
  const editableRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ padding: 24, height: '100%', background: '#fafafa' }}>
      <h2>DOM Test Component</h2>
      <div
        ref={editableRef}
        contentEditable
        style={{
          minHeight: 100,
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 24,
          background: '#fff',
        }}
        suppressContentEditableWarning
      >
        Try editing this contenteditable div.
      </div>
      <textarea
        style={{
          width: '100%',
          minHeight: 80,
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: 12,
        }}
        placeholder="Try typing in this textarea."
      />
    </div>
  );
} 