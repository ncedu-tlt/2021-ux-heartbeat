import { ImagesFromSpoty } from "./album-by-id.model";

export interface CurrentUsersPlaylistModel {
  items: ItemUserPlaylistModel[];
}

export interface ItemUserPlaylistModel {
  description: string;
  id: string;
  images: ImagesFromSpoty[];
  name: string;
  public: boolean;
}
