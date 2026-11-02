// 统一书模型：漫画和小说共用一条记录，靠 type 区分，阅读器再分流。
export type BookType = 'comic' | 'novel';

export interface Chapter {
  id: string;
  title: string;
  // 漫画：这一话的图片地址列表（本地或之后接源）；小说：这一章的正文。
  pages?: string[];
  text?: string;
}

export interface Progress {
  chapterIndex: number;
  // 漫画：页码；小说：本章内的字符偏移（先记章即可，之后再细化到字）。
  pageIndex: number;
}

export interface Book {
  id: string;
  type: BookType;
  title: string;
  author: string;
  cover?: string;
  chapters: Chapter[];
  progress: Progress;
}
