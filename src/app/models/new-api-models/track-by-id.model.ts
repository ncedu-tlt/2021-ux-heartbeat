import {
  CommonInfoAboutArtist,
  CommonTrackInfo,
  ImagesFromSpoty
} from "./album-by-id.model";

export interface TracksByIds {
  tracks: TrackById[];
}

export interface TrackById extends CommonTrackInfo {
  album: AlbumItemsTrackModel;
  artists: CommonInfoAboutArtist[];
}

export interface AlbumItemsTrackModel {
  artists: CommonInfoAboutArtist[];
  images: ImagesFromSpoty[];
  id: string;
  name: string;
  release_date: string;
  total_tracks: number;
}
