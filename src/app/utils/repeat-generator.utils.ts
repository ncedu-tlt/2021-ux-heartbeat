export const repeatGeneratorUtils = () => {
  let state = 1;
  return function* generator(): Generator<number> {
    while (true) {
      if (state === 3) {
        state = 0;
      }
      yield state;
      state++;
    }
  };
};
