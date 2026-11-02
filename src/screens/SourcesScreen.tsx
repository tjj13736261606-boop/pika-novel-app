import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { SOURCES } from '../sources';

type Props = NativeStackScreenProps<RootStackParamList, 'Sources'>;

// 源总览：合集版目前接好的全部源，一处看全，点进去就是该源的列表。
export default function SourcesScreen({ navigation }: Props) {
  return (
    <ScrollView>
      {SOURCES.map((s) => (
        <Pressable
          key={s.id}
          onPress={() => navigation.navigate('Browse', { kind: s.kind, sourceId: s.id })}
          style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd' }}
        >
          <Text style={{ fontSize: 18 }}>
            {s.kind === 'manga' ? '漫画 · ' : s.kind === 'novel' ? '小说 · ' : '画廊 · '}
            {s.name}
          </Text>
          <Text style={{ color: '#666' }}>{s.description}</Text>
        </Pressable>
      ))}
      <View style={{ padding: 16 }}>
        <Text style={{ color: '#666' }}>
          不在表里的：哔咔私有接口（要官方 App 内嵌私有密钥，不抄）、E-Hentai 登录 / 镜像 / 绕限制（不接）。
        </Text>
      </View>
    </ScrollView>
  );
}
