// 源注册表：合集版目前接好的全部源，一处登记，界面只从这里取。
// 漫画：MangaDex（公开 API、无密钥、只取 safe 分级）
// 小说：示例小说源（本地，LNReader 插件形状；真实插件以后按 novel.ts 的接口另加）
// 画廊：示例图集源（本地）+ Picsum 摄影图集源（公开、无密钥）
// 不在表里的：哔咔私有接口（要官方 App 内嵌私有密钥，不抄）、E-Hentai 登录 / 镜像 / 绕限制（不接）。

import { MangaDexSource } from './manga';
import { SampleNovelSource } from './novel';
import { PicsumGallerySource, SampleGallerySource } from './gallery';

export type SourceKind = 'manga' | 'novel' | 'gallery';

export interface SourceEntry {
  kind: SourceKind;
  id: string;
  name: string;
  description: string;
}

export const SOURCES: SourceEntry[] = [
  { kind: 'manga', id: MangaDexSource.id, name: MangaDexSource.name, description: '公开漫画 API，可搜索、看详情、看章节图片' },
  { kind: 'novel', id: SampleNovelSource.id, name: SampleNovelSource.name, description: '本地示例，跑通小说列表、详情、章节正文' },
  { kind: 'gallery', id: SampleGallerySource.id, name: '示例图集源（本地）', description: '本地示例，跑通画廊列表、详情、图片页' },
  { kind: 'gallery', id: PicsumGallerySource.id, name: 'Picsum 摄影图集（公开）', description: '公开摄影照片，无需登录，可直接浏览' },
];

export { MangaDexSource, SampleNovelSource, PicsumGallerySource, SampleGallerySource };
