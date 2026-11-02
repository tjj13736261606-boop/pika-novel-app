import React, { useCallback, useEffect, useState } from 'react';
import { Button, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { MangaDexSource } from '../sources/manga';
import { SampleNovelSource } from '../sources/novel';
import { PicsumGallerySource, SampleGallerySource } from '../sources/gallery';

type Props = NativeStackScreenProps<RootStackParamList, 'Browse'>;

interface Row {
  id: string;
  title: string;
  subtitle: string;
  cover?: string;
}

// 一个源的列表页：漫画 / 小说支持搜关键词，漫画和画廊支持翻页加载更多，
// 列表带封面图（有封面地址的才显示，没有的只显示文字，示例源就是后者）。
// 点进去再按种类进详情，详情和阅读器都不用为搜索、分页改代码。
export default function BrowseScreen({ navigation, route }: Props) {
  const { kind, sourceId } = route.params;
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Row[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (targetPage: number, kw: string, append: boolean) => {
      setLoading(true);
      setError(null);
      try {
        if (kind === 'manga') {
          const list = await MangaDexSource.searchManga(kw, targetPage);
          const mapped = list.map((m) => ({ id: m.id, title: m.title, subtitle: m.author ?? '', cover: m.cover }));
          setRows((prev) => (append ? [...prev, ...mapped] : mapped));
          setHasMore(list.length === 20);
        } else if (kind === 'novel') {
          const list = kw.trim()
            ? await SampleNovelSource.searchNovels(kw)
            : await SampleNovelSource.popularNovels();
          setRows(list.map((n) => ({ id: n.id, title: n.title, subtitle: n.author ?? '' })));
          setHasMore(false);
        } else {
          const source = sourceId === 'picsum' ? PicsumGallerySource : SampleGallerySource;
          const list = await source.listGalleries({ page: targetPage });
          const mapped = list.galleries.map((g) => ({ id: g.id, title: g.title, subtitle: `${g.pageCount} 页`, cover: g.thumb }));
          setRows((prev) => (append ? [...prev, ...mapped] : mapped));
          setHasMore(list.hasNextPage);
        }
        setPage(targetPage);
      } catch (e) {
        setError(e instanceof Error ? e.message : '加载失败');
      } finally {
        setLoading(false);
      }
    },
    [kind, sourceId],
  );

  useEffect(() => {
    load(1, '', false);
  }, [load]);

  function onSearch() {
    load(1, keyword, false);
  }

  function onLoadMore() {
    if (!hasMore || loading) return;
    load(page + 1, keyword, true);
  }

  function openDetail(id: string) {
    if (kind === 'manga') {
      navigation.navigate('MangaDetail', { mangaId: id });
    } else if (kind === 'novel') {
      navigation.navigate('NovelDetail', { novelId: id });
    } else {
      navigation.navigate('GalleryDetail', { galleryId: id, sourceId });
    }
  }

  return (
    <ScrollView>
      {kind !== 'gallery' && (
        <View style={{ padding: 16, flexDirection: 'row', gap: 8 }}>
          <TextInput
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={onSearch}
            placeholder={kind === 'manga' ? '搜漫画标题，如 one piece' : '搜小说标题'}
            style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8 }}
          />
          <Button title="搜索" onPress={onSearch} />
        </View>
      )}
      {error && (
        <View style={{ padding: 16 }}>
          <Text>{error}</Text>
        </View>
      )}
      {rows.map((r) => (
        <Pressable
          key={r.id}
          onPress={() => openDetail(r.id)}
          style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd', flexDirection: 'row', gap: 12 }}
        >
          {r.cover && r.cover.startsWith('http') ? (
            <Image source={{ uri: r.cover }} style={{ width: 60, height: 80, resizeMode: 'cover' }} />
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18 }}>{r.title}</Text>
            <Text style={{ color: '#666' }}>{r.subtitle}</Text>
          </View>
        </Pressable>
      ))}
      {rows.length === 0 && !error && (
        <View style={{ padding: 16 }}>
          <Text>列表加载中…（需要联网的源请确认网络）</Text>
        </View>
      )}
      {hasMore && (
        <View style={{ padding: 16 }}>
          <Button title={loading ? '加载中…' : '加载更多'} onPress={onLoadMore} disabled={loading} />
        </View>
      )}
    </ScrollView>
  );
}
