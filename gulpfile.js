// gulp configuration file
var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var configData = Object.create(webpackConfig);
var del = require('del');
var fork = require('child_process').fork;
//var ftp = require('vinyl-ftp');
var minimist = require('minimist');

// set default task to developer build
gulp.task("default", ["dev"]);

gulp.task("clean", function (callback) {
    del(["build/**", "!build"]).then(callback);
});

gulp.task("dev", function () {
    var endpoints = {
        flow: {
            x: 'y',
        },
        bh: {
            x: 'y',
        }
    };
    var knownOptions = {
        string: ['flow', 'bh'],
        alias: {
            'flow': 'f',
            'bh': 'b'
        },
        default: {
            flow: 'local',
            bh: 'local'
        }
    };
    var options = minimist(process.argv.slice(2), knownOptions);
    gutil.log(`Flow: ${endpoints.flow[options.flow]}`, `Bh: ${endpoints.bh[options.bh]}`, options);
    configData.devtool = "eval";
    configData.debug = true;

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(configData), {
        stats: {
            colors: true
        },
        proxy: {
            '/xxx': {
                target: endpoints.flow[options.flow],
                secure: false
            },
            '/yyy/*': {
                target: endpoints.bh[options.bh],
                secure: false  
            }
        }
    }).listen(8080, "localhost", function (err) {
        if (err) throw new gutil.PluginError("dev-server", err);
        gutil.log("[dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    });
});
//
// production build configuration
//
gulp.task("production", function (callback) {
    configData.plugins = configData.plugins.concat(
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    );

    webpack(configData, function (err, stats) {
        if (err) throw new gutil.PluginError("production", err);
        gutil.log("[production]", stats.toString({
            colors: true
        }));
        callback();
    });
});

/*gulp.task('deploy', ['production'], function(callback) {
    var conn = ftp.create({
        host: '127.0.0.1',
        port: 80,
        user: 'anonymous',
        password: 'password',
        parallel: 5,
        log: gutil.log
    });
    var globs = [
        'build/**',
        'index.html'
    ];
    gulp.src(['./build/**'], {base: './build/', buffer: false})
        .pipe(conn.dest('/payments'));
    gulp.src(['index.html'], {base: '.', buffer: false})
        .pipe(conn.dest('/payments'));
    callback(null);
});*/

//
// selenium build configuration
//
gulp.task("test", function () {
    // todo: complete build script
    console.error("Not implemented yet!");
});
