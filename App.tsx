import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LibraryScreen from './src/screens/LibraryScreen';
import DetailScreen from './src/screens/DetailScreen';
import ComicReaderScreen from './src/screens/ComicReaderScreen';
import NovelReaderScreen from './src/screens/NovelReaderScreen';
import GalleryDetailScreen from './src/screens/GalleryDetailScreen';
import GalleryReaderScreen from './src/screens/GalleryReaderScreen';
import SourcesScreen from './src/screens/SourcesScreen';
import BrowseScreen from './src/screens/BrowseScreen';
import MangaDetailScreen from './src/screens/MangaDetailScreen';
import MangaReaderScreen from './src/screens/MangaReaderScreen';
import NovelDetailScreen from './src/screens/NovelDetailScreen';
import NovelSourceReaderScreen from './src/screens/NovelSourceReaderScreen';
import { useBooks } from './src/store/books';
import { SourceKind } from './src/sources';

export type RootStackParamList = {
  Library: undefined;
  Detail: { bookId: string };
  ComicReader: { bookId: string; chapterIndex: number };
  NovelReader: { bookId: string; chapterIndex: number };
  GalleryDetail: { galleryId: string; sourceId: string };
  GalleryReader: { galleryId: string; pageIndex: number; sourceId: string };
  Sources: undefined;
  Browse: { kind: SourceKind; sourceId: string };
  MangaDetail: { mangaId: string };
  MangaReader: { chapterId: string; title: string };
  NovelDetail: { novelId: string };
  NovelSourceReader: { novelId: string; chapterId: string; title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const store = useBooks();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Library" options={{ title: '书架' }}>
          {(props) => <LibraryScreen {...props} books={store.books} />}
        </Stack.Screen>
        <Stack.Screen name="Detail" options={{ title: '详情' }}>
          {(props) => (
            <DetailScreen {...props} books={store.books} />
          )}
        </Stack.Screen>
        <Stack.Screen name="ComicReader" options={{ title: '漫画阅读' }}>
          {(props) => (
            <ComicReaderScreen
              {...props}
              books={store.books}
              updateProgress={store.updateProgress}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="NovelReader" options={{ title: '小说阅读' }}>
          {(props) => (
            <NovelReaderScreen
              {...props}
              books={store.books}
              updateProgress={store.updateProgress}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="GalleryDetail" component={GalleryDetailScreen} options={{ title: '图集详情' }} />
        <Stack.Screen name="GalleryReader" component={GalleryReaderScreen} options={{ title: '图集阅读' }} />
        <Stack.Screen name="Sources" component={SourcesScreen} options={{ title: '全部源' }} />
        <Stack.Screen name="Browse" component={BrowseScreen} options={{ title: '源列表' }} />
        <Stack.Screen name="MangaDetail" component={MangaDetailScreen} options={{ title: '漫画详情' }} />
        <Stack.Screen name="MangaReader" component={MangaReaderScreen} options={{ title: '漫画阅读' }} />
        <Stack.Screen name="NovelDetail" component={NovelDetailScreen} options={{ title: '小说详情' }} />
        <Stack.Screen name="NovelSourceReader" component={NovelSourceReaderScreen} options={{ title: '小说阅读' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
