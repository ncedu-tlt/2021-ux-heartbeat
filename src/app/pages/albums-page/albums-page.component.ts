import { Component } from "@angular/core";
import { AlbumTracksModel } from "../../models/new-api-models/album-by-id.model";
@Component({
  selector: "hb-albums-page",
  templateUrl: "./albums-page.component.html",
  styleUrls: ["./albums-page.component.less"]
})
export class AlbumsPageComponent {
  public albumId = "1fdYYk890Ur";
  public album: AlbumTracksModel = {
    items: [
      {
        track: {
          id: "7uQ7e7nzbtyX87eIYHpj6Z",
          name: "De Diepte",
          track_number: 1,
          preview_url:
            "https://p.scdn.co/mp3-preview/1da2f7a06427f83820ef811485ded6423ac13b8a?cid=774b29d4f13844c495f206cafdad9c86",
          album: {
            id: "6XAKVt3CT7r1Zf0uiMWt7o",
            images: [
              {
                url: "https://i.scdn.co/image/ab67616d0000b273518255a11ce96cc8de864f39"
              }
            ]
          },
          artists: [
            {
              id: "1zT9SWCzN45r7oVhy0VYLK",
              name: "S10"
            }
          ]
        }
      },
      {
        track: {
          id: "1zB4vmk8tFRmM9UULNzbLB",
          name: "Thunder",
          preview_url:
            "https://p.scdn.co/mp3-preview/07e14c4e821174295fe50f03b33d98387570d1db?cid=774b29d4f13844c495f206cafdad9c86",
          track_number: 1,
          album: {
            id: "4fZIyJn2wKb51QPNnWYnqt",
            images: [
              {
                url: "https://i.scdn.co/image/ab67616d0000b2735675e83f707f1d7271e5cf8a"
              }
            ]
          },
          artists: [
            {
              id: "1zT9SWCzN45r7oVhy0VYLK",
              name: "Imagine Dragons"
            }
          ]
        }
      },
      {
        track: {
          id: "1HhNoOuqm1a5MXYEgAFl8o",
          name: "Enemy",
          preview_url:
            "https://p.scdn.co/mp3-preview/bd0eaa32cd545406bc958e1a220fc36551e72cb0?cid=774b29d4f13844c495f206cafdad9c86",
          track_number: 1,
          album: {
            id: "4fZIyJn2wKb51QPNnWYnqt",
            images: [
              {
                url: "https://i.scdn.co/image/ab67616d0000b273d9b35d1c4d15c9de88b754a7"
              }
            ]
          },
          artists: [
            {
              id: "53XhwfbYqKCa1cC15pYq2q",
              name: "Imagine Dragons"
            }
          ]
        }
      }
    ]
  };
}
