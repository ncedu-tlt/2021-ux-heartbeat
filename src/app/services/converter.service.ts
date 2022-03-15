import { Injectable } from "@angular/core";
import {
  ImagesFromSpoty,
  NewTracksModel,
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
  ): NewTracksModel {
    const result: NewTracksModel = JSON.parse(
      JSON.stringify(albumTrackList)
    ) as NewTracksModel;
    result.items.forEach(track => {
      track.album = {
        id,
        images
      };
    });

    return result;
  }
}
