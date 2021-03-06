// 配置文件
var path = require('path');

module.exports = {
	entry: {
    	app: "./src/main"
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	devServer:{
		port: 3001
	},
	output: {
		path: "./build",
   		filename: "bundle.js"
	},
	module: {
		loaders: [{
			test: /\.(js|jsx)$/,
			exclude: /(node_modules)/,
			loader: 'babel',
			query: {
				optional: ['runtime']
			}
		}, {
			test: /\.styl$/,
			loader: 'style!css!stylus?paths=' + path.resolve(__dirname, './node_modules/nib/lib/')
		}]
	},
	stylus: {
		import: ['nib']
	}
};
