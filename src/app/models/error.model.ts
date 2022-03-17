export interface ErrorFromSpotifyModel {
  name: string;
  status: number;
  error: ErrorModel;
}

export interface ErrorMessageModel {
  message: string;
}

export interface ErrorModel {
  error: ErrorMessageModel;
}

// playlists, albums, saved tracks
// {
//   items: [
//     {
//       track: {
//         информация о треке
//       }
//     }
//   ]
// }

//search
// {
//   tracks: {
//     items: [
//       {
//         информация о треке
//       }
//     ]
//   }
// }

//top tracks artist

// {
//   tracks: [
//     {
//       информация о треке
//     }
//   ]
// }
