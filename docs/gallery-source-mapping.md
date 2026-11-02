# 画廊源接口对照表：EhViewer 分层 → 合集版 React Native

来源：EhViewer 中文增强版源码（`~/workspace/research/ehviewer-cn/`，GPL-3.0），只借鉴分层与接口形状，
不搬代码、不接 E-Hentai 登录、Cookie、镜像与绕限制那套。合集版先做通用画廊源接口，
先用本地示例图集跑通，之后再接公开非成人的图集源。

## 一、分层对照

| EhViewer（原生 Android Java） | 合集版（React Native，`src/sources/gallery.ts`） | 说明 |
|---|---|---|
| `client/EhClient.java`：任务队列 + 回调，统一发请求 | `GallerySource` 接口本身，不另起队列 | RN 里用 async/await + AbortSignal 取消即可，不需要 AsyncTask 那套 |
| `client/EhEngine.java`：`getGalleryList`、`getGalleryDetail`、`getPreviewSet`、`getGalleryPage` / `getGalleryPageApi` | `listGalleries`、`getGalleryDetail`、`getPreviews`、`getPageImage` | 方法一一对应，名字换成 JS 习惯，参数只留业务字段 |
| `client/parser/`：`GalleryListParser`、`GalleryDetailParser`、`GalleryPageParser`、`GalleryPageApiParser` | 源实现内部的解析函数（不暴露成公共接口） | 每个源自己负责把返回数据解析成统一模型，界面只认统一模型 |
| `client/data/GalleryInfo.java` | `Gallery` | 列表里的一条 |
| `client/data/GalleryDetail.java` | `GalleryDetail` | 详情页的一条，含标签、页数、预览集 |
| `client/data/GalleryPreview.java`、`PreviewSet.java` | `GalleryPreview`（`imageUrl` + `position`） | 详情页的缩略图格子 |
| `client/parser/GalleryPageApiParser.Result.imageUrl` | `getPageImage()` 的返回值 | 阅读器一页就是一张图，和漫画阅读器共用图片翻页逻辑 |
| `gallery/EhGalleryProvider.java`、`GalleryProvider2.java` | 阅读器的图片提供方（之后接） | 现在先不做，只留接口位：给页码，返回图片地址 |
| `spider/SpiderQueen.java`、`SpiderInfo.java` | 图片加载 + 预加载策略（之后接） | 核心就两条：按需加载当前页、提前加载下一页；不要一次全下 |
| `download/DownloadManager.java`、`DownloadService.kt` | 离线缓存（之后接） | 先只记进度不下载；下载是 v0.4 以后的事 |

## 二、数据模型对照

| EhViewer 字段 | 合集版字段 | 备注 |
|---|---|---|
| `GalleryInfo.gid`、`token` | `Gallery.id`（源内唯一标识，拼成字符串即可） | 不要把 gid/token 原样当成通用字段，源内部自己拼 |
| `GalleryInfo.title`、`titleJpn` | `Gallery.title`（只留一个主标题） | 多语言标题不在 v0.1 做 |
| `GalleryInfo.thumb` | `Gallery.thumb` | 列表封面图 |
| `GalleryInfo.category`、`simpleTags` | `Gallery.tags: string[]` | 分类直接并进标签，不另设分类枚举 |
| `GalleryInfo.pages` | `Gallery.pageCount` | 总页数，阅读进度分母 |
| `GalleryInfo.posted`、`uploader`、`rating` | `GalleryDetail` 里再放，不进列表模型 | 列表模型保持瘦，详情再展开 |
| `GalleryDetail.tags: GalleryTagGroup[]` | `GalleryDetail.tagGroups: { name: string; tags: string[] }[]` | 分组标签压平成名字 + 标签数组 |
| `GalleryDetail.previewPages`、`previewSet` | `GalleryDetail.previews: GalleryPreview[]` + `previewPageCount` | 预览分页先按一页给，之后再做预览翻页 |
| `GalleryPageApiParser.Result.imageUrl` | `getPageImage(galleryId, pageIndex): Promise<string>` | 一页一张图；原图 / 缩略图之分不在接口里做，源内部定 |

## 三、接口形状（已落在 `src/sources/gallery.ts`）

```ts
interface GallerySource {
  id: string; // 如 'sample-gallery'，之后每个真实源一个 id
  listGalleries(query: GalleryQuery): Promise<GalleryListResult>;
  getGalleryDetail(galleryId: string): Promise<GalleryDetail>;
  getPreviews(galleryId: string): Promise<GalleryPreview[]>;
  getPageImage(galleryId: string, pageIndex: number): Promise<string>;
}
```

`GalleryQuery` 只有三个字段：`keyword?`、`page?`、`pageSize?`。不要在第一版就加排序、筛选、收藏、评分。

## 四、明确不映射、不做的部分

以下 EhViewer 功能不在对照表里，也不在合集版第一版里，之后也不按 E 站那套做：

- `signIn`、登录、Cookie、账号、ExHentai 相关
- 镜像、直连、绕限制相关
- 收藏、评分、评论、种子、归档、订阅标签、排行榜
- 下载整本、后台下载服务（只留接口位，不实现）

## 五、接进现有合集版的顺序

1. 本表 + `src/sources/gallery.ts` 接口 + 本地示例源（已做，见 `SampleGallerySource`，全是占位图，不含真实内容）
2. 书架里加“画廊”一栏，复用现有列表样式，点进详情页（已做，`LibraryScreen` 分书本、画廊两栏）
3. 详情页放缩略图格子，点缩略图进阅读器，阅读器复用漫画的图片翻页逻辑（已做，`GalleryDetailScreen` 三列缩略图格子 + `GalleryReaderScreen` 上一页/下一页，TypeScript 检查通过、Metro 打包 1.81 MB）
4. 之后再接第一个公开非成人的图集源，源实现只放在 `src/sources/` 里，不动阅读器（已做：Picsum 摄影图集源，公开、无密钥，`GalleryDetail` / `GalleryReader` 已按 `sourceId` 区分示例源与 Picsum 源，真实图片用 Image 渲染）

到第 3 步之前，`Book` 类型不改：画廊先走自己的 `Gallery` 模型，不强行塞进漫画/小说的 `Book` 里，
等书架、详情、阅读三处都跑通了，再决定要不要统一成一个 `BookType`。
