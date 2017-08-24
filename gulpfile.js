var del = require('del');
var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');

const rootFolder = path.join(__dirname);
const sharedServicesFolder = path.join(rootFolder, './sharedservices/dist')
const sharedComponentsFolder = path.join(rootFolder, './sharedcomponents/node_modules/benowservices');

function deleteFolders(folders) {
  return del(folders);
}

gulp.task('clean:ss', function () {
  return deleteFolders([sharedComponentsFolder]);
});

gulp.task('copy:sscomponents', function () {
  return gulp.src([sharedServicesFolder + '/**/*'])
    .pipe(gulp.dest(sharedComponentsFolder));
});

gulp.task('distribute:sharedservices', function () {
  runSequence(
    'clean:ss',
    'copy:sscomponents',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});


