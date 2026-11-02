import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Manga, MangaChapter, MangaDexSource } from '../sources/manga';

type Props = NativeStackScreenProps<RootStackParamList, 'MangaDetail'>;

export default function MangaDetailScreen({ navigation, route }: Props) {
  const [detail, setDetail] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<MangaChapter[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setDetail(await MangaDexSource.getMangaDetail(route.params.mangaId));
        setChapters(await MangaDexSource.getChapters(route.params.mangaId));
      } catch (e) {
        setError(e instanceof Error ? e.message : '加载失败');
      }
    })();
  }, [route.params.mangaId]);

  if (error) {
    return (
      <View style={{ padding: 16 }}>
        <Text>{error}</Text>
      </View>
    );
  }
  if (!detail) {
    return (
      <View style={{ padding: 16 }}>
        <Text>漫画详情加载中…</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        {detail.cover && detail.cover.startsWith('http') ? (
          <Image source={{ uri: detail.cover }} style={{ width: 120, height: 160, resizeMode: 'cover', marginBottom: 12 }} />
        ) : null}
        <Text style={{ fontSize: 22 }}>{detail.title}</Text>
        <Text style={{ color: '#666' }}>
          {detail.author ?? ''} · {detail.status ?? ''}
        </Text>
        {detail.description ? <Text style={{ marginTop: 8 }}>{detail.description}</Text> : null}
      </View>
      {chapters.map((c) => (
        <Pressable
          key={c.id}
          onPress={() => navigation.navigate('MangaReader', { chapterId: c.id, title: c.title })}
          style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#eee' }}
        >
          <Text>{c.title}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
