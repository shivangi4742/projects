var del = require('del');
var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');

const rootFolder = path.join(__dirname);
const loginFolder = path.join(rootFolder, './login/dist');
const loginServerFolder = path.join(rootFolder, './server/login');
const loginSCAssetsFolder = path.join(rootFolder, './login/src/assets');
const sharedServicesFolder = path.join(rootFolder, './sharedservices/dist');
const scAssetsFolder = path.join(rootFolder, './sharedcomponents/src/assets');
const sharedComponentsFolder = path.join(rootFolder, './sharedcomponents/dist');
const loginSSFolder = path.join(rootFolder, './login/node_modules/benowservices');
const loginSCFolder = path.join(rootFolder, './login/node_modules/benowcomponents');
const loginSCSharedAssetsFolder = path.join(rootFolder, './login/src/assets/shared');
const loginSCAssetsNMFolder = path.join(rootFolder, './login/node_modules/benowcomponents/assets');
const sharedComponentsSSFolder = path.join(rootFolder, './sharedcomponents/node_modules/benowservices');

function deleteFolders(folders) {
  return del(folders);
}

gulp.task('clean:ss', function () {
  return deleteFolders([sharedComponentsSSFolder, loginSSFolder]);
});

gulp.task('clean:sc', function () {
  return deleteFolders([loginSCFolder, loginSCSharedAssetsFolder]);
});

gulp.task('clean:login', function () {
  return deleteFolders([loginServerFolder]);
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

gulp.task('copy:sclogin', function () {
  return gulp.src([sharedComponentsFolder + '/**/*'])
    .pipe(gulp.dest(loginSCFolder));
});

gulp.task('copy:login', function () {
  return gulp.src([loginFolder + '/**/*'])
    .pipe(gulp.dest(loginServerFolder));
});

gulp.task('distribute:login', function() {
  runSequence(
    'clean:login',
    'copy:login',
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
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});