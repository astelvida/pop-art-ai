// if (process.env.NODE_ENV !== "production") {
import { inspect } from "util";
const lines = "-------------------------------";
export const pp = (o: any, label: string = "OUTPUT", options = {}) => {
  console.log(`\n${lines}START:${label}${lines}`);
  console.log(
    inspect(o, { showHidden: false, depth: 20, colors: true, ...options })
  );
  console.log(`${lines}END:${label}${lines}-\n`);
};

export const pp2 = (o: any, label: string = "OUTPUT") => {
  // console.log(`\n${lines}START:${label}${lines}`);
  console.dir(o, { depth: 10, colors: true });
  // console.log(`${lines}-END:${label}${lines}-\n`);
};

// global.pp = pp;
// global.pp2 = pp2;
