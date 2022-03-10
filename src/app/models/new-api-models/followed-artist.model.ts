import { ArtistByIdModel } from "./artist-by-id.model";

export interface FollowedArtistModel {
  artists: FollowedArtistItemModel;
}

export interface FollowedArtistItemModel {
  items: ArtistByIdModel[];
}
