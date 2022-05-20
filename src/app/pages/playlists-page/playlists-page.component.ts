import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from "@angular/core";
import { ItemsTrackModel } from "../../models/new-api-models/top-tracks-artist-by-id.model";
import {
  CurrentUsersPlaylistModel,
  ItemUserPlaylistModel
} from "../../models/new-api-models/current-users-playlist.model";
import {
  catchError,
  combineLatest,
  Observable,
  of,
  Subject,
  switchMap,
  throwError
} from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ApiService } from "../../services/api.service";
import { ThemeStateService } from "src/app/services/theme-state.service";
import { NzMessageService } from "ng-zorro-antd/message";
import { ErrorFromSpotifyModel } from "../../models/error.model";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { PlaylistModalStateEnum } from "../../models/playlist-modal-state.enum";
import { ErrorHandlingService } from "../../services/error-handling.service";
import {
  TrackLaunchContext,
  TrackLaunchContextEnum
} from "../../models/track-launch-context.enum";

@Component({
  selector: "hb-playlists-page",
  templateUrl: "./playlists-page.component.html",
  styleUrls: ["./playlists-page.component.less"]
})
export class PlaylistsPageComponent implements OnInit, OnDestroy {
  public playlists: ItemUserPlaylistModel[] = [];
  public playlist!: ItemUserPlaylistModel;
  public tracks!: ItemsTrackModel;
  public trackListContext: TrackLaunchContext = {
    id: null,
    contextType: TrackLaunchContextEnum.PLAYLIST
  };
  public isLoading = true;
  public isOpen = false;
  private die$ = new Subject<void>();

  public isVisible = false;
  public modalStates = PlaylistModalStateEnum;
  public modalCurrentState!: PlaylistModalStateEnum;

  public inputWarning = false;
  public fileWarning = "";

  public userId!: string;
  public userName!: string;

  public imgToUpload!: File | null;
  public imgURL!: string | null;
  public imgForSpotify!: string;

  public modalPlaylistId!: string;
  public playlistImg!: string;
  public playlistName!: string;
  public playlistDescription!: string;

  @ViewChildren("playlist")
  private children!: QueryList<ElementRef<HTMLDivElement>>;

  private oldSelected = "";
  private selectedId = "";

  @ViewChild("openedPlaylist")
  private openedPlaylist!: ElementRef<HTMLDivElement>;

  constructor(
    private apiService: ApiService,
    public themeStateService: ThemeStateService,
    private msg: NzMessageService,
    private notificationService: NzNotificationService,
    public error: ErrorHandlingService
  ) {}

  loadPlaylists(): void {
    this.apiService
      .getCurrentUsersPlaylists()
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe((playlistList: CurrentUsersPlaylistModel) => {
        this.playlists = playlistList.items;
        this.isLoading = false;
      });
  }

  openPlaylist(playlist: ItemUserPlaylistModel): void {
    this.apiService
      .getPlaylistTracks(playlist.id)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe((playlistTracks: ItemsTrackModel) => {
        this.tracks = playlistTracks;
      });
    this.playlist = playlist;
    this.trackListContext.id = this.playlist.id;
    this.isOpen = true;
    this.selectPlaylist(playlist.id);
    this.trackListContext.id = playlist.id;
    setTimeout(
      () => this.openedPlaylist.nativeElement.scrollIntoView(true),
      150
    );
  }

  removeTrackFromPlaylist(id: string): void {
    this.tracks.items = this.tracks.items.filter(
      element => element.track.id != id
    );
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
    event: Event,
    state: PlaylistModalStateEnum,
    playlist?: ItemUserPlaylistModel
  ): void {
    event.stopPropagation();
    this.modalCurrentState = state;
    if (playlist) {
      [
        this.playlistName,
        this.playlistDescription,
        this.playlistImg,
        this.modalPlaylistId
      ] = [
        playlist.name,
        playlist.description,
        playlist.images[0]?.url || "assets/image/undefined_album_image.jpg",
        playlist.id
      ];
    } else {
      this.playlistName =
        this.playlistDescription =
        this.playlistImg =
        this.modalPlaylistId =
          "";
    }
    this.isVisible = true;
    document.body.style.overflow = "hidden";
  }

  handleCancel(): void {
    this.isVisible = false;
    document.body.style.overflow = "visible";
    this.inputWarning = false;
    this.imgToUpload = null;
  }

  switchMode(): string {
    return !this.themeStateService.getIsDarkTheme()
      ? "#FFFFFF"
      : "linear-gradient(252.82deg, rgba(54, 66, 109) 72.05%, rgba(12, 14, 24, 0.7) 100%) no-repeat fixed";
  }

  checkUploadImage(file: File): boolean {
    if (file.type !== "image/jpeg") {
      this.fileWarning = "Файл должен иметь формат jpeg";
      this.imgURL = "assets/image/undefined_album_image.jpg";
      return false;
    }
    if (file.size / 1000 > 140) {
      this.fileWarning = "Размер файла не должен превышать 140КБ";
      this.imgURL = URL.createObjectURL(file);
      return false;
    }
    return true;
  }

  handleFileInput(event: Event): void {
    this.fileWarning = "";
    const inputFile = event.target as HTMLInputElement;
    this.imgToUpload = (inputFile.files as FileList).item(0);
    const checkUploadWarning = this.checkUploadImage(this.imgToUpload as File);
    if (checkUploadWarning) {
      this.imgURL = URL.createObjectURL(this.imgToUpload);
      this.getBase64(this.imgToUpload as File, (img: string) => {
        this.imgForSpotify = img.replace("data:image/jpeg;base64,", "");
      });
    }
  }

  getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener("load", () =>
      callback((reader.result as ArrayBuffer).toString())
    );
    reader.readAsDataURL(img);
  }

  getUserId(): void {
    this.apiService
      .getCurrentUsersProfile()
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
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
      this.inputWarning = true;
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
          this.error.showErrorNotification(error);
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
    if (!(this.playlistDescription && this.playlistName)) {
      this.inputWarning = true;
      return;
    }
    if (this.fileWarning) {
      return;
    }
    this.handleCancel();
    this.isLoading = true;
    combineLatest([
      this.apiService.changePlaylistDetails(
        id,
        this.playlistName,
        this.playlistDescription,
        false
      ),
      this.changePlaylistImage(id, this.imgForSpotify)
    ])
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        }),
        switchMap(() => {
          return this.apiService.getPlaylistById(id);
        })
      )
      .subscribe(newPlaylist => {
        this.playlists[
          this.playlists.findIndex(playlist => {
            return playlist.id === newPlaylist.id;
          })
        ] = newPlaylist;
        this.isLoading = false;
        this.notificationService.blank(
          "Изменение плейлиста",
          `Вы успешно изменили плейлист ${this.playlistName}`
        );
      });
  }

  removePlaylistImg(): void {
    this.imgURL = this.playlistImg;
    this.imgForSpotify = "";
    this.fileWarning = "";
  }

  deletePlaylist(event: MouseEvent, id: string, name: string): void {
    event.stopPropagation();
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

  changePlaylistImage(
    playlistId: string,
    playlistImage: string
  ): Observable<void | null> {
    if (!playlistImage) {
      return of(null);
    }
    return this.apiService.addPlaylistImage(playlistId, playlistImage).pipe(
      takeUntil(this.die$),
      catchError((error: ErrorFromSpotifyModel) => {
        this.notificationService.error("Ошибка", error.error.error.message);
        return throwError(() => new Error(error.error.error.message));
      })
    );
  }
}
