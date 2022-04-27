import {
  CommonInfoAboutArtist,
  Followers,
  ImagesFromSpoty
} from "./album-by-id.model";

export interface ArtistsByIdsModel {
  artists: ArtistByIdModel[];
}

export interface TopArtistsModel {
  items: ArtistByIdModel[];
}

export interface ArtistByIdModel extends CommonInfoAboutArtist {
  followers: Followers;
  genres: string[];
  images: ImagesFromSpoty[];
}

export interface ArtistsModel {
  items: ItemsArtistModel[];
  total: number;
}

export interface ItemsArtistModel extends CommonInfoAboutArtist {
  artists: CommonInfoAboutArtist[];
  images: ImagesFromSpoty[];
  album_group: string;
  release_date: string;
  available_markets: string[];
  total_tracks: string;
}
