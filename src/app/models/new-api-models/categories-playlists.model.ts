import { ItemUserPlaylistModel } from "./current-users-playlist.model";

export interface CategoriesPlaylistsModel {
  playlists: PlaylistItemsModel;
}

export interface PlaylistItemsModel {
  items: ItemUserPlaylistModel[];
}
