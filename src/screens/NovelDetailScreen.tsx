import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { NovelDetail, SampleNovelSource } from '../sources/novel';

type Props = NativeStackScreenProps<RootStackParamList, 'NovelDetail'>;

export default function NovelDetailScreen({ navigation, route }: Props) {
  const [detail, setDetail] = useState<NovelDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    SampleNovelSource.getNovelDetail(route.params.novelId)
      .then(setDetail)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : '加载失败'));
  }, [route.params.novelId]);

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
        <Text>小说详情加载中…</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 22 }}>{detail.title}</Text>
        <Text style={{ color: '#666' }}>{detail.author ?? ''}</Text>
        {detail.description ? <Text style={{ marginTop: 8 }}>{detail.description}</Text> : null}
      </View>
      {detail.chapters.map((c) => (
        <Pressable
          key={c.id}
          onPress={() =>
            navigation.navigate('NovelSourceReader', {
              novelId: detail.id,
              chapterId: c.id,
              title: c.title,
            })
          }
          style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#eee' }}
        >
          <Text>{c.title}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
