import { ArtistByIdModel } from "./artist-by-id.model";
import { TrackById } from "./track-by-id.model";

export interface SearchModel {
  artists: ArtistSearchModel;
  tracks: TracksSearchModel;
}

export interface ArtistSearchModel {
  items: ArtistByIdModel[];
}

export interface TracksSearchModel {
  items: TrackById[];
}

export interface NewSearchModel {
  items: NewSearchItems[];
}

export interface NewSearchItems {
  track: TrackById;
}
