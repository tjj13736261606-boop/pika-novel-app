import { useState } from 'react';
import { Book } from '../types';
import { SAMPLE_BOOKS } from '../data/sample';

// v0.1 先用内存状态 + 示例书，跑通流程；之后把这里换成 expo-sqlite 持久化，
// 对外接口（books、updateProgress）不变，界面不用改。
export function useBooks() {
  const [books, setBooks] = useState<Book[]>(SAMPLE_BOOKS);

  function updateProgress(bookId: string, chapterIndex: number, pageIndex: number) {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, progress: { chapterIndex, pageIndex } } : b,
      ),
    );
  }

  return { books, updateProgress };
}
