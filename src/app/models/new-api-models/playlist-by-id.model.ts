import {
  CommonInfoAboutArtist,
  Followers,
  ImagesFromSpoty
} from "./album-by-id.model";
import { ItemsTrackModel } from "./top-tracks-artist-by-id.model";

export interface PlaylistByIdModel extends CommonInfoAboutArtist {
  followers: Followers[];
  images: ImagesFromSpoty[];
  public: boolean;
  tracks: ItemsTrackModel;
}
