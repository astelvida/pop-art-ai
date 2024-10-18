// if (process.env.NODE_ENV !== "production") {
import { inspect } from "util";

export const pp = (o, options = {}) => {
  console.log('\n-----------------------------------------------------------\n')
  console.log(
      inspect(o, {
      showHidden: false,
      depth: 20,
      colors: true,
      // etc.
      ...options,
    })
  );
};

export const pp2 = (o) => console.dir(o, { depth: 10, colors: true });


global.pp = pp;
global.pp2 = pp2;
