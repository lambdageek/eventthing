import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
//import dts from "rollup-plugin-dts";
import copy from "rollup-plugin-copy-watch";
import serve from "rollup-plugin-serve";

const watching = process.env.ROLLUP_WATCH === "true";

const codeConfig = {
    treeshake: true,
    input: "src/eventthing.ts",
    output: [
        {
            dir: "wwwroot",
            format: "es",
        }
    ],
    plugins: [
        typescript(),
        copy({
            watch: watching && "static_files",
            targets: [
                {
                    src: "static_files/**/*", dest: "wwwroot",
                },
            ]
        }),
        watching && serve('wwwroot'),
    ],
};

// const dtsConfig = {
//     input: "src/eventthing.ts",
//     output: [
//         {
//             format: "es",
//             file: "dist/eventthing.d.ts",
//         }
//     ],
//     plugins: [dts()],
// }


const config = defineConfig([codeConfig,
    //dtsConfig
]);

export default config;