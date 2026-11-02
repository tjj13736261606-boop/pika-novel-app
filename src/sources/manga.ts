// 漫画源接口：按 haka_comic 的 network 层形状抽象（列表 / 详情 / 章节 / 章节图片），
// 但实现不走哔咔的私有接口。
// 原因讲清：haka 那套哔咔接口要靠官方 App 内嵌的私有密钥做签名，那是另一个 App 的私有凭证，
// 我不会把它抄进你的 App 里；哔咔接口本身也不是公开 API。
// 所以第一版接的是公开 API、无需密钥的 MangaDex，并只取 safe 分级，过滤掉成人内容。
// 以后你要接别的漫画源，只要再实现本接口即可，阅读器不用动。

export interface Manga {
  id: string;
  title: string;
  cover?: string;
  author?: string;
  description?: string;
  status?: string;
}

export interface MangaChapter {
  id: string;
  title: string;
  chapterNumber?: string;
  language?: string;
}

export interface MangaSource {
  id: string;
  name: string;
  searchManga(keyword: string, page?: number): Promise<Manga[]>;
  getMangaDetail(mangaId: string): Promise<Manga>;
  getChapters(mangaId: string): Promise<MangaChapter[]>;
  getChapterPages(chapterId: string): Promise<string[]>;
}

const MANGADEX_BASE = 'https://api.mangadex.org';

function pickTitle(titles: Record<string, string> | undefined): string {
  if (!titles) return '未知标题';
  return titles.en ?? titles['ja-ro'] ?? titles.ja ?? Object.values(titles)[0] ?? '未知标题';
}

interface MangaDexManga {
  id: string;
  attributes: {
    title: Record<string, string>;
    description?: Record<string, string>;
    status?: string;
  };
  relationships?: { type: string; attributes?: { fileName?: string; name?: string } }[];
}

function toManga(m: MangaDexManga): Manga {
  const cover = m.relationships?.find((r) => r.type === 'cover_art');
  const author = m.relationships?.find((r) => r.type === 'author');
  return {
    id: m.id,
    title: pickTitle(m.attributes.title),
    cover: cover?.attributes?.fileName
      ? `https://uploads.mangadex.org/covers/${m.id}/${cover.attributes.fileName}.256.jpg`
      : undefined,
    author: author?.attributes?.name,
    description: m.attributes.description?.en ?? Object.values(m.attributes.description ?? {})[0],
    status: m.attributes.status,
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`请求失败：${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const MangaDexSource: MangaSource = {
  id: 'mangadex',
  name: 'MangaDex（公开 API）',
  async searchManga(keyword, page = 1) {
    const q = new URLSearchParams();
    q.set('limit', '20');
    q.set('offset', String((page - 1) * 20));
    q.append('includes[]', 'cover_art');
    q.append('includes[]', 'author');
    q.append('contentRating[]', 'safe');
    if (keyword.trim()) {
      q.set('title', keyword.trim());
    }
    const data = await fetchJson<{ data: MangaDexManga[] }>(`${MANGADEX_BASE}/manga?${q}`);
    return data.data.map(toManga);
  },
  async getMangaDetail(mangaId) {
    const data = await fetchJson<{ data: MangaDexManga }>(
      `${MANGADEX_BASE}/manga/${mangaId}?includes[]=cover_art&includes[]=author`,
    );
    return toManga(data.data);
  },
  async getChapters(mangaId) {
    const data = await fetchJson<{
      data: { id: string; attributes: { chapter?: string; title?: string; translatedLanguage?: string } }[];
    }>(
      `${MANGADEX_BASE}/manga/${mangaId}/feed?limit=100&order[chapter]=asc&translatedLanguage[]=en`,
    );
    return data.data
      .filter((c) => c.attributes.chapter)
      .map((c) => ({
        id: c.id,
        chapterNumber: c.attributes.chapter,
        title: c.attributes.title ? `第 ${c.attributes.chapter} 话 · ${c.attributes.title}` : `第 ${c.attributes.chapter} 话`,
        language: c.attributes.translatedLanguage,
      }));
  },
  async getChapterPages(chapterId) {
    const data = await fetchJson<{
      baseUrl: string;
      chapter: { hash: string; data: string[] };
    }>(`${MANGADEX_BASE}/at-home/server/${chapterId}`);
    return data.chapter.data.map((f) => `${data.baseUrl}/data/${data.chapter.hash}/${f}`);
  },
};
