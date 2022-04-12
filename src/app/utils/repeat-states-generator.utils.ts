import { RepeatStateEnum } from "../models/repeat-state.enum";

export const repeatStatesGeneratorUtils = () => {
  let state = RepeatStateEnum.PLAYLIST_REPEAT;
  return function* generator(): Generator<RepeatStateEnum> {
    while (true) {
      if (state > 2) {
        state = RepeatStateEnum.NO_REPEAT;
      }
      yield state;
      state++;
    }
  };
};
