import React, { useEffect, useState } from 'react';
import { Button, Image, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { PicsumGallerySource, SampleGallerySource } from '../sources/gallery';

type Props = NativeStackScreenProps<RootStackParamList, 'GalleryReader'>;

// 画廊阅读器：和漫画阅读器同一套图片翻页逻辑，一页一张图，
// 只是图源来自 GallerySource.getPageImage，而不是漫画的话数图片列表。
// 真实图片地址（http 开头）用 Image 渲染，占位图仍显示文字。
export default function GalleryReaderScreen({ route }: Props) {
  const { galleryId } = route.params;
  const source = route.params.sourceId === 'picsum' ? PicsumGallerySource : SampleGallerySource;
  const [page, setPage] = useState(route.params.pageIndex);
  const [pageCount, setPageCount] = useState(0);
  const [imageUrl, setImageUrl] = useState('加载中…');

  useEffect(() => {
    source
      .getGalleryDetail(galleryId)
      .then((d) => setPageCount(d.pageCount))
      .catch(() => setPageCount(0));
  }, [galleryId, source]);

  useEffect(() => {
    setImageUrl('加载中…');
    source
      .getPageImage(galleryId, page)
      .then(setImageUrl)
      .catch(() => setImageUrl('加载失败'));
  }, [galleryId, page, source]);

  function go(next: number) {
    if (next < 0 || next >= pageCount) return;
    setPage(next);
  }

  const isRealImage = imageUrl.startsWith('http');

  return (
    <View style={{ flex: 1, padding: 16, alignItems: 'center' }}>
      {isRealImage ? (
        <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '75%', resizeMode: 'contain' }} />
      ) : (
        <Text style={{ fontSize: 16, marginBottom: 24 }}>{imageUrl}</Text>
      )}
      <Text style={{ color: '#666', marginVertical: 12 }}>
        第 {page + 1} / {pageCount} 页
      </Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button title="上一页" onPress={() => go(page - 1)} />
        <Button title="下一页" onPress={() => go(page + 1)} />
      </View>
    </View>
  );
}
