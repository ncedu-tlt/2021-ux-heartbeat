import { Injectable } from "@angular/core";
import { PostgrestResponse, SupabaseClient } from "@supabase/supabase-js";
import { LastTrackModel } from "../models/last-track.model";

@Injectable({
  providedIn: "root"
})
export class LastTrackService {
  lastTrack: any;
  userId: string | undefined;

  constructor(public supabase: SupabaseClient) {
    this.userId = this.supabase.auth.user()?.id;
  }

  async checkLastTrack(): Promise<LastTrackModel[] | null> {
    const { data }: PostgrestResponse<LastTrackModel> = await this.supabase
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
    playlistId: string,
    context: string
  ): Promise<void> {
    const lastTrack = await this.checkLastTrack();
    if (!lastTrack) {
      await this.supabase.from("last_track").insert([
        {
          user_id: this.userId,
          track_id: trackId,
          playlist_id: playlistId,
          context: context
        }
      ]);
      return;
    }

    await this.supabase
      .from("last_track")
      .update({
        track_id: trackId,
        playlist_id: playlistId,
        context: context
      })
      .eq("user_id", this.userId);
  }
}
