const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        background_scripts: "./src/background_scripts/background.js",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name]/index.js"
    },
    devtool: 'source-map',
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "manifest.json"),
                    to: path.resolve(__dirname, "dist", "manifest.json"),
                }
            ],
        }),
    ],
};
