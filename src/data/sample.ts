import { Book } from '../types';

// 占位示例，不含任何真实漫画、小说内容，只用来跑通“书架 -> 详情 -> 阅读 -> 记进度”。
export const SAMPLE_BOOKS: Book[] = [
  {
    id: 'sample-comic',
    type: 'comic',
    title: '示例漫画',
    author: '示例作者',
    chapters: [
      { id: 'c1', title: '第 1 话', pages: ['占位图 1', '占位图 2', '占位图 3'] },
      { id: 'c2', title: '第 2 话', pages: ['占位图 1', '占位图 2'] },
    ],
    progress: { chapterIndex: 0, pageIndex: 0 },
  },
  {
    id: 'sample-novel',
    type: 'novel',
    title: '示例小说',
    author: '示例作者',
    chapters: [
      {
        id: 'n1',
        title: '第一章',
        text: '这是一段示例正文。先把文字排版、翻页、记进度跑通，之后再接你自己的文本或书源。',
      },
      { id: 'n2', title: '第二章', text: '这是第二章的示例正文。' },
    ],
    progress: { chapterIndex: 0, pageIndex: 0 },
  },
];
