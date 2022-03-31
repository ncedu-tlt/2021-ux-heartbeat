import {
  CommonInfoAboutArtist,
  Followers,
  ImagesFromSpoty
} from "./album-by-id.model";

export interface ArtistsByIdsModel {
  artists: ArtistByIdModel[];
}

export interface ArtistByIdModel extends CommonInfoAboutArtist {
  followers: Followers;
  genres: string[];
  images: ImagesFromSpoty[];
}

export interface ArtistsModel {
  items: ItemsArtistModel[];
}

export interface ItemsArtistModel extends CommonInfoAboutArtist {
  artists: CommonInfoAboutArtist[];
  images: ImagesFromSpoty[];
  album_group: string;
  release_date: string;
  total_tracks: string;
}
