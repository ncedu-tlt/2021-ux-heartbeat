import { Injectable } from "@angular/core";
import {
  ImagesFromSpoty,
  AlbumTracksModel,
  TracksModel
} from "../models/new-api-models/album-by-id.model";
import {
  NewTopArtistTracks,
  NewUserTopTracksItemsModel,
  NewUserTopTracksModel,
  TopTracksModel
} from "../models/new-api-models/top-tracks-artist-by-id.model";
import { TrackById } from "../models/new-api-models/track-by-id.model";
import { NewSearchModel } from "../models/new-api-models/search.model";

@Injectable({
  providedIn: "root"
})
export class ConverterService {
  convertAlbumModelsToNewTracksModels(
    albumTrackList: TracksModel,
    id: string,
    images: ImagesFromSpoty[]
  ): AlbumTracksModel {
    const result: AlbumTracksModel = {
      items: []
    };
    albumTrackList.items.forEach(track => {
      result.items.push({
        track: {
          ...track,
          album: {
            id,
            images
          }
        }
      });
    });

    return result;
  }

  convertTopUserTracksToNewTopUserTracks(userTopTracks: NewUserTopTracksModel) {
    const result: NewUserTopTracksItemsModel = {
      items: []
    };
    userTopTracks.items.forEach(track => {
      result.items.push({
        track: {
          ...track
        }
      });
    });
    return result;
  }

  convertTopArtistTracksToNewTopArtistTracks(
    artistTopTracks: TopTracksModel[]
  ) {
    const result: NewTopArtistTracks = {
      items: []
    };
    artistTopTracks.forEach(track => {
      result.items.push({
        track: {
          ...track
        }
      });
    });
    return result;
  }

  convertTrackSearchModelToNewSearchModel(searchTrack: TrackById[]) {
    const result: NewSearchModel = {
      items: []
    };
    searchTrack.forEach(track => {
      result.items.push({
        track: {
          ...track
        }
      });
    });
    return result;
  }
}
