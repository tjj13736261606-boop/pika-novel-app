# 合集版 v0.1 骨架：漫画 + 小说，一个书架

用户 2026-11-02 选定：用 React Native 做漫画 + 轻小说合集版。
参考来源只当思路，不直接搬代码：
- 漫画侧参考 haka_comic（Flutter + Dart，GPL-3.0）：接口层、话数、图片阅读器的思路
- 小说侧参考 LNReader（React Native + TypeScript，MIT）：插件式书源、文字阅读器、书架进度的思路
- 本骨架为自己从零写的最小代码，协议按自己的项目定；如果之后直接搬了 haka_comic 的代码，
  发布时必须跟 GPL-3.0 走，不能当成 MIT 发布。

## v0.1 到底能干什么（第一步闭环，不接任何在线源）

- 统一书架：漫画和小说放同一个列表，一条记录带类型字段
- 本地导入占位：示例里放一本示例漫画、一本示例小说，先把“能看、能记进度”跑通
- 双阅读器：
  - 漫画：图片翻页（示例用占位图，之后换成你自己的图或本地图包）
  - 小说：文字排版，字号、行距、夜间模式先留接口
- 进度记忆：漫画记到第几话第几页，小说记到第几章第几字，存在本地

## v0.1 故意没做的（第二、三步再做）

- 不接任何在线漫画源、不接任何在线小说书源
- 不做登录、不做搜索、不做下载、不做同步
- 不放任何真实漫画、小说内容，示例全是占位文字和占位图

## 目录

- `App.tsx`：导航入口，书架 / 详情 / 漫画阅读 / 小说阅读
- `src/types.ts`：统一书模型 Book、章节 Chapter、进度 Progress
- `src/data/sample.ts`：示例书，跑通流程用
- `src/store/books.ts`：书架状态 + 进度更新（先用内存 + 示例，之后换成 expo-sqlite）
- `src/screens/LibraryScreen.tsx`：统一书架列表
- `src/screens/DetailScreen.tsx`：详情 + 章节/话数列表
- `src/screens/ComicReaderScreen.tsx`：漫画图片翻页占位
- `src/screens/NovelReaderScreen.tsx`：小说文字阅读占位

## 2026-11-02 当天搞定进度（实测结果，不是计划）

已在工作机上跑通、可用证据说话的部分：
- 依赖已装好（npm install，892 个包；工作机上要用 `--no-bin-links --ignore-scripts` 才装得上，Windows 上正常装就行）
- TypeScript 检查干净（`tsc --noEmit` 0 报错；修过一个 ComicReader 里 book 可能为空的报错）
- Expo prebuild 已生成 android 原生工程（包名 com.muse.pikanovel，SDK 35 平台 + build-tools 35 已备好）
- Metro 打包成功：Android Hermes 包 1.8 MB，说明 App 代码本身能编成包，不是代码问题
- 版本坑已修：react-native-screens 必须钉在 4.4.0（Expo SDK 52 配套版），浮到最新版会报 codegen 错

还没搞定的部分（卡点讲清，不含糊）：
- **APK 没在这台工作机上打出来。** 原因不是代码，是工作机网络：Gradle 要从 Maven Central / Gradle 插件中心拉 AGP、Kotlin 等依赖，
  走工作机的出口代理时 Java 那路会连接重置 / 读超时（curl 同样地址能通，Java 不行；已试过强制 IPv4 修好 Gradle 守护进程通信、
  把出口代理的 CA 导进 JDK 信任库，dl.google.com 已通，但 Maven Central / plugins.gradle.org 仍不通）。
- 所以最后一步不在工作机上硬磨，改在你的 Windows 笔记本上做，那里没有这层代理，Gradle 正常拉包就能出包。
- 2026-11-02 09:10 再试一轮仍没打出：给 Gradle 配了代理后，Java 到 repo.maven.apache.org / dl.google.com / plugins.gradle.org 一律连接重置；查到 JDK 里旧的出口代理证书指纹与现用证书对不上，已换成现用证书并试过强制 TLSv1.2，仍是连接重置（curl 同地址能通，Java 不行）。结论不变：这台工作机不适合打 APK，别再重复试 Gradle。

## 在 Windows 笔记本上跑起来（最后一步，按这个走）

1. 装 Node.js LTS、Android Studio（含 Android SDK、模拟器，SDK 35）
2. 把本目录拷过去，跑 `npm install`，再跑 `npx expo start`，手机装 Expo Go 扫码就能先玩 v0.1，不用等 APK
3. 要 APK 就跑 `npx expo run:android`（或在 Android Studio 里点 Run），第一次会拉 Gradle 依赖，耐心等它下完
4. 先确认骨架能跑、书架能点进阅读器、进度能记住，再进第二步：接一个漫画源
5. 第三步再接一个小说书源，书源层单独放 `src/sources/`，不要和阅读器混在一起

## 下一步清单

- [ ] v0.1：本地书架 + 双阅读器跑通（本骨架）
- [ ] v0.2：接一个漫画源（接口层单独成文件，参考 haka_comic 的 network 思路）
- [ ] v0.3：接一个小说书源（插件式，参考 LNReader 的 plugins 思路）
- [ ] v0.4：搜索、分类、下载、同步，再议
