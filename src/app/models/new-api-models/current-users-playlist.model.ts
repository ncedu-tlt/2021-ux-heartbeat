import { ImagesFromSpoty } from "./album-by-id.model";

export interface CurrentUsersPlaylistModel {
  items: ItemUserPlaylistModel[];
}

export interface ItemUserPlaylistModel {
  description: string;
  id: string;
  images: ImagesFromSpoty[];
  name: string;
  owner: PlaylistOwner;
  public: boolean;
}

export interface PlaylistOwner {
  display_name: string;
  id: string;
}
