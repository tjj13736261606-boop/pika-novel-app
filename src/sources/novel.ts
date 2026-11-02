// 小说源接口：按 LNReader 的插件形状抽象
// （popularNovels / searchNovels / parseNovelAndChapters / parseChapter / fetchImage 那套，
// 这里压成四个方法：热门、搜索、详情（含章节列表）、章节正文）。
// LNReader 的真实插件是用户自己装的 JS 插件，放在独立仓库里，本 App 不内置任何
// 针对版权小说站的抓取插件；第一版先接本地示例插件，跑通“列表 → 详情 → 章节正文”这条线，
// 之后你要加真实源，就按本接口再写一个实现，阅读器不用动。

export interface Novel {
  id: string;
  title: string;
  cover?: string;
  author?: string;
  description?: string;
}

export interface NovelChapter {
  id: string;
  title: string;
}

export interface NovelDetail extends Novel {
  chapters: NovelChapter[];
}

export interface NovelSource {
  id: string;
  name: string;
  popularNovels(page?: number): Promise<Novel[]>;
  searchNovels(keyword: string): Promise<Novel[]>;
  getNovelDetail(novelId: string): Promise<NovelDetail>;
  getChapterText(novelId: string, chapterId: string): Promise<string>;
}

const SAMPLE_NOVEL: NovelDetail = {
  id: 'sample-novel',
  title: '示例小说',
  author: '示例作者',
  description: '示例小说，用于跑通小说源接口，不含真实内容。',
  chapters: [
    { id: 'n1', title: '第一章' },
    { id: 'n2', title: '第二章' },
  ],
};

const SAMPLE_TEXTS: Record<string, string> = {
  n1: '这是一段示例正文。先把文字排版、翻页、记进度跑通，之后再接你自己的文本或书源。',
  n2: '这是第二章的示例正文。',
};

export const SampleNovelSource: NovelSource = {
  id: 'sample-novel',
  name: '示例小说源（本地）',
  async popularNovels() {
    return [SAMPLE_NOVEL];
  },
  async searchNovels(keyword) {
    const k = keyword.trim();
    return k && !SAMPLE_NOVEL.title.includes(k) ? [] : [SAMPLE_NOVEL];
  },
  async getNovelDetail(novelId) {
    if (novelId !== SAMPLE_NOVEL.id) {
      throw new Error('找不到这本小说');
    }
    return SAMPLE_NOVEL;
  },
  async getChapterText(novelId, chapterId) {
    if (novelId !== SAMPLE_NOVEL.id) {
      throw new Error('找不到这本小说');
    }
    const text = SAMPLE_TEXTS[chapterId];
    if (text === undefined) {
      throw new Error('找不到这一章');
    }
    return text;
  },
};
