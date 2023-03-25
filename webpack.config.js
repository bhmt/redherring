const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
	mode: "production",
	entry: {
		redherring: path.resolve(__dirname, "src", "redherring.js"),
		ui: path.resolve(__dirname, "src", "ui.js"),
	},
	output: {
		path: path.join(__dirname, "dist"),
		filename: "[name].js",
	},
	resolve: {
		extensions: [".js"],
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				options: {
					presets: [
						["@babel/preset-env", { "targets": { "esmodules": true } }],
					],
				},
			},
		],
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: ".", to: ".", context: "public" }]
		}),
	],
};
