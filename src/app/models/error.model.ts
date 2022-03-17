export interface ErrorFromSpotifyModel {
  name: string;
  status: number;
  error: ErrorModel;
}

export interface ErrorMessageModel {
  message: string;
}

export interface ErrorModel {
  error: ErrorMessageModel;
}
