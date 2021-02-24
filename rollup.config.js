import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import strip from "@rollup/plugin-strip";


const input = "./filesaver.ts";
const isDev = process.env.NODE_ENV === "development";

const config = [
  {
    input,
    output: {
      file: `dist/index.js`,
      format: "umd",
      // sourcemap: isDev,
      name:'filesaver'
    },
    plugins: [
      typescript({ lib: ["es5", "es6", "dom"], target: "es5" }),
      strip(),
      isDev ? null : terser(),
    ],
  },
];

export default config;
