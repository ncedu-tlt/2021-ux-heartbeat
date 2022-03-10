import {
  CommonInfoAboutArtist,
  Followers,
  ImagesFromSpoty
} from "./album-by-id.model";
import { GenresModel } from "./genres.model";

export interface ArtistsByIdsModel {
  artists: ArtistByIdModel[];
}

export interface ArtistByIdModel extends CommonInfoAboutArtist {
  followers: Followers;
  genres: GenresModel;
  images: ImagesFromSpoty[];
}

export interface ArtistsModel {
  items: ItemsArtistModel[];
}

export interface ItemsArtistModel extends CommonInfoAboutArtist {
  artists: CommonInfoAboutArtist[];
  images: ImagesFromSpoty[];
  release_date: string;
  total_tracks: string;
}
