import { Injectable } from "@angular/core";
import { PostgrestResponse, SupabaseClient } from "@supabase/supabase-js";

@Injectable({
  providedIn: "root"
})
export class LastTrackService {
  lastTrack: any;
  userId: string | undefined;

  constructor(public supabase: SupabaseClient) {
    this.userId = this.supabase.auth.user()?.id;
  }

  async checkLastTrack(): Promise<(number | string)[] | null> {
    const { data }: PostgrestResponse<number | string> = await this.supabase
      .from("last_track")
      .select("*")
      .eq("user_id", this.userId);

    if (!data?.length) {
      return null;
    }

    return data;
  }

  async saveInfoAboutLastTrack(
    trackId: string,
    trackPosition: number,
    playlistId: string
  ): Promise<void> {
    const lastTrack = await this.checkLastTrack();
    if (!lastTrack) {
      await this.supabase.from("last_track").insert([
        {
          user_id: this.userId,
          track_id: trackId,
          track_position: trackPosition,
          playlist_id: playlistId
        }
      ]);
      return;
    }

    await this.supabase
      .from("last-track")
      .update({
        track_id: trackId,
        track_position: trackPosition,
        playlist_id: playlistId
      })
      .eq("user_id", this.userId);
  }
}
