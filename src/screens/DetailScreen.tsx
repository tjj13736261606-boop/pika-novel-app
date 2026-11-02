import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Book } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'> & {
  books: Book[];
};

export default function DetailScreen({ navigation, route, books }: Props) {
  const book = books.find((b) => b.id === route.params.bookId);
  if (!book) {
    return (
      <View style={{ padding: 16 }}>
        <Text>找不到这本书。</Text>
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 22 }}>{book.title}</Text>
        <Text style={{ color: '#666' }}>
          {book.type === 'comic' ? '漫画' : '小说'} · {book.author}
        </Text>
      </View>
      <FlatList
        data={book.chapters}
        keyExtractor={(c) => c.id}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() =>
              navigation.navigate(
                book.type === 'comic' ? 'ComicReader' : 'NovelReader',
                { bookId: book.id, chapterIndex: index },
              )
            }
            style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#eee' }}
          >
            <Text>{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
