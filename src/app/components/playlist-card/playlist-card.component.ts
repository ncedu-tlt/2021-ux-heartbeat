import { Component } from "@angular/core";
import { Playlist } from "src/app/models/playlist-card.model";

@Component({
  selector: "hb-playlist-card",
  templateUrl: "./playlist-card.component.html",
  styleUrls: ["./playlist-card.component.less"]
})
export class PlaylistCardComponent {
  playlist: Playlist[] = [
    {
      id: "37i9dQZF1DX4uWsCu3SlsH",
      images: {
        url: "https://i.scdn.co/image/ab67706f000000039313c4e5a157a54d555efb88"
      },
      name: "Рок сегодня"
    },
    {
      id: "37i9dQZF1DX129cp9QPsuV",
      images: {
        url: "https://i.scdn.co/image/ab67706f000000039b5ed18482bad1126af888e6"
      },
      name: "Хиты русского рока"
    },
    {
      id: "37i9dQZF1DX2v8iwakkTNa",
      images: {
        url: "https://i.scdn.co/image/ab67706f000000038084b6ac5df76b1b2b73ba47"
      },
      name: "Новинки русского рока"
    },
    {
      id: "37i9dQZF1DX3QObnPJR0AP",
      images: {
        url: "https://i.scdn.co/image/ab67706f0000000329c87acaf559092a3480853e"
      },
      name: "Русский панк-рок"
    },
    {
      id: "37i9dQZF1DX4uWsCu3SlsH",
      images: {
        url: "https://i.scdn.co/image/ab67706f000000039313c4e5a157a54d555efb88"
      },
      name: "Рок сегодня"
    },
    {
      id: "37i9dQZF1DX129cp9QPsuV",
      images: {
        url: "https://i.scdn.co/image/ab67706f000000039b5ed18482bad1126af888e6"
      },
      name: "Хиты русского рока"
    },
    {
      id: "37i9dQZF1DX2v8iwakkTNa",
      images: {
        url: "https://i.scdn.co/image/ab67706f000000038084b6ac5df76b1b2b73ba47"
      },
      name: "Новинки русского рока"
    },
    {
      id: "37i9dQZF1DX3QObnPJR0AP",
      images: {
        url: "https://i.scdn.co/image/ab67706f0000000329c87acaf559092a3480853e"
      },
      name: "Русский панк-рок"
    },
    {
      id: "37i9dQZF1DX2v8iwakkTNa",
      images: {
        url: "https://i.scdn.co/image/ab67706f000000038084b6ac5df76b1b2b73ba47"
      },
      name: "Новинки русского рока"
    },
    {
      id: "37i9dQZF1DX3QObnPJR0AP",
      images: {
        url: "https://i.scdn.co/image/ab67706f0000000329c87acaf559092a3480853e"
      },
      name: "Русский панк-рок"
    },
    {
      id: "37i9dQZF1DX2v8iwakkTNa",
      images: {
        url: "https://i.scdn.co/image/ab67706f000000038084b6ac5df76b1b2b73ba47"
      },
      name: "Новинки русского рока"
    }
  ];
  newPlaylist: any[] = [];
  isShowMore = false;
  ngOnInit() {
    this.newPlaylist = this.playlist.slice(0, 8);
  }
  showMore() {
    if (!this.isShowMore) {
      this.newPlaylist = this.playlist.slice();
    } else {
      this.newPlaylist = this.playlist.slice(0, 8);
    }
    this.isShowMore = !this.isShowMore;
  }
}
