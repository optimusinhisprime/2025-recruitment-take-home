import { viteStaticCopy } from "vite-plugin-static-copy";
import framework7 from "rollup-plugin-framework7";
import { baseUrl } from "./src/data/baseUrl";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, "./src");
const PUBLIC_DIR = path.resolve(__dirname, "./public");
const BUILD_DIR = path.resolve(__dirname, "./www");
const ASSETS_DIR = path.resolve(__dirname, "./www/assets");
const ICONS_DIR = path.resolve(__dirname, "./www/icons");

export default async () => {
    return {
        // Explicitly configure environment variable handling
        envDir: process.cwd(), // Look for .env files in the root directory

        plugins: [
            framework7({ emitCss: false }),
            viteStaticCopy({
                targets: [
                    {
                        src: path.resolve(SRC_DIR, "assets/*"),
                        dest: path.resolve(BUILD_DIR, "assets"),
                    },
                    {
                        src: path.resolve(SRC_DIR, "assets/service_worker.js"),
                        dest: BUILD_DIR,
                    },
                ],
            }),
            {
                name: "edit-service-worker",
                enforce: "post",
                async closeBundle() {
                    const swPath = path.resolve(BUILD_DIR, "service_worker.js");
                    try {
                        await new Promise((resolve) =>
                            setTimeout(resolve, 10000)
                        );
                        let content = await fs.readFile(swPath, "utf8");
                        let assetsFiles = await fs.readdir(ASSETS_DIR);
                        const iconsFiles = await fs.readdir(ICONS_DIR);
                        let placeholder = "%";

                        const packageJson = JSON.parse(
                            await fs.readFile("./package.json", "utf8")
                        );
                        const appVersion = packageJson.version;
                        let oldFileNames = [];

                        for (const file of assetsFiles) {
                            // if (file.split(".")[1] != "woff2" && file.split(".")[1] != "woff") {
                            //get old file name, and put it in array to update refs later
                            const oldFileName = `${file}`;
                            // split it by . then - and get the new name
                            const newFileName = `${oldFileName.split(".")[0].split("-")[0]}.${oldFileName.split(".")[1]}`;

                            if (oldFileName != newFileName) {
                                oldFileNames.push({
                                    old: oldFileName,
                                    new: newFileName,
                                });
                                //update file name with new one
                                const filePath = path.resolve(
                                    ASSETS_DIR,
                                    `${oldFileName}`
                                );
                                await fs.rename(
                                    filePath,
                                    ASSETS_DIR + "/" + newFileName
                                );

                                //update its reference in index.html and all files in
                                const indexPath = path.resolve(
                                    BUILD_DIR,
                                    `index.html`
                                );
                                let fileContent = await fs.readFile(
                                    indexPath,
                                    "utf8"
                                );
                                fileContent = fileContent
                                    .split(oldFileName)
                                    .join(newFileName);
                                await fs.writeFile(
                                    indexPath,
                                    fileContent,
                                    "utf8"
                                );
                            }
                        }
                        console.log(oldFileNames);
                        assetsFiles = await fs.readdir(ASSETS_DIR);

                        for (const file of assetsFiles) {
                            //replace any occurence of
                            if (file.split(".")[1] == "js") {
                                const filePath = path.resolve(
                                    ASSETS_DIR,
                                    `${file}`
                                );
                                let fileContent = await fs.readFile(
                                    filePath,
                                    "utf8"
                                );
                                fileContent = fileContent
                                    .split("#$#$#$")
                                    .join(appVersion);
                                await fs.writeFile(
                                    filePath,
                                    fileContent,
                                    "utf8"
                                );
                            }

                            for (const oldFileName of oldFileNames) {
                                if (
                                    file.split(".")[1] != "woff2" &&
                                    file.split(".")[1] != "woff"
                                ) {
                                    const filePath = path.resolve(
                                        ASSETS_DIR,
                                        `${file}`
                                    );
                                    let fileContent = await fs.readFile(
                                        filePath,
                                        "utf8"
                                    );
                                    fileContent = fileContent
                                        .split(oldFileName.old)
                                        .join(oldFileName.new);
                                    await fs.writeFile(
                                        filePath,
                                        fileContent,
                                        "utf8"
                                    );
                                }
                            }

                            content = content.replace(
                                placeholder,
                                `/assets/${file}`
                            );
                            placeholder += "%";
                        }

                        for (const file of iconsFiles) {
                            content = content.replace(
                                placeholder,
                                `/icons/${file}`
                            );
                            placeholder += "%";
                        }

                        content = content.replace("%domain%", `${baseUrl}`);
                        content = content.replace("#$#$#$", `${appVersion}`);

                        content = content.replace(/%/g, "");
                        content = content.replace(/"",/g, ``);

                        await fs.writeFile(swPath, content, "utf8");
                        console.log("service-worker.js has been updated!");
                    } catch (error) {
                        if (error.code === "ENOENT") {
                            console.error(
                                `Error: File not found at ${swPath}.`
                            );
                        } else {
                            console.error(
                                "Error editing service-worker.js:",
                                error
                            );
                        }
                    }
                },
            },
        ],
        root: SRC_DIR,
        base: "",
        publicDir: PUBLIC_DIR,
        build: {
            outDir: BUILD_DIR,
            assetsInlineLimit: 0,
            emptyOutDir: true,
            rollupOptions: {
                treeshake: false,
            },
        },
        resolve: {
            alias: {
                "@": SRC_DIR,
            },
        },
        server: {
            host: true,
            port: 5500,
        },
        esbuild: {
            jsxFactory: "$jsx",
            jsxFragment: '"Fragment"',
        },
    };
};
