import { Injectable } from "@angular/core";
import { SupabaseClient } from "@supabase/supabase-js";
import { LastPlayedTracksModel } from "src/app/models/last-played-tracks.model";

@Injectable({
  providedIn: "root"
})
export class LastTracksService {
  constructor(private supabase: SupabaseClient) {}

  async updateLastTracksForCurrentUser(id: string): Promise<void> {
    const userId = this.supabase.auth.user()?.id;

    const { data } = await this.supabase
      .from("lastPlayedTracks")
      .select("*")
      .eq("user_id", userId);

    if (data?.length == 0) {
      await this.supabase.from("lastPlayedTracks").insert([
        {
          user_id: userId,
          track1: id,
          track2: null,
          track3: null,
          track4: null
        }
      ]);
      return;
    }

    const { track1, track2, track3 } = (data as LastPlayedTracksModel[])[0];

    await this.supabase
      .from("lastPlayedTracks")
      .update({ track1: id, track2: track1, track3: track2, track4: track3 })
      .eq("user_id", userId);
  }
}
