// 配置文件
var path = require('path');

module.exports = {
	entry: {
    	app: ["webpack/hot/dev-server", "./src/main"]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	output: {
		path: "./build",
   		filename: "bundle.js"
	},
	module: {
		loaders: [{
			test: /\.(js|jsx)$/,
			exclude: /(node_modules)/,
			loader: 'babel'
		}, {
			test: /\.styl$/,
			loader: 'style!css!stylus?paths=' + path.resolve(__dirname, './node_modules/nib/lib/')
		}]
	},
	stylus: {
		import: ['nib']
	}
};
