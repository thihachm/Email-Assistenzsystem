const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'none',
    entry: {
        background_scripts: "./src/environment.js",
        output: "./src/agents/displayAgent/index.js",
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
                },
                {
                    from: path.resolve(__dirname, "src", "agents", "displayAgent", "index.css"),
                    to: path.resolve(__dirname, "dist", "output", "index.css"),
                },
                {
                    from: path.resolve(__dirname, "src", "images"),
                    to: path.resolve(__dirname, "dist", "images"),
                },
                {
                    from: path.resolve(__dirname, "src", "experiments"),
                    to: path.resolve(__dirname, "dist", "experiments"),
                }
            ],
        }),
    ],
};
