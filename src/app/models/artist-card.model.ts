import { PlayerTrackInfoModel } from "./player-track-info.model";

export interface ArtistCardModel {
  artistId: string;
  artistName: string;
  artistImg: string;
  followers: number;
  genres: string[];
  topTracks?: PlayerTrackInfoModel[];
}
