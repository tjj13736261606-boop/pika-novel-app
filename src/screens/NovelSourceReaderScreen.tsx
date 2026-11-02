import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { SampleNovelSource } from '../sources/novel';

type Props = NativeStackScreenProps<RootStackParamList, 'NovelSourceReader'>;

export default function NovelSourceReaderScreen({ route }: Props) {
  const [text, setText] = useState('加载中…');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    SampleNovelSource.getChapterText(route.params.novelId, route.params.chapterId)
      .then(setText)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : '加载失败'));
  }, [route.params.novelId, route.params.chapterId]);

  if (error) {
    return (
      <View style={{ padding: 16 }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>{route.params.title}</Text>
      <Text style={{ fontSize: 17, lineHeight: 28 }}>{text}</Text>
    </ScrollView>
  );
}
