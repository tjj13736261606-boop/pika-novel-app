import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { GalleryDetail, PicsumGallerySource, SampleGallerySource } from '../sources/gallery';

type Props = NativeStackScreenProps<RootStackParamList, 'GalleryDetail'>;

export default function GalleryDetailScreen({ navigation, route }: Props) {
  const source = route.params.sourceId === 'picsum' ? PicsumGallerySource : SampleGallerySource;
  const [detail, setDetail] = useState<GalleryDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    source
      .getGalleryDetail(route.params.galleryId)
      .then(setDetail)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : '加载失败'));
  }, [route.params.galleryId, source]);

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
        <Text>图集详情加载中…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 22 }}>{detail.title}</Text>
        <Text style={{ color: '#666' }}>
          图集 · {detail.pageCount} 页 · 标签：{detail.tags.join('、')}
        </Text>
      </View>
      <FlatList
        data={detail.previews}
        keyExtractor={(p) => String(p.position)}
        numColumns={3}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate('GalleryReader', {
                galleryId: detail.id,
                pageIndex: item.position,
                sourceId: route.params.sourceId,
              })
            }
            style={{
              flex: 1,
              margin: 4,
              padding: 16,
              backgroundColor: '#eee',
              alignItems: 'center',
            }}
          >
            {item.imageUrl.startsWith('http') ? (
              <Image source={{ uri: item.imageUrl }} style={{ width: 80, height: 80, resizeMode: 'cover' }} />
            ) : (
              <Text>{item.imageUrl}</Text>
            )}
          </Pressable>
        )}
      />
    </View>
  );
}
