import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";
import {
  AlbumByIdModel,
  AlbumsByIdsModel,
  ItemsAlbumModel,
  NewAlbumsReleasesModel,
  TracksModel
} from "../models/new-api-models/album-by-id.model";
import {
  ArtistByIdModel,
  ArtistsByIdsModel,
  ArtistsModel,
  TopArtistsModel
} from "../models/new-api-models/artist-by-id.model";
import { GenresModel } from "../models/new-api-models/genres.model";
import { FollowedArtistModel } from "../models/new-api-models/followed-artist.model";
import {
  ItemsTrackModel,
  NewUserTopTracksModel,
  TopTracksArtistByIdModel
} from "../models/new-api-models/top-tracks-artist-by-id.model";
import { PlaylistByIdModel } from "../models/new-api-models/playlist-by-id.model";
import {
  TrackById,
  TracksByIds
} from "../models/new-api-models/track-by-id.model";
import {
  CurrentUsersPlaylistModel,
  ItemUserPlaylistModel
} from "../models/new-api-models/current-users-playlist.model";
import {
  CategoriesModel,
  CategoryModel
} from "../models/new-api-models/category.model";
import { CategoriesPlaylistsModel } from "../models/new-api-models/categories-playlists.model";
import { UserProfileModel } from "../models/new-api-models/user-profile.model";
import { SearchModel } from "../models/new-api-models/search.model";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  private readonly headers: HttpHeaders;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + String(this.auth?.getAuthToken())
    });
  }

  getAlbumByID(albumId: string): Observable<AlbumByIdModel> {
    return this.http.get<AlbumByIdModel>(
      "https://api.spotify.com/v1/albums/" + albumId,
      {
        headers: this.headers
      }
    );
  }

  getSeveralAlbumsByIds(albumsIds: string): Observable<AlbumsByIdsModel> {
    return this.http.get<AlbumsByIdsModel>(
      "https://api.spotify.com/v1/albums",
      {
        headers: this.headers,
        params: { ids: albumsIds }
      }
    );
  }

  getAlbumsTracksById(trackId: string): Observable<TracksModel> {
    return this.http.get<TracksModel>(
      "https://api.spotify.com/v1/albums/" + trackId + "/tracks",
      {
        headers: this.headers
      }
    );
  }

  checkSavedAlbums(albumIds: string): Observable<boolean[]> {
    return this.http.get<boolean[]>(
      "https://api.spotify.com/v1/me/albums/contains",
      {
        headers: this.headers,
        params: { ids: albumIds }
      }
    );
  }

  getSavedAlbums(): Observable<ItemsAlbumModel> {
    return this.http.get<ItemsAlbumModel>(
      "https://api.spotify.com/v1/me/albums",
      {
        headers: this.headers
      }
    );
  }

  putSaveAlbums(ids: string): Observable<void> {
    return this.http.put<void>(
      "https://api.spotify.com/v1/me/albums",
      {},
      {
        headers: this.headers,
        params: { ids }
      }
    );
  }

  deleteAlbums(ids: string): Observable<void> {
    return this.http.delete<void>("https://api.spotify.com/v1/me/albums", {
      headers: this.headers,
      params: { ids }
    });
  }

  getNewAlbumReleases(): Observable<NewAlbumsReleasesModel> {
    return this.http.get<NewAlbumsReleasesModel>(
      "https://api.spotify.com/v1/browse/new-releases",
      {
        headers: this.headers
      }
    );
  }

  getArtistByID(artistId: string): Observable<ArtistByIdModel> {
    return this.http.get<ArtistByIdModel>(
      "https://api.spotify.com/v1/artists/" + artistId,
      {
        headers: this.headers
      }
    );
  }

  getArtistsAlbums(
    artistId: string,
    includes = "album,single,compilation,appears_on",
    offset = 0,
    limit = 10
  ): Observable<ArtistsModel> {
    return this.http.get<ArtistsModel>(
      `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=${includes}&market=US&limit=${limit}&offset=${offset}`,
      {
        headers: this.headers
      }
    );
  }

  getSeveralArtistsByIds(artistsIds: string): Observable<ArtistsByIdsModel> {
    return this.http.get<ArtistsByIdsModel>(
      "https://api.spotify.com/v1/artists",
      {
        headers: this.headers,
        params: { ids: artistsIds }
      }
    );
  }

  getArtistsTopTracks(artistId: string): Observable<TopTracksArtistByIdModel> {
    return this.http.get<TopTracksArtistByIdModel>(
      "https://api.spotify.com/v1/artists/" + artistId + "/top-tracks",
      {
        headers: this.headers,
        params: { market: "US" }
      }
    );
  }

  getTrackById(trackId: string): Observable<TrackById> {
    return this.http.get<TrackById>(
      "https://api.spotify.com/v1/tracks/" + trackId,
      {
        headers: this.headers
      }
    );
  }

  getSeveralTracksByIds(ids: string): Observable<TracksByIds> {
    return this.http.get<TracksByIds>("https://api.spotify.com/v1/tracks", {
      headers: this.headers,
      params: { ids }
    });
  }

  checkUsersSavedTracks(ids: string): Observable<boolean[]> {
    return this.http.get<boolean[]>(
      "https://api.spotify.com/v1/me/tracks/contains",
      {
        headers: this.headers,
        params: { ids }
      }
    );
  }

  getUsersSavedTracks(offset = 0, limit = 24): Observable<ItemsTrackModel> {
    const url = `https://api.spotify.com/v1/me/tracks?offset=${offset}&limit=${limit}`;
    return this.http.get<ItemsTrackModel>(url, {
      headers: this.headers
    });
  }

  putSaveTracksForCurrentUser(ids: string): Observable<void> {
    return this.http.put<void>(
      "https://api.spotify.com/v1/me/tracks",
      {},
      {
        headers: this.headers,
        params: { ids }
      }
    );
  }

  deleteTracksForCurrentUser(trackIds: string): Observable<void> {
    return this.http.delete<void>("https://api.spotify.com/v1/me/tracks", {
      headers: this.headers,
      params: { ids: trackIds }
    });
  }

  getPlaylistById(playlistId: string): Observable<PlaylistByIdModel> {
    return this.http.get<PlaylistByIdModel>(
      "https://api.spotify.com/v1/playlists/" + playlistId,
      {
        headers: this.headers
      }
    );
  }

  getPlaylistTracks(
    playlistId: string,
    limit = 50,
    offset = 0
  ): Observable<ItemsTrackModel> {
    return this.http.get<ItemsTrackModel>(
      "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks",
      {
        headers: this.headers,
        params: { limit, offset }
      }
    );
  }

  getCurrentUsersPlaylists(): Observable<CurrentUsersPlaylistModel> {
    return this.http.get<CurrentUsersPlaylistModel>(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: this.headers
      }
    );
  }

  createPlaylist(
    userId: string,
    name: string,
    description: string,
    isPublic: boolean
  ): Observable<ItemUserPlaylistModel> {
    return this.http.post<ItemUserPlaylistModel>(
      "https://api.spotify.com/v1/users/" + userId + "/playlists",
      {
        name,
        description,
        public: isPublic
      },
      { headers: this.headers }
    );
  }

  changePlaylistDetails(
    playlistId: string,
    name: string,
    description: string,
    isPublic: boolean
  ): Observable<void> {
    return this.http.put<void>(
      "https://api.spotify.com/v1/playlists/" + playlistId,
      {
        name,
        description,
        public: isPublic
      },
      { headers: this.headers }
    );
  }

  addItemsToPlaylist(playlistId: string, trackId: string): Observable<void> {
    return this.http.post<void>(
      "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks",
      {},
      {
        headers: this.headers,
        params: { uris: "spotify:track:" + trackId }
      }
    );
  }

  deleteItemsFromPlaylist(
    playlistId: string,
    trackId: string
  ): Observable<void> {
    return this.http.delete<void>(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: this.headers,
        body: { tracks: [{ uri: "spotify:track:" + trackId }] }
      }
    );
  }

  getAvailableGenreSeeds(): Observable<GenresModel> {
    return this.http.get<GenresModel>(
      "https://api.spotify.com/v1/recommendations/available-genre-seeds",
      {
        headers: this.headers
      }
    );
  }

  getListCategories(): Observable<CategoriesModel> {
    return this.http.get<CategoriesModel>(
      "https://api.spotify.com/v1/browse/categories",
      {
        headers: this.headers,
        params: { country: "US", locale: "en_US", limit: 50 }
      }
    );
  }

  getCategory(categoryId: string): Observable<CategoryModel> {
    return this.http.get<CategoryModel>(
      "https://api.spotify.com/v1/browse/categories/" + categoryId,
      {
        headers: this.headers
      }
    );
  }

  getCategoriesPlaylists(
    categoryId: string,
    offset = 0,
    limit = 10
  ): Observable<CategoriesPlaylistsModel> {
    const url = `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists?offset=${offset}&limit=${limit}`;
    return this.http.get<CategoriesPlaylistsModel>(url, {
      headers: this.headers
    });
  }

  getFeaturedPlaylists(): Observable<CategoriesPlaylistsModel> {
    return this.http.get<CategoriesPlaylistsModel>(
      "https://api.spotify.com/v1/browse/featured-playlists",
      {
        headers: this.headers
      }
    );
  }

  getRecommendations(
    seedArtists: string,
    seedGenres: string,
    seedTracks: string
  ): Observable<TopTracksArtistByIdModel> {
    return this.http.get<TopTracksArtistByIdModel>(
      "https://api.spotify.com/v1/recommendations",
      {
        headers: this.headers,
        params: {
          seed_artists: seedArtists,
          seed_genres: seedGenres,
          seed_tracks: seedTracks
        }
      }
    );
  }

  putFollowPlaylist(playlistId: string): Observable<void> {
    return this.http.put<void>(
      "https://api.spotify.com/v1/playlists/" + playlistId + "/followers",
      { public: true },
      { headers: this.headers }
    );
  }

  putFollowArtists(artistsIds: string): Observable<void> {
    return this.http.put<void>(
      "https://api.spotify.com/v1/me/following",
      {},
      {
        headers: this.headers,
        params: { type: "artist", ids: artistsIds }
      }
    );
  }

  getFollowedArtists(): Observable<FollowedArtistModel> {
    return this.http.get<FollowedArtistModel>(
      "https://api.spotify.com/v1/me/following",
      {
        headers: this.headers,
        params: { type: "artist" }
      }
    );
  }

  checkIfUserFollowsArtists(artistsIds: string): Observable<boolean[]> {
    return this.http.get<boolean[]>(
      "https://api.spotify.com/v1/me/following/contains",
      {
        headers: this.headers,
        params: { type: "artist", ids: artistsIds }
      }
    );
  }

  unfollowPlaylist(playlistId: string): Observable<void> {
    return this.http.delete<void>(
      "https://api.spotify.com/v1/playlists/" + playlistId + "/followers",
      {
        headers: this.headers
      }
    );
  }

  unfollowArtists(artistsIds: string): Observable<void> {
    return this.http.delete<void>("https://api.spotify.com/v1/me/following", {
      headers: this.headers,
      params: { type: "artist", ids: artistsIds }
    });
  }

  getCurrentUsersProfile(): Observable<UserProfileModel> {
    return this.http.get<UserProfileModel>("https://api.spotify.com/v1/me", {
      headers: this.headers
    });
  }

  getUserTopArtists(): Observable<TopArtistsModel> {
    return this.http.get<TopArtistsModel>(
      "https://api.spotify.com/v1/me/top/artists",
      {
        headers: this.headers
      }
    );
  }

  getUserTopTracks(): Observable<NewUserTopTracksModel> {
    return this.http.get<NewUserTopTracksModel>(
      "https://api.spotify.com/v1/me/top/tracks",
      {
        headers: this.headers
      }
    );
  }

  searchForItem(
    keyword: string,
    limit = 2,
    offset = 0
  ): Observable<SearchModel> {
    return this.http.get<SearchModel>("https://api.spotify.com/v1/search", {
      headers: this.headers,
      params: { q: keyword, type: "artist,track", limit, offset }
    });
  }

  addPlaylistImage(
    playlistId: string,
    playlistImage: string
  ): Observable<void> {
    return this.http.put<void>(
      "https://api.spotify.com/v1/playlists/" + playlistId + "/images",
      playlistImage,
      {
        headers: this.headers
      }
    );
  }
}
