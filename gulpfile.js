var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    cp = require('child_process'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _src/_scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('_src/_scss/main.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css'));
});

/**
 * Compile files from _src/_js into both _site/js (for live injecting) and site (for future jekyll builds)
 */
gulp.task('js', function(){
    return gulp.src('_src/_js/**/*.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('_site/js'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('js'));
});

/**
 * Copy files from _src/_img into both _site/img (for live injecting) and site (for future jekyll builds)
 */
gulp.task('img', function() {
    return gulp.src(['_src/_img/**/*'])
        .pipe(gulp.dest('_site/img'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('img'));
});


/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('_src/_scss/*.scss', ['sass']);
    gulp.watch('_src/_js/**/*.js', ['js']);
    gulp.watch('_src/_img/**/*', ['img']);
    gulp.watch(['*.html', '_layouts/*.html', '_includes/*.html'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('guarda', ['browser-sync', 'watch']);
gulp.task('default', ['jekyll-build', 'js', 'sass', 'img']);
