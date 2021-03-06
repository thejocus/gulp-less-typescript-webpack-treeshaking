
'use strict';

const config = require(`${__dirname}/project.config.json`);
const path = require('path');
const rootPath = path.resolve(`${__dirname}/..`);

console.log('PATH: '+rootPath);

module.exports = {
    entry: {
        'app'       : `${rootPath}${config.lang.ts.path}/${config.lang.ts.entry}`
    },

    output: {
        path        : `${rootPath}${config.lang.ts.dist}`,
        filename    : '[name].bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.ts$/, use: 'awesome-typescript-loader?configFileName=tsconfig.json'
            }
        ]
    },

    resolve: {
        modules     : [
            `${rootPath}/node_modules`,
            `${rootPath}${config.lang.ts.path}`
        ],
        extensions  : ['.ts', '.js']
    },
    devtool: false
};