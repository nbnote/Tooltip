const DEV_MODE = true;
const mode = DEV_MODE ? 'development' : 'production';

const webpack = require('webpack');

module.exports = {
    mode: mode,
    entry: `./src/main.ts`,
    output: {
        path: `${__dirname}/dist`,
        filename: 'main.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jQuery'
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            },
            {
                test: /\.scss/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            sourceMap: DEV_MODE,
                            importLoaders: 2
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: DEV_MODE
                        }
                    }
                ]
            },{
                test: /\.(gif|png|jpg|eot|wof|woff|woff2|ttf|svg)$/,
                loader: 'url-loader'
            }
        ]
    },
    resolve: {
        extensions: [
            '.ts', '.js'
        ]
    },
    devServer: {
        contentBase: 'dist',
        open: true
    }
}