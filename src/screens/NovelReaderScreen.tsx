import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Book } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'NovelReader'> & {
  books: Book[];
  updateProgress: (bookId: string, chapterIndex: number, pageIndex: number) => void;
};

export default function NovelReaderScreen({ route, books, updateProgress }: Props) {
  const book = books.find((b) => b.id === route.params.bookId);
  const chapter = book?.chapters[route.params.chapterIndex];

  useEffect(() => {
    if (book) {
      updateProgress(book.id, route.params.chapterIndex, 0);
    }
    // 只在打开本章时记一次进度，之后细化到滚动位置再改这里。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!book || !chapter) {
    return (
      <View style={{ padding: 16 }}>
        <Text>找不到这一章。</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>{chapter.title}</Text>
      <Text style={{ fontSize: 17, lineHeight: 28 }}>{chapter.text ?? ''}</Text>
    </ScrollView>
  );
}
