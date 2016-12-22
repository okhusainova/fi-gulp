var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync'),
    watch = require('gulp-watch'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    imageminPngquant = require('imagemin-pngquant'),
    uglify = require('gulp-uglify'),
    eslint = require('gulp-eslint'),
    reload = browserSync.reload;

var config = {
    server: {
        baseDir: ['./dist', './', 'dist/**/*.*']
    }
};

gulp.task('lint', function () {
    return gulp.src(['js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());

});

gulp.task('copy-html', function () {
    gulp.src('./index.html')
        .pipe(gulp.dest('./dist'))
        .pipe(reload({stream: true}));
});

gulp.task('styles', function () {
    gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(autoprefixer({
                browsers: ['last 2 versions']
            }
        ))
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(reload({stream: true}));
});

gulp.task('scripts', function () {
    gulp.src('src/js/**/*.js')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write('./maps/map', {includeContent: false, sourceRoot: './src'}))
        .pipe(gulp.dest('./dist/js'))
        .pipe(reload({stream: true}));
});

gulp.task('php', function () {
    gulp.src('./index.php')
        .pipe(gulp.dest('./dist'));
});

gulp.task('images', function () {
    gulp.src('src/img/*')
        .pipe(imagemin({
                progressive: true,
                use: [imageminPngquant()]
            }
        ))
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('watch', function () {

    watch(['src/less/**/*.less'], function () {
        gulp.start('styles');
    });

    watch(['src/js/**/*.js'], function () {
        gulp.start('scripts');
    });

    watch(['./index.html'], function () {
        gulp.start('copy-html');
    });
    watch(['src/img/*'], function () {
        gulp.start('images');
    });
    watch(['js/**/*.js'], function () {
        gulp.start('lint');
    });
    watch(['./index.php'], function () {
        gulp.start('php');
    });
});


gulp.task('server', function () {
    browserSync(config);
});

gulp.task('default', ['copy-html', 'styles', 'scripts', 'images', 'lint', 'watch', 'php', 'server']);
