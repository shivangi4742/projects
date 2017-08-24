var del = require('del');
var gulp = require('gulp');
var path = require('path');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');

const rootFolder = path.join(__dirname);
const loginFolder = path.join(rootFolder, './login/dist');
const loginServerFolder = path.join(rootFolder, './server/login');
const loginIndexFile = path.join(rootFolder, './login/dist/index.html');
const loginSCAssetsFolder = path.join(rootFolder, './login/src/assets');
const sharedServicesFolder = path.join(rootFolder, './sharedservices/dist');
const loginAssetsFolder = path.join(rootFolder, './login/dist/assets/login');
const scAssetsFolder = path.join(rootFolder, './sharedcomponents/src/assets');
const serverLoginAssetsFolder = path.join(rootFolder, './server/assets/login');
const sharedComponentsFolder = path.join(rootFolder, './sharedcomponents/dist');
const serverLoginIndexFile = path.join(rootFolder, './server/login/index.html');
const serverSharedAssetsFolder = path.join(rootFolder, './server/assets/shared');
const loginSSFolder = path.join(rootFolder, './login/node_modules/benowservices');
const loginSCFolder = path.join(rootFolder, './login/node_modules/benowcomponents');
const loginSCSharedAssetsFolder = path.join(rootFolder, './login/src/assets/shared');
const scSharedAssetsFolder = path.join(rootFolder, './sharedcomponents/src/assets/shared');
const loginSCAssetsNMFolder = path.join(rootFolder, './login/node_modules/benowcomponents/assets');
const sharedComponentsSSFolder = path.join(rootFolder, './sharedcomponents/node_modules/benowservices');

function deleteFolders(folders) {
  return del(folders);
}

gulp.task('clean:ss', function () {
  return deleteFolders([sharedComponentsSSFolder, loginSSFolder]);
});

gulp.task('clean:sc', function () {
  return deleteFolders([loginSCFolder, loginSCSharedAssetsFolder, serverSharedAssetsFolder]);
});

gulp.task('clean:login', function () {
  return deleteFolders([loginServerFolder]);
});

gulp.task('delete:index', function () {
  return deleteFolders([serverLoginIndexFile]);
});

gulp.task('copy:sscomponents', function () {
  return gulp.src([sharedServicesFolder + '/**/*'])
    .pipe(gulp.dest(sharedComponentsSSFolder));
});

gulp.task('copy:sslogin', function () {
  return gulp.src([sharedServicesFolder + '/**/*'])
    .pipe(gulp.dest(loginSSFolder));
});

gulp.task('copy:scAssets', function () {
  return gulp.src([scAssetsFolder + '/**/*'])
    .pipe(gulp.dest(loginSCAssetsFolder));
});

gulp.task('copy:scNMAssets', function () {
  return gulp.src([scAssetsFolder + '/**/*'])
    .pipe(gulp.dest(loginSCAssetsNMFolder));
});

gulp.task('copy:scServerAssets', function () {
  return gulp.src([scSharedAssetsFolder + '/**/*'])
    .pipe(gulp.dest(serverSharedAssetsFolder));
});

gulp.task('copy:sclogin', function () {
  return gulp.src([sharedComponentsFolder + '/**/*'])
    .pipe(gulp.dest(loginSCFolder));
});

gulp.task('copy:login', function () {
  return gulp.src([loginFolder + '/**/*'])
    .pipe(gulp.dest(loginServerFolder));
});

gulp.task('copy:loginAssets', function () {
  return gulp.src([loginAssetsFolder + '/**/*'])
    .pipe(gulp.dest(serverLoginAssetsFolder));
});

gulp.task('change:index', function() {
  return gulp.src([loginIndexFile])
    .pipe(replace('<base href="/">', '<base href="/login/">'))
    .pipe(gulp.dest(loginServerFolder));
});

gulp.task('distribute:login', function() {
  runSequence(
    'clean:login',
    'copy:login',
    'copy:loginAssets',
    'delete:index',
    'change:index',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});

gulp.task('distribute:sharedservices', function () {
  runSequence(
    'clean:ss',
    'copy:sscomponents',
    'copy:sslogin',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});

gulp.task('distribute:sharedcomponents', function () {
  runSequence(
    'clean:sc',
    'copy:sclogin',
    'copy:scAssets',
    'copy:scNMAssets',
    'copy:scServerAssets',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});