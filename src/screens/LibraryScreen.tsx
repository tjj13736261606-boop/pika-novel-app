import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Book } from '../types';
import { Gallery, SampleGallerySource } from '../sources/gallery';

type Props = NativeStackScreenProps<RootStackParamList, 'Library'> & {
  books: Book[];
};

// 书架分两栏：书本（漫画 / 小说）+ 画廊（示例源）。
// 画廊先走自己的 Gallery 模型，不塞进 Book，列表量小，先用 ScrollView 直渲，之后量大了再换虚拟列表。
export default function LibraryScreen({ navigation, books }: Props) {
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  useEffect(() => {
    SampleGallerySource.listGalleries({})
      .then((r) => setGalleries(r.galleries))
      .catch(() => setGalleries([]));
  }, []);

  return (
    <ScrollView>
      <Pressable
        onPress={() => navigation.navigate('Sources')}
        style={{ padding: 16, backgroundColor: '#e8f0ff' }}
      >
        <Text style={{ fontSize: 18 }}>浏览全部源 →</Text>
        <Text style={{ color: '#666' }}>漫画、小说、画廊已接好的源都在这里</Text>
      </Pressable>
      <View style={{ padding: 16, paddingBottom: 4, backgroundColor: '#f5f5f5' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>书本</Text>
      </View>
      {books.map((b) => (
        <Pressable
          key={b.id}
          onPress={() => navigation.navigate('Detail', { bookId: b.id })}
          style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd' }}
        >
          <Text style={{ fontSize: 18 }}>
            {b.type === 'comic' ? '漫画 · ' : '小说 · '}
            {b.title}
          </Text>
          <Text style={{ color: '#666' }}>
            {b.author} · 已读到第 {b.progress.chapterIndex + 1} 章/话
          </Text>
        </Pressable>
      ))}
      <View style={{ padding: 16, paddingBottom: 4, backgroundColor: '#f5f5f5' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>画廊</Text>
      </View>
      {galleries.map((g) => (
        <Pressable
          key={g.id}
          onPress={() => navigation.navigate('GalleryDetail', { galleryId: g.id, sourceId: 'sample-gallery' })}
          style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd' }}
        >
          <Text style={{ fontSize: 18 }}>图集 · {g.title}</Text>
          <Text style={{ color: '#666' }}>
            {g.pageCount} 页 · {g.tags.join('、')}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
