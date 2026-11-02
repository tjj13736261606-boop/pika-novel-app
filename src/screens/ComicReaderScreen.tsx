import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Book } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ComicReader'> & {
  books: Book[];
  updateProgress: (bookId: string, chapterIndex: number, pageIndex: number) => void;
};

export default function ComicReaderScreen({ route, books, updateProgress }: Props) {
  const book = books.find((b) => b.id === route.params.bookId);
  const chapter = book?.chapters[route.params.chapterIndex];
  const pages = chapter?.pages ?? [];
  const [page, setPage] = useState(0);

  if (!book || !chapter) {
    return (
      <View style={{ padding: 16 }}>
        <Text>找不到这一话。</Text>
      </View>
    );
  }

  function go(next: number) {
    if (!book) return;
    if (next < 0 || next >= pages.length) return;
    setPage(next);
    updateProgress(book.id, route.params.chapterIndex, next);
  }

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>{chapter.title}</Text>
      <Text style={{ fontSize: 16, marginBottom: 24 }}>
        {pages[page] ?? '无图'}（第 {page + 1} / {pages.length} 页）
      </Text>
      <Text style={{ color: '#666', marginBottom: 24 }}>
        占位：之后把这里换成 Image 组件，图源换成本地图包或漫画源返回的图片地址。
      </Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button title="上一页" onPress={() => go(page - 1)} />
        <Button title="下一页" onPress={() => go(page + 1)} />
      </View>
    </View>
  );
}
