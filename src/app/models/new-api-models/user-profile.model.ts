import { Followers, ImagesFromSpoty } from "./album-by-id.model";

export interface UserProfileModel {
  country: string;
  display_name: string;
  email: string;
  followers: Followers[];
  id: string;
  images: ImagesFromSpoty[];
  product: string;
}
