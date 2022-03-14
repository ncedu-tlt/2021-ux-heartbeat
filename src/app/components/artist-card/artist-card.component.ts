import { Component } from "@angular/core";
import { ArtistByIdModel } from "../../models/new-api-models/artist-by-id.model";
import { TopTracksArtistByIdModel } from "../../models/new-api-models/top-tracks-artist-by-id.model";

@Component({
  selector: "hb-artist-card",
  templateUrl: "./artist-card.component.html",
  styleUrls: ["./artist-card.component.less"]
})
export class ArtistCardComponent {
  public isCard = true;
  public artistInfo: ArtistByIdModel = {
    followers: {
      total: 2734564
    },
    genres: ["Rock", "Alternative Metal"],
    id: "6XyY86QOPPrYVGvF9ch6wz",
    name: "Linkin Park",
    images: [
      {
        url: "https://i.scdn.co/image/ab6761610000e5eb34e5aa6afc1ba147bfbb0677"
      }
    ]
  };

  public topTracks: TopTracksArtistByIdModel = {
    tracks: [
      {
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
      },
      {
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
      },
      {
        id: "1zB4vmk8tFRmM9UULNzbLBrrY",
        name: "Thunder",
        preview_url:
          "https://p.scdn.co/mp3-preview/07e14c4e821174295fe50f03b33d98387570d1db?cid=774b29d4f13844c495f206cafdad9c86",
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
      },
      {
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
    ]
  };
}
