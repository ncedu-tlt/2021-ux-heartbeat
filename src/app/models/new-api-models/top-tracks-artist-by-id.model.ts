import {
  CommonInfoAboutArtist,
  CommonTrackInfo,
  ImagesFromSpoty
} from "./album-by-id.model";

export interface PlaylistTracksModel {
  tracks: UserSavedTracksModel;
}

export interface UserSavedTracksModel {
  items: TopTracksArtistByIdModel[];
}

export interface ItemsTrackModel {
  items: PlaylistTrackModel[];
}

export interface TopTracksArtistByIdModel {
  tracks: TopTracksModel[];
}

export interface PlaylistTrackModel {
  track: TopTracksModel;
}

export interface NewUserTopTracksModel {
  items: TopTracksModel[];
}

export interface NewUserTopTracksItemsModel {
  items: NewUserTopTrackItemsModel[];
}

export interface NewUserTopTrackItemsModel {
  track: TopTracksModel;
}

export interface TopTracksModel extends CommonTrackInfo {
  album: AlbumTopTracksModel;
  artists: CommonInfoAboutArtist[];
}

export interface AlbumTopTracksModel {
  artists: CommonInfoAboutArtist[];
  id: string;
  images: ImagesFromSpoty[];
  name: string;
  release_date: string;
  total_tracks: number;
}

export interface NewTopArtistTracks {
  items: NewTopArtistItems[];
}

export interface NewTopArtistItems {
  track: TopTracksModel;
}
