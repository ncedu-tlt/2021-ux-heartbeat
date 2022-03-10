import { ImagesFromSpoty } from "./album-by-id.model";

export interface CategoriesModel {
  categories: CategoriesItemsModel;
}

export interface CategoriesItemsModel {
  items: CategoryModel[];
}

export interface CategoryModel {
  icons: ImagesFromSpoty[];
  id: string;
  name: string;
}
