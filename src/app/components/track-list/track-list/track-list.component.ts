import { Component } from "@angular/core";
import { ItemsTrackModel } from "../../../models/new-api-models/top-tracks-artist-by-id.model";
import { PlayerService } from "../../../services/player.service";

@Component({
  selector: "hb-track-list",
  templateUrl: "./track-list.component.html",
  styleUrls: ["./track-list.component.less"]
})
export class TrackListComponent {
  trackList: ItemsTrackModel = {
    items: [
      {
        track: {
          id: "7uQ7e7nzbtyX87eIYHpj6Z",
          name: "De Diepte",
          preview_url:
            "https://p.scdn.co/mp3-preview/1da2f7a06427f83820ef811485ded6423ac13b8a?cid=774b29d4f13844c495f206cafdad9c86",
          track_number: 1,
          album: {
            id: "6XAKVt3CT7r1Zf0uiMWt7o",
            artists: [],
            images: [
              {
                url: "https://i.scdn.co/image/ab67616d0000b273518255a11ce96cc8de864f39"
              }
            ],
            name: "De Diepte",
            release_date: "2022-03-03",
            total_tracks: 1
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
          id: "1HhNoOuqm1a5MXYEgAFl8o",
          name: "Enemy",
          preview_url:
            "https://p.scdn.co/mp3-preview/bd0eaa32cd545406bc958e1a220fc36551e72cb0?cid=774b29d4f13844c495f206cafdad9c86",
          track_number: 1,
          album: {
            id: "4fZIyJn2wKb51QPNnWYnqt",
            artists: [],
            images: [
              {
                url: "https://i.scdn.co/image/ab67616d0000b273d9b35d1c4d15c9de88b754a7"
              }
            ],
            name: "De Diepte",
            release_date: "2022-03-03",
            total_tracks: 1
          },
          artists: [
            {
              id: "53XhwfbYqKCa1cC15pYq2q",
              name: "Imagine Dragons"
            }
          ]
        }
      },
      {
        track: {
          id: "1zB4vmk8tFRmM9UULNzbLBrrY",
          name: "Thunder",
          preview_url:
            "https://p.scdn.co/mp3-preview/bd0eaa32cd545406bc958e1a220fc36551e72cb0?cid=774b29d4f13844c495f206cafdad9c86",
          track_number: 1,
          album: {
            id: "4fZIyJn2wKb51QPNnWYnqt",
            artists: [],
            images: [
              {
                url: "https://i.scdn.co/image/ab67616d0000b2735675e83f707f1d7271e5cf8a"
              }
            ],
            name: "Thunder",
            release_date: "2022-03-03",
            total_tracks: 1
          },
          artists: [
            {
              id: "1zT9SWCzN45r7oVhy0VYLK",
              name: "Imagine Dragons"
            }
          ]
        }
      }
    ]
  };

  constructor(private playerService: PlayerService) {}

  setListTrackIntoPlayer() {
    this.playerService.trackList$.next(this.trackList);
  }
  //   [
  //   {
  //     artistName: "Imagine Dragons",
  //     artistId: "53XhwfbYqKCa1cC15pYq2q",
  //     trackId: "1HhNoOuqm1a5MXYEgAFl8o",
  //     trackName: "Enemy",
  //     trackUrl:
  //       "https://p.scdn.co/mp3-preview/bd0eaa32cd545406bc958e1a220fc36551e72cb0?cid=774b29d4f13844c495f206cafdad9c86",
  //     albumId: "4fZIyJn2wKb51QPNnWYnqt",
  //     albumImg:
  //       "https://i.scdn.co/image/ab67616d0000b273d9b35d1c4d15c9de88b754a7"
  //   },
  //   {
  //     artistName: "Imagine Dragons",
  //     artistId: "53XhwfbYqKCa1cC15pYq2q",
  //     trackName: "Thunder",
  //     trackId: "1zB4vmk8tFRmM9UULNzbLBrrY",
  //     trackUrl:
  //       "https://p.scdn.co/mp3-preview/07e14c4e821174295fe50f03b33d98387570d1db?cid=774b29d4f13844c495f206cafdad9c86",
  //     albumId: "33pt9HBdGlAbRGBHQgsZsU",
  //     albumImg:
  //       "https://i.scdn.co/image/ab67616d0000b2735675e83f707f1d7271e5cf8a"
  //   },
  //   {
  //     artistName: "Linkin Park",
  //     artistId: "6XyY86QOPPrYVGvF9ch6wz",
  //     trackName: "In the end",
  //     trackId: "1zB4vmk8tFRmM9UULNzbLB",
  //     trackUrl:
  //       "https://p.scdn.co/mp3-preview/6ce8bcf317e8c562f348ea22c846846b5b70e8d9?cid=774b29d4f13844c495f206cafdad9c86",
  //     albumId: "6hPkbAV3ZXpGZBGUvL6jVM",
  //     albumImg:
  //       "https://i.scdn.co/image/ab67616d0000b273e2f039481babe23658fc719a"
  //   },
  //   {
  //     artistName: "Linkin Park",
  //     artistId: "6XyY86QOPPrYVGvF9ch6wz",
  //     trackName: "Numb",
  //     trackId: "2nLtzopw4rPReszdYBJU6h",
  //     trackUrl:
  //       "https://p.scdn.co/mp3-preview/e6ccf7717f8a167bfea4afc1bf7da1a0cd707fbb?cid=774b29d4f13844c495f206cafdad9c86",
  //     albumId: "4Gfnly5CzMJQqkUFfoHaP3",
  //     albumImg:
  //       "https://i.scdn.co/image/ab67616d0000b273b4ad7ebaf4575f120eb3f193"
  //   },
  //   {
  //     artistName: "The Weeknd",
  //     artistId: "1Xyo4u8uXC1ZmMpatF05PJ",
  //     trackName: "Sacrifise",
  //     trackUrl:
  //       "https://p.scdn.co/mp3-preview/4892940fb0fed9666392fad90945837fe769994f?cid=774b29d4f13844c495f206cafdad9c86",
  //     trackId: "1nH2PkJL1XoUq8oE6tBZoU",
  //     albumImg:
  //       "https://i.scdn.co/image/ab67616d0000b2734ab2520c2c77a1d66b9ee21d",
  //     albumId: "2nLOHgzXzwFEpl62zAgCEC"
  //   }
  // ];
}
