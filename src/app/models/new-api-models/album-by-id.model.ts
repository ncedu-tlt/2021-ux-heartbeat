export interface AlbumsByIdsModel {
  albums: AlbumByIdModel[];
}

export interface ItemsAlbumModel {
  items: AlbumItemModel[];
}

export interface AlbumItemModel {
  album: AlbumModel;
}

export interface AlbumModel {
  artists: CommonInfoAboutArtist[];
  genres: string[];
  id: string;
  images: ImagesFromSpoty[];
  name: string;
  release_date: string;
  tracks: {
    items: ItemsTracksModel[];
  };
}

export interface ItemsTracksModel {
  artists: CommonInfoAboutArtist[];
  id: string;
  name: string;
  preview_url: string;
}

export interface NewAlbumsReleasesModel {
  albums: {
    items: ItemsAlbumsModel[];
  };
}

export interface ItemsAlbumsModel {
  artists: CommonInfoAboutArtist[];
  id: string;
  images: ImagesFromSpoty[];
  name: string;
  release_date: string;
}

export interface AlbumByIdModel {
  artists: CommonInfoAboutArtist[];
  genres: string[];
  id: string;
  images: ImagesFromSpoty[];
  name: string;
  release_date: string;
  total_tracks: number;
  tracks: TracksModel;
}

export interface TracksModel {
  items: ItemsModel[];
}

export interface AlbumTracksModel {
  items: NewAlbumItemsModel[];
}

export interface NewAlbumItemsModel {
  track: NewAlbumTracksModel;
}

export interface NewAlbumTracksModel extends ItemsModel {
  album?: Album;
}

export interface Album {
  id: string;
  images: ImagesFromSpoty[];
}

export interface ItemsModel extends CommonTrackInfo {
  artists: CommonInfoAboutArtist[];
}

export interface AlbumItemsModel extends CommonTrackInfo {
  album: CommonInfoAboutArtist[];
}

export interface CommonInfoAboutArtist {
  id: string;
  name: string;
}

export interface CommonTrackInfo {
  id: string;
  name: string;
  preview_url: string;
  track_number: number;
}

export interface ImagesFromSpoty {
  url: string;
}

export interface Followers {
  total: number;
}
