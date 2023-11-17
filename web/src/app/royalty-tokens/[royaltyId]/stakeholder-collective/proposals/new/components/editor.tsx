'use client';

import { Editor as NovelEditor } from 'novel';

type Props = {
  onUpdate: (value: string) => void;
};

export default function Editor({ onUpdate }: Props) {
  return (
    <div className="relative max-w-screen-lg overflow-hidden rounded-xl border">
      <NovelEditor
        className="min-h-[400px] bg-background"
        defaultValue=""
        onDebouncedUpdate={(editor) => {
          if (editor) {
            onUpdate(editor.getHTML());
          }
        }}
        disableLocalStorage
      />
    </div>
  );
}
