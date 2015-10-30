var gulp = require('gulp');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var open = require('gulp-open');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var gulpIgnore = require('gulp-ignore');
var concat = require('gulp-concat');
var prefix = require('gulp-autoprefixer');
// var bowerMain = require('bower-main');
// var rev = require('gulp-rev');
var plumber = require('gulp-plumber');

var useref = require('gulp-useref');

var Project = {
  build: { path: './build' },
  src: { path: './src' }
};

Project.src.scripts = [Project.src.path + '/scripts/**/*.js'];
Project.src.views = [Project.src.path + '/views/**/*'];
Project.src.styles = [Project.src.path + '/styles/**/*.scss'];
Project.src.mainSass = Project.src.path + '/styles/main.scss';
Project.src.fonts = Project.src.path + '/fonts/**/*';
Project.src.images = Project.src.path + '/images/**/*';
Project.src.static = [Project.src.fonts, Project.src.images];

Project.build.views = Project.build.path;
Project.build.index = Project.build.views + '/index.html';
Project.build.scripts = Project.build.path + '/scripts';
Project.build.styles = Project.build.path + '/styles';
Project.build.fonts = Project.build.path + '/fonts';
Project.build.images = Project.build.path + '/images';



var port = 8888;



 
gulp.task('server', function() {
  connect.server({
    root: Project.build.path,
    livereload: true,
    port: port
  });

  gulp.src(Project.build.index)
    // .pipe(open('', { url: 'http://localhost:' + port }));
});



gulp.task('scripts', function() {
  return gulp.src(Project.src.scripts)
    // .pipe(concat('main.concat.js'))
    .pipe(gulp.dest(Project.build.scripts))
    .pipe(connect.reload());
    // .pipe(rev.manifest())
    // .pipe(gulp.dest(app_path));
});

gulp.task('jade', function() {
  var assets = useref.assets();
  
  return gulp.src(Project.src.views)
    .pipe(plumber())
    .pipe(jade({
      locals: {
        // hahaha: true
      },
      pretty: true
    }))

    // .pipe(assets)
    // .pipe(gulpif('*.js', uglify()))
    // .pipe(gulpif('*.css', minifyCss()))
    // .pipe(assets.restore())
    // .pipe(useref())

    .pipe(gulp.dest(Project.build.views))
    .pipe(connect.reload());
});

gulp.task('sass', function () {
  gulp.src(Project.src.mainSass)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(prefix("last 3 version", "> 1%", "ie 8"))
    .pipe(gulp.dest(Project.build.styles))
    .pipe(connect.reload());
});

gulp.task('copy_static', function () {
  gulp.src(Project.src.fonts)
   .pipe(gulp.dest(Project.build.fonts));

  gulp.src(Project.src.images)
   .pipe(gulp.dest(Project.build.images));

  var js_components = [
    'jquery/dist/jquery.js',
    'perfect-scrollbar/js/perfect-scrollbar.jquery.js',
    'bxslider-4/dist/jquery.bxslider.js'
  ];

  gulp.src(js_components.map(function(i) {
    return Project.src.path + '/components/' + i;    
  })).pipe(gulp.dest(Project.build.scripts + '/components'));

});

gulp.task('watch', function() {
  watch(Project.src.views, function () { 
    gulp.run('jade');
  });
  watch(Project.src.styles, function () { 
    gulp.run('sass');
  });
  watch(Project.src.scripts, function () { 
    gulp.run('scripts');
  });
  watch(Project.src.static, function () { 
    gulp.run('copy_static');
  });
});

var DEPLOY = false;
gulp.task('deploy', function() {
  DEPLOY = true;
  gulp.run('build');
  console.log('no deploy options specified 😒');
});

gulp.task('build', ['scripts', 'sass', 'copy_static', 'jade']);

gulp.task('default', [ 'build', 'watch', 'server']);