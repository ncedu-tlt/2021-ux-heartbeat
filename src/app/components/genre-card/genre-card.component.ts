import { Component } from "@angular/core";
import { GenreCard } from "src/app/models/genre-card.model";

@Component({
  selector: "hb-genre-card",
  templateUrl: "./genre-card.component.html",
  styleUrls: ["./genre-card.component.less"]
})
export class GenreCardComponent {
  public genres: GenreCard[] = [
    {
      icons: {
        url: "https://t.scdn.co/media/derived/pop-274x274_447148649685019f5e2a03a39e78ba52_0_0_274_274.jpg"
      },
      name: "Pop",
      id: "pop"
    },
    {
      icons: {
        url: "https://t.scdn.co/media/original/mood-274x274_976986a31ac8c49794cbdc7246fd5ad7_274x274.jpg"
      },
      name: "Mood",
      id: "mood"
    },
    {
      icons: {
        url: "https://t.scdn.co/images/7ee6530d5b3c4acc9a0957046bf11d63"
      },
      name: "Party",
      id: "party"
    },
    {
      icons: {
        url: "https://t.scdn.co/media/original/hip-274_0a661854d61e29eace5fe63f73495e68_274x274.jpg"
      },
      name: "Hip-Hop",
      id: "hiphop"
    },
    {
      icons: {
        url: "https://t.scdn.co/images/fe06caf056474bc58862591cd60b57fc.jpeg"
      },
      name: "Indie",
      id: "indie_alt"
    },
    {
      icons: {
        url: "https://t.scdn.co/media/derived/chill-274x274_4c46374f007813dd10b37e8d8fd35b4b_0_0_274_274.jpg"
      },
      name: "Chill",
      id: "chill"
    },
    {
      icons: {
        url: "https://t.scdn.co/media/derived/edm-274x274_0ef612604200a9c14995432994455a6d_0_0_274_274.jpg"
      },
      name: "Dance",
      id: "edm_dance"
    },
    {
      icons: {
        url: "https://t.scdn.co/media/derived/romance-274x274_8100794c94847b6d27858bed6fa4d91b_0_0_274_274.jpg"
      },
      name: "Romance",
      id: "romance"
    },
    {
      icons: {
        url: "https://t.scdn.co/media/links/workout-274x274.jpg"
      },
      name: "Workout",
      id: "workout"
    },
    {
      icons: {
        url: "https://t.scdn.co/media/original/genre-images-square-274x274_5e50d72b846a198fcd2ca9b3aef5f0c8_274x274.jpg"
      },
      name: "Focus",
      id: "focus"
    },
    {
      icons: {
        url: "https://t.scdn.co/images/3710b68657574bc79df14bd74629e5ac"
      },
      name: "Wellness",
      id: "wellness"
    },
    {
      icons: {
        url: "https://t.scdn.co/images/7ee6530d5b3c4acc9a0957046bf11d63"
      },
      name: "Party",
      id: "party"
    },
    {
      icons: {
        url: "https://t.scdn.co/media/original/hip-274_0a661854d61e29eace5fe63f73495e68_274x274.jpg"
      },
      name: "Hip-Hop",
      id: "hiphop"
    },
    {
      icons: {
        url: "https://t.scdn.co/images/fe06caf056474bc58862591cd60b57fc.jpeg"
      },
      name: "Indie",
      id: "indie_alt"
    },
    {
      icons: {
        url: "https://t.scdn.co/media/derived/chill-274x274_4c46374f007813dd10b37e8d8fd35b4b_0_0_274_274.jpg"
      },
      name: "Chill",
      id: "chill"
    },
    {
      icons: {
        url: "https://t.scdn.co/media/derived/edm-274x274_0ef612604200a9c14995432994455a6d_0_0_274_274.jpg"
      },
      name: "Dance",
      id: "edm_dance"
    },
    {
      icons: {
        url: "https://t.scdn.co/media/derived/romance-274x274_8100794c94847b6d27858bed6fa4d91b_0_0_274_274.jpg"
      },
      name: "Romance",
      id: "romance"
    },
    {
      icons: {
        url: "https://t.scdn.co/media/links/workout-274x274.jpg"
      },
      name: "Workout",
      id: "workout"
    },
    {
      icons: {
        url: "https://t.scdn.co/media/original/genre-images-square-274x274_5e50d72b846a198fcd2ca9b3aef5f0c8_274x274.jpg"
      },
      name: "Focus",
      id: "focus"
    },
    {
      icons: {
        url: "https://t.scdn.co/images/3710b68657574bc79df14bd74629e5ac"
      },
      name: "Wellness",
      id: "wellness"
    }
  ];
}
