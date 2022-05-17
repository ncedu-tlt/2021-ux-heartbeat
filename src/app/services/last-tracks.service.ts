import { Injectable } from "@angular/core";
import { SupabaseClient } from "@supabase/supabase-js";
import { LastPlayedTracksModel } from "src/app/models/last-played-tracks.model";

@Injectable({
  providedIn: "root"
})
export class LastTracksService {
  constructor(private supabase: SupabaseClient) {}

  private userId = this.supabase.auth.user()?.id;

  async updateLastTracksForCurrentUser(id: string): Promise<void> {
    const { data } = await this.supabase
      .from("lastPlayedTracks")
      .select("*")
      .eq("user_id", this.userId);

    if (data?.length == 0) {
      await this.supabase.from("lastPlayedTracks").insert([
        {
          user_id: this.userId,
          track1: id,
          track2: null,
          track3: null,
          track4: null
        }
      ]);
      return;
    }

    const { track1, track2, track3, track4 } = (
      data as LastPlayedTracksModel[]
    )[0];

    if (id === track1 || id === track2 || id === track3 || id === track4) {
      return;
    } else {
      await this.supabase
        .from("lastPlayedTracks")
        .update({ track1: id, track2: track1, track3: track2, track4: track3 })
        .eq("user_id", this.userId);
    }
  }

  async getLastTracks(): Promise<string[]> {
    const { data } = await this.supabase
      .from("lastPlayedTracks")
      .select("*")
      .eq("user_id", this.userId);

    if (data?.length == 0) {
      return [];
    }

    const { track1, track2, track3, track4 } = (
      data as LastPlayedTracksModel[]
    )[0];

    return [track1, track2, track3, track4].filter(elem => elem);
  }
}
