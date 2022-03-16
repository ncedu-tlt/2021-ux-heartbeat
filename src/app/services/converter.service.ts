import { Injectable } from "@angular/core";
import {
  ImagesFromSpoty,
  AlbumTracksModel,
  TracksModel
} from "../models/new-api-models/album-by-id.model";

@Injectable({
  providedIn: "root"
})
export class ConverterService {
  convertAlbumModelsToNewTracksModels(
    albumTrackList: TracksModel,
    id: string,
    images: ImagesFromSpoty[]
  ): AlbumTracksModel {
    const result: AlbumTracksModel = JSON.parse(
      JSON.stringify(albumTrackList)
    ) as AlbumTracksModel;
    result.items.forEach(track => {
      track.album = {
        id,
        images
      };
    });

    return result;
  }
}
