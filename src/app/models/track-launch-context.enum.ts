export enum TrackLaunchContextEnum {
  SEARCH_TRACKS = "search",
  ARTIST_TOP_TRACKS = "artist top tracks",
  USER_TOP_TRACKS = "user top tracks",
  USER_LAST_TRACKS = "user last tracks",
  SAVED_TRACKS = "favorite tracks",
  PLAYLIST = "playlist",
  ALBUM = "album"
}

export interface TrackLaunchContext {
  id: string | null;
  contextType: TrackLaunchContextEnum;
}
