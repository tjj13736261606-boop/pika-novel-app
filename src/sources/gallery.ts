// 通用画廊源接口：对照 EhViewer 的分层（请求 / 解析 / 画廊模型 / 图片抓取 / 下载），
// 只取接口形状，不搬它的代码，不含登录、Cookie、镜像、绕限制、收藏、评分、评论、下载整本。
// 第一版只接本地示例源，真实源之后在 src/sources/ 里另起文件实现本接口。

export interface Gallery {
  id: string;
  title: string;
  thumb: string;
  tags: string[];
  pageCount: number;
}

export interface GalleryTagGroup {
  name: string;
  tags: string[];
}

export interface GalleryPreview {
  position: number;
  imageUrl: string;
}

export interface GalleryDetail extends Gallery {
  tagGroups: GalleryTagGroup[];
  previews: GalleryPreview[];
  previewPageCount: number;
}

export interface GalleryQuery {
  keyword?: string;
  page?: number;
  pageSize?: number;
}

export interface GalleryListResult {
  galleries: Gallery[];
  hasNextPage: boolean;
}

export interface GallerySource {
  id: string;
  listGalleries(query: GalleryQuery): Promise<GalleryListResult>;
  getGalleryDetail(galleryId: string): Promise<GalleryDetail>;
  getPreviews(galleryId: string): Promise<GalleryPreview[]>;
  getPageImage(galleryId: string, pageIndex: number): Promise<string>;
}

// 本地示例源：全是占位数据，不含任何真实图集内容，只用来跑通接口。
// 阅读器一页就是一张图，和漫画的图片翻页逻辑共用。
const SAMPLE_GALLERY: GalleryDetail = {
  id: 'sample-gallery',
  title: '示例图集',
  thumb: '占位封面图',
  tags: ['示例', '图集'],
  pageCount: 3,
  tagGroups: [{ name: '示例分组', tags: ['示例', '图集'] }],
  previews: [
    { position: 0, imageUrl: '占位图 1' },
    { position: 1, imageUrl: '占位图 2' },
    { position: 2, imageUrl: '占位图 3' },
  ],
  previewPageCount: 1,
};

// 第一个真实画廊源：Picsum.photos，公开、无需密钥、无需登录的摄影图集，
// 不是 E-Hentai，也不是任何成人站。列表是一组摄影照片，每张照片就是一个 1 页图集。
interface PicsumPhoto {
  id: string;
  author: string;
  download_url: string;
}

export const PicsumGallerySource: GallerySource = {
  id: 'picsum',
  async listGalleries(query) {
    const page = query.page ?? 1;
    const res = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=20`);
    if (!res.ok) {
      throw new Error(`请求失败：${res.status}`);
    }
    const photos = (await res.json()) as PicsumPhoto[];
    return {
      galleries: photos.map((p) => ({
        id: p.id,
        title: `照片 ${p.id} · ${p.author}`,
        thumb: `https://picsum.photos/id/${p.id}/400/300`,
        tags: ['摄影', p.author],
        pageCount: 1,
      })),
      hasNextPage: photos.length === 20,
    };
  },
  async getGalleryDetail(galleryId) {
    const res = await fetch(`https://picsum.photos/id/${galleryId}/info`);
    if (!res.ok) {
      throw new Error(`请求失败：${res.status}`);
    }
    const p = (await res.json()) as PicsumPhoto;
    return {
      id: p.id,
      title: `照片 ${p.id} · ${p.author}`,
      thumb: `https://picsum.photos/id/${p.id}/400/300`,
      tags: ['摄影', p.author],
      pageCount: 1,
      tagGroups: [{ name: '作者', tags: [p.author] }],
      previews: [{ position: 0, imageUrl: `https://picsum.photos/id/${p.id}/1200/800` }],
      previewPageCount: 1,
    };
  },
  async getPreviews(galleryId) {
    const detail = await this.getGalleryDetail(galleryId);
    return detail.previews;
  },
  async getPageImage(galleryId, pageIndex) {
    const detail = await this.getGalleryDetail(galleryId);
    const preview = detail.previews[pageIndex];
    if (!preview) {
      throw new Error('页码超出范围');
    }
    return preview.imageUrl;
  },
};

export const SampleGallerySource: GallerySource = {
  id: 'sample-gallery',
  async listGalleries(query) {
    const keyword = (query.keyword ?? '').trim();
    const galleries = keyword && !SAMPLE_GALLERY.title.includes(keyword) ? [] : [SAMPLE_GALLERY];
    return { galleries, hasNextPage: false };
  },
  async getGalleryDetail(galleryId) {
    if (galleryId !== SAMPLE_GALLERY.id) {
      throw new Error('找不到该图集');
    }
    return SAMPLE_GALLERY;
  },
  async getPreviews(galleryId) {
    const detail = await this.getGalleryDetail(galleryId);
    return detail.previews;
  },
  async getPageImage(galleryId, pageIndex) {
    const detail = await this.getGalleryDetail(galleryId);
    const preview = detail.previews[pageIndex];
    if (!preview) {
      throw new Error('页码超出范围');
    }
    return preview.imageUrl;
  },
};
