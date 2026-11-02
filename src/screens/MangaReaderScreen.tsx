import React, { useEffect, useState } from 'react';
import { Button, Image, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { MangaDexSource } from '../sources/manga';

type Props = NativeStackScreenProps<RootStackParamList, 'MangaReader'>;

// 漫画阅读器：按章节取图片地址，一页一张图，真实图片用 Image 渲染，
// 和画廊阅读器同一套翻页逻辑。
export default function MangaReaderScreen({ route }: Props) {
  const { chapterId } = route.params;
  const [pages, setPages] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    MangaDexSource.getChapterPages(chapterId)
      .then(setPages)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : '加载失败'));
  }, [chapterId]);

  if (error) {
    return (
      <View style={{ padding: 16 }}>
        <Text>{error}</Text>
      </View>
    );
  }
  if (pages.length === 0) {
    return (
      <View style={{ padding: 16 }}>
        <Text>章节图片加载中…</Text>
      </View>
    );
  }

  function go(next: number) {
    if (next < 0 || next >= pages.length) return;
    setPage(next);
  }

  return (
    <View style={{ flex: 1, padding: 16, alignItems: 'center' }}>
      <Text style={{ marginBottom: 12 }}>{route.params.title}</Text>
      <Image
        source={{ uri: pages[page] }}
        style={{ width: '100%', height: '75%', resizeMode: 'contain' }}
      />
      <Text style={{ color: '#666', marginVertical: 12 }}>
        第 {page + 1} / {pages.length} 页
      </Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button title="上一页" onPress={() => go(page - 1)} />
        <Button title="下一页" onPress={() => go(page + 1)} />
      </View>
    </View>
  );
}
