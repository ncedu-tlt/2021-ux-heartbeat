import { Component } from "@angular/core";
import { ArtistCardModel } from "../../models/artist-card.model";

@Component({
  selector: "hb-followed-artist-page",
  templateUrl: "./followed-artist-page.component.html",
  styleUrls: ["./followed-artist-page.component.less"]
})
export class FollowedArtistPageComponent {
  public artistInfo: ArtistCardModel[] = [
    {
      artistId: "6XyY86QOPPrYVGvF9ch6wz",
      artistName: "Linkin Park",
      artistImg:
        "https://i.scdn.co/image/ab6761610000e5eb34e5aa6afc1ba147bfbb0677",
      followers: 2670890,
      genres: ["Rock", "Alternative Metal"]
    },
    {
      artistId: "53XhwfbYqKCa1cC15pYq2q",
      artistName: "Imagine Dragons",
      artistImg:
        "https://i.scdn.co/image/ab6761610000e5eb920dc1f617550de8388f368e",
      followers: 2670890,
      genres: ["Indie Rock"]
    },
    {
      artistId: "6XyY86QOPPrYVGvF9ch6wz",
      artistName: "Linkin Park",
      artistImg:
        "https://i.scdn.co/image/ab6761610000e5eb34e5aa6afc1ba147bfbb0677",
      followers: 2670890,
      genres: ["Rock", "Alternative Metal"]
    },
    {
      artistId: "53XhwfbYqKCa1cC15pYq2q",
      artistName: "Imagine Dragons",
      artistImg:
        "https://i.scdn.co/image/ab6761610000e5eb920dc1f617550de8388f368e",
      followers: 2670890,
      genres: ["Indie Rock"]
    },
    {
      artistId: "6XyY86QOPPrYVGvF9ch6wz",
      artistName: "Linkin Park",
      artistImg:
        "https://i.scdn.co/image/ab6761610000e5eb34e5aa6afc1ba147bfbb0677",
      followers: 2670890,
      genres: ["Rock", "Alternative Metal"]
    },
    {
      artistId: "53XhwfbYqKCa1cC15pYq2q",
      artistName: "Imagine Dragons",
      artistImg:
        "https://i.scdn.co/image/ab6761610000e5eb920dc1f617550de8388f368e",
      followers: 2670890,
      genres: ["Indie Rock"]
    },
    {
      artistId: "6XyY86QOPPrYVGvF9ch6wz",
      artistName: "Linkin Park",
      artistImg:
        "https://i.scdn.co/image/ab6761610000e5eb34e5aa6afc1ba147bfbb0677",
      followers: 2670890,
      genres: ["Rock", "Alternative Metal"]
    },
    {
      artistId: "53XhwfbYqKCa1cC15pYq2q",
      artistName: "Imagine Dragons",
      artistImg:
        "https://i.scdn.co/image/ab6761610000e5eb920dc1f617550de8388f368e",
      followers: 2670890,
      genres: ["Indie Rock"]
    },
    {
      artistId: "6XyY86QOPPrYVGvF9ch6wz",
      artistName: "Linkin Park",
      artistImg:
        "https://i.scdn.co/image/ab6761610000e5eb34e5aa6afc1ba147bfbb0677",
      followers: 2670890,
      genres: ["Rock", "Alternative Metal"]
    },
    {
      artistId: "53XhwfbYqKCa1cC15pYq2q",
      artistName: "Imagine Dragons",
      artistImg:
        "https://i.scdn.co/image/ab6761610000e5eb920dc1f617550de8388f368e",
      followers: 2670890,
      genres: ["Indie Rock"]
    }
  ];
}
