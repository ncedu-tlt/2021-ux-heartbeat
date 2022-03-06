import { Component } from "@angular/core";
import { ArtistCardModel } from "../../models/artist-card.model";

@Component({
  selector: "hb-artist-card",
  templateUrl: "./artist-card.component.html",
  styleUrls: ["./artist-card.component.less"]
})
export class ArtistCardComponent {
  public isCard = true;
  public artistInfo: ArtistCardModel = {
    artistId: "6XyY86QOPPrYVGvF9ch6wz",
    artistName: "Linkin Park",
    artistImg:
      "https://i.scdn.co/image/ab6761610000e5eb34e5aa6afc1ba147bfbb0677",
    followers: 2670890,
    genres: ["Rock", "Alternative Metal"],
    topTracks: [
      {
        artistName: "Imagine Dragons",
        artistId: "53XhwfbYqKCa1cC15pYq2q",
        trackId: "1HhNoOuqm1a5MXYEgAFl8o",
        trackName: "Enemy",
        trackUrl:
          "https://p.scdn.co/mp3-preview/bd0eaa32cd545406bc958e1a220fc36551e72cb0?cid=774b29d4f13844c495f206cafdad9c86",
        albumId: "4fZIyJn2wKb51QPNnWYnqt",
        albumImg:
          "https://i.scdn.co/image/ab67616d0000b273d9b35d1c4d15c9de88b754a7"
      },
      {
        artistName: "Imagine Dragons",
        artistId: "53XhwfbYqKCa1cC15pYq2q",
        trackName: "Thunder",
        trackId: "1zB4vmk8tFRmM9UULNzbLBrrY",
        trackUrl:
          "https://p.scdn.co/mp3-preview/07e14c4e821174295fe50f03b33d98387570d1db?cid=774b29d4f13844c495f206cafdad9c86",
        albumId: "33pt9HBdGlAbRGBHQgsZsU",
        albumImg:
          "https://i.scdn.co/image/ab67616d0000b2735675e83f707f1d7271e5cf8a"
      },
      {
        artistName: "Linkin Park",
        artistId: "6XyY86QOPPrYVGvF9ch6wz",
        trackName: "In the end",
        trackId: "1zB4vmk8tFRmM9UULNzbLB",
        trackUrl:
          "https://p.scdn.co/mp3-preview/6ce8bcf317e8c562f348ea22c846846b5b70e8d9?cid=774b29d4f13844c495f206cafdad9c86",
        albumId: "6hPkbAV3ZXpGZBGUvL6jVM",
        albumImg:
          "https://i.scdn.co/image/ab67616d0000b273e2f039481babe23658fc719a"
      },
      {
        artistName: "Linkin Park",
        artistId: "6XyY86QOPPrYVGvF9ch6wz",
        trackName: "Numb",
        trackId: "2nLtzopw4rPReszdYBJU6h",
        trackUrl:
          "https://p.scdn.co/mp3-preview/e6ccf7717f8a167bfea4afc1bf7da1a0cd707fbb?cid=774b29d4f13844c495f206cafdad9c86",
        albumId: "4Gfnly5CzMJQqkUFfoHaP3",
        albumImg:
          "https://i.scdn.co/image/ab67616d0000b273b4ad7ebaf4575f120eb3f193"
      }
    ]
  };
}
