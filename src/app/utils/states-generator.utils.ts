export const statesGeneratorUtils = (maxNumberOfStates: number) => {
  let state = 1;
  return function* generator(): Generator<number> {
    while (true) {
      if (state === maxNumberOfStates) {
        state = 0;
      }
      yield state;
      state++;
    }
  };
};
