var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    cp = require('child_process'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence');

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
gulp.task('jekyll-rebuild', function () {
    browserSync.reload();
    runSequence('jekyll-build', ['js', 'js:vendor', 'sass', 'img']);
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'site'
        }
    });
});

/**
 * Compile files from _assets/_scss into site/css (for live injecting)
 */
gulp.task('sass', function () {
    return gulp.src('_assets/_scss/main.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('site/css'))
        .pipe(browserSync.reload({stream:true}));
});

/**
* Compile files from _assets/_js into site/js (for live injecting)
 */
gulp.task('js', function(){
    return gulp.src('_assets/_js/**/*.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('site/js'))
        .pipe(browserSync.reload({stream:true}));
});

/**
* Compile files from _assets/_vendor into site/js, site/css ecc (for live injecting)
 */
gulp.task('js:vendor', function(){
    return gulp.src([
            '_assets/_vendor/cookies-enabler/cookies-enabler.min.js'
        ])
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('site/js'))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Copy files from _assets/_img into site/img (for live injecting)
 */
gulp.task('img', function() {
    return gulp.src(['_assets/_img/**/*'])
        .pipe(gulp.dest('site/img'))
        .pipe(browserSync.reload({stream:true}));
});


/**
 * Watch files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('_assets/_scss/*.scss', ['sass']);
    gulp.watch('_assets/_js/**/*.js', ['js']);
    gulp.watch('_assets/_img/**/*', ['img']);
    gulp.watch(['_src/*.html', '_src/_layouts/*.html', '_src/_includes/*.html'], ['jekyll-rebuild']);
});

gulp.task('build', function(callback) {
    runSequence('jekyll-build', ['js', 'js:vendor', 'sass', 'img']);
});



/**
 * Default task, running just `gulp` will compile the sass, compile the jekyll site
 */

gulp.task('default', ['build']);

/**
 * Running just `gulp serve` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */

gulp.task('serve', function(callback) {
    runSequence('jekyll-build', ['js', 'js:vendor', 'sass', 'img', 'browser-sync'], 'watch');
});
