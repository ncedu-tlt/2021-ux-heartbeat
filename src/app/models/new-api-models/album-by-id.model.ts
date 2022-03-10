import { GenresModel } from "./genres.model";

export interface AlbumsByIdsModel {
  albums: AlbumByIdModel[];
}

export interface ItemsAlbumModel {
  items: [
    {
      album: {
        artists: CommonInfoAboutArtist[];
        genres: GenresModel;
        id: string;
        images: ImagesFromSpoty[];
        name: string;
        release_date: string;
        tracks: {
          items: ItemsTracksModel[];
        };
      };
    }
  ];
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
  genres: GenresModel;
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
