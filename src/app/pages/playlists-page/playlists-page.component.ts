import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from "@angular/core";
import { ItemsTrackModel } from "../../models/new-api-models/top-tracks-artist-by-id.model";
import {
  CurrentUsersPlaylistModel,
  ItemUserPlaylistModel
} from "../../models/new-api-models/current-users-playlist.model";
import { catchError, Subject, throwError } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ApiService } from "../../services/api.service";
import { ThemeStateService } from "src/app/services/theme-state.service";
import { NzMessageService } from "ng-zorro-antd/message";
import { ErrorFromSpotifyModel } from "../../models/error.model";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { PlaylistModalStateEnum } from "../../models/playlist-modal-state.enum";

@Component({
  selector: "hb-playlists-page",
  templateUrl: "./playlists-page.component.html",
  styleUrls: ["./playlists-page.component.less"]
})
export class PlaylistsPageComponent implements OnInit, OnDestroy {
  public playlists: ItemUserPlaylistModel[] = [];
  public playlist!: ItemUserPlaylistModel;
  public tracks!: ItemsTrackModel;
  public isLoading = true;
  public isOpen = false;
  private die$ = new Subject<void>();

  public isVisible = false;
  public modalStates = PlaylistModalStateEnum;
  public modalState!: PlaylistModalStateEnum;
  public modalPlaylistId!: string;
  public modalWarning = false;
  public userId!: string;
  public userName!: string;

  // public loadingImg = false;
  // public avatarUrl!: string;
  public fileToUpload!: File | null;
  public imgURL!: string;
  public imgForSpotify!: string;
  public playlistImg!: string;
  public playlistName!: string;
  public playlistDescription!: string;

  @ViewChildren("playlist")
  private children!: QueryList<ElementRef<HTMLDivElement>>;

  private oldSelected = "";
  private selectedId = "";

  constructor(
    private apiService: ApiService,
    public themeStateService: ThemeStateService,
    private msg: NzMessageService,
    private notificationService: NzNotificationService
  ) {}

  loadPlaylists(): void {
    this.apiService
      .getCurrentUsersPlaylists()
      .pipe(takeUntil(this.die$))
      .subscribe((playlistList: CurrentUsersPlaylistModel) => {
        this.playlists = playlistList.items;
        this.isLoading = false;
      });
  }

  openPlaylist(playlist: ItemUserPlaylistModel): void {
    this.apiService
      .getPlaylistTracks(playlist.id)
      .pipe(takeUntil(this.die$))
      .subscribe((playlistTracks: ItemsTrackModel) => {
        this.tracks = playlistTracks;
      });
    this.playlist = playlist;
    this.isOpen = true;
    this.selectPlaylist(playlist.id);
  }

  public selectPlaylist(id: string): void {
    if (!this.selectedId) {
      this.selectedId = id;
    } else {
      this.oldSelected = this.selectedId;
      this.selectedId = id;
    }

    const currentPlaylist = this.children.find(
      item => item.nativeElement.id == id
    );
    const oldPlaylist = this.children.find(
      item => item.nativeElement.id == this.oldSelected
    );

    if (!currentPlaylist) {
      return;
    }
    currentPlaylist.nativeElement.classList.toggle("active");

    if (!oldPlaylist) {
      return;
    }
    oldPlaylist.nativeElement.classList.toggle("active");
  }

  ngOnInit(): void {
    this.loadPlaylists();
    this.getUserId();
  }

  ngOnDestroy(): void {
    this.die$.next();
  }

  changeVisible(
    state: PlaylistModalStateEnum,
    name = "",
    description = "",
    id = "",
    img = ""
  ): void {
    this.modalState = state;
    this.playlistName = name;
    this.modalPlaylistId = id;
    this.playlistDescription = description;
    this.playlistImg = img;
    this.isVisible = true;
    document.body.style.overflow = "hidden";
  }

  handleCancel(): void {
    this.isVisible = false;
    document.body.style.overflow = "visible";
    this.playlistName = "";
    this.playlistDescription = "";
    this.modalWarning = false;
  }

  switchMode(): string {
    return !this.themeStateService.getIsDarkTheme()
      ? "#FFFFFF"
      : "linear-gradient(252.82deg, rgba(54, 66, 109) 72.05%, rgba(12, 14, 24, 0.7) 100%) no-repeat fixed";
  }

  // beforeUpload = (file: NzUploadFile): Observable<boolean> =>
  //   new Observable((observer: Observer<boolean>) => {
  //     const isJpgOrPng =
  //       file.type === "image/jpeg" || file.type === "image/png";
  //     if (!isJpgOrPng) {
  //       this.msg.error("You can only upload JPG file!");
  //       observer.complete();
  //       return;
  //     }
  //     const isLt2M = (file.size as number) / 1024 / 1024 < 2;
  //     if (!isLt2M) {
  //       this.msg.error("Image must smaller than 2MB!");
  //       observer.complete();
  //       return;
  //     }
  //     observer.next(isJpgOrPng && isLt2M);
  //     observer.complete();
  //   });

  checkUploadImage(file: File): boolean {
    if (!(file.type === "image/jpeg" || file.type === "image/png")) {
      this.modalWarning = true;
      return false;
    }
    if (file.size / 1000 > 150) {
      this.modalWarning = true;
      return false;
    }
    return true;
  }

  handleFileInput(event: Event) {
    const inputFile = event.target as HTMLInputElement;
    this.fileToUpload = (inputFile.files as FileList).item(0);
    const checkUploadWarning = this.checkUploadImage(this.fileToUpload as File);
    if (checkUploadWarning) {
      this.imgURL = URL.createObjectURL(this.fileToUpload);
      this.getBase64(this.fileToUpload as File, (img: string) => {
        this.imgForSpotify = img.replace("data:image/jpeg;base64,", "");
      });
    }
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener("load", () =>
      callback((reader.result as ArrayBuffer).toString())
    );
    reader.readAsDataURL(img);
  }

  // handleChange(info: { file: NzUploadFile }): void {
  //   const { originFileObj } = info.file;
  //
  //   switch (info.file.status) {
  //     case "uploading":
  //       this.loadingImg = true;
  //       break;
  //     case "done":
  //       if (originFileObj) {
  //         this.getBase64(originFileObj, (img: string) => {
  //           this.loadingImg = false;
  //           this.avatarUrl = img;
  //         });
  //       }
  //       break;
  //     case "error":
  //       this.msg.error("Network error");
  //       this.loadingImg = false;
  //       break;
  //   }
  // }

  getUserId(): void {
    this.apiService
      .getCurrentUsersProfile()
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.notificationService.error("Ошибка", error.error.error.message);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(userInfo => {
        this.userId = userInfo.id;
        this.userName = userInfo.display_name;
      });
  }

  createNewPlaylist(): void {
    if (!this.playlistName) {
      this.modalWarning = true;
      return;
    }
    this.apiService
      .createPlaylist(
        this.userId,
        this.playlistName,
        this.playlistDescription,
        false
      )
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.notificationService.error("Ошибка", error.error.error.message);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe((createdPlaylist: ItemUserPlaylistModel) => {
        this.playlists.unshift(createdPlaylist);
        this.notificationService.blank(
          "Создание плейлиста",
          `Вы успешно создали плейлист ${this.playlistName}`
        );
        this.handleCancel();
      });
  }

  changePlaylistInformation(id: string): void {
    if (!this.playlistDescription || !this.playlistName) {
      this.modalWarning = true;
      return;
    }
    this.apiService
      .changePlaylistDetails(
        id,
        this.playlistName,
        this.playlistDescription,
        false
      )
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.notificationService.error("Ошибка", error.error.error.message);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(() => {
        const playlistIndex = this.playlists.findIndex(playlist => {
          return playlist.id === id;
        });
        this.playlists[playlistIndex].name = this.playlistName;
        this.playlists[playlistIndex].description = this.playlistDescription;
        this.notificationService.blank(
          "Изменение плейлиста",
          `Вы успешно изменили плейлист ${this.playlistName}`
        );
        this.handleCancel();
      });
    if (this.imgForSpotify) {
      this.changePlaylistImage(id, this.imgForSpotify);
    }
  }

  deletePlaylist(id: string, name: string): void {
    this.apiService
      .unfollowPlaylist(id)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.notificationService.error("Ошибка", error.error.error.message);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(() => {
        this.notificationService.blank(
          "Удаление плейлиста",
          `Вы успешно удалили плейлист ${name}`
        );
        this.playlists.splice(
          this.playlists.findIndex(playlist => {
            return playlist.id === id;
          }),
          1
        );
      });
  }

  changePlaylistImage(playlistId: string, playlistImage: string) {
    this.apiService
      .addPlaylistImage(playlistId, playlistImage)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.notificationService.error("Ошибка", error.error.error.message);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(() => {
        this.playlists[
          this.playlists.findIndex(playlist => {
            return playlist.id === playlistId;
          })
        ].images[0].url = this.imgURL;
      });
  }
}
