import {
  CommonInfoAboutArtist,
  Followers,
  ImagesFromSpoty
} from "./album-by-id.model";
import { ItemsTrackModel } from "./top-tracks-artist-by-id.model";
import { PlaylistOwner } from "./current-users-playlist.model";

export interface PlaylistByIdModel extends CommonInfoAboutArtist {
  followers: Followers;
  images: ImagesFromSpoty[];
  public: boolean;
  tracks: ItemsTrackModel;
  description: string;
  owner: PlaylistOwner;
  id: string;
  name: string;
}
