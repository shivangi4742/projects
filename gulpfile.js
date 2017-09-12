var del = require('del');
var gulp = require('gulp');
var path = require('path');
var run = require('gulp-run');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');

const rootFolder = path.join(__dirname);
const serverFolder = path.join(rootFolder, '/server');
const loginRootFolder = path.join(rootFolder, '/login');
const loginFolder = path.join(rootFolder, '/login/dist');
const loginServerFolder = path.join(rootFolder, '/server/login');
const ngoconsoleRootFolder = path.join(rootFolder, '/ngoconsole');
const ngoconsoleFolder = path.join(rootFolder, '/ngoconsole/dist');
const paymentlinkRootFolder = path.join(rootFolder, '/paymentlink');
const paymentlinkFolder = path.join(rootFolder, '/paymentlink/dist');
const loginIndexFile = path.join(rootFolder, '/login/dist/index.html');
const loginSCAssetsFolder = path.join(rootFolder, '/login/src/assets');
const sharedServicesRootFolder = path.join(rootFolder, '/sharedservices');
const ngoconsoleServerFolder = path.join(rootFolder, '/server/ngoconsole');
const sharedServicesFolder = path.join(rootFolder, '/sharedservices/dist');
const loginAssetsFolder = path.join(rootFolder, '/login/dist/assets/login');
const paymentlinkServerFolder = path.join(rootFolder, '/server/paymentlink');
const scAssetsFolder = path.join(rootFolder, '/sharedcomponents/src/assets');
const sharedComponentsRootFolder = path.join(rootFolder, '/sharedcomponents');
const serverLoginAssetsFolder = path.join(rootFolder, '/server/assets/login');
const sharedComponentsFolder = path.join(rootFolder, '/sharedcomponents/dist');
const serverLoginIndexFile = path.join(rootFolder, '/server/login/index.html');
const serverSharedAssetsFolder = path.join(rootFolder, '/server/assets/shared');
const ngoconsoleSCAssetsFolder = path.join(rootFolder, '/ngoconsole/src/assets');
const loginSSFolder = path.join(rootFolder, '/login/node_modules/benowservices');
const ngoconsoleIndexFile = path.join(rootFolder, '/ngoconsole/dist/index.html');
const paymentlinkIndexFile = path.join(rootFolder, '/paymentlink/dist/index.html');
const loginSCFolder = path.join(rootFolder, '/login/node_modules/benowcomponents');
const paymentlinkSCAssetsFolder = path.join(rootFolder, '/paymentlink/src/assets');
const serverNGOConsoleAssetsFolder = path.join(rootFolder, '/server/assets/ngoconsole');
const serverNGOConsoleIndexFile = path.join(rootFolder, '/server/ngoconsole/index.html');
const serverPaymentLinkAssetsFolder = path.join(rootFolder, '/server/assets/paymentlink');
const ngoconsoleAssetsFolder = path.join(rootFolder, '/nogconsole/dist/assets/ngoconsole');
const ngoConsoleSSFolder = path.join(rootFolder, '/ngoconsole/node_modules/benowservices');
const serverPaymentLinkIndexFile = path.join(rootFolder, '/server/paymentlink/index.html');
const paymentLinkSSFolder = path.join(rootFolder, '/paymentlink/node_modules/benowservices');
const ngoConsoleSCFolder = path.join(rootFolder, '/ngoconsole/node_modules/benowcomponents');
const paymentlinkAssetsFolder = path.join(rootFolder, '/paymentlink/dist/assets/paymentlink');
const paymentLinkSCFolder = path.join(rootFolder, '/paymentlink/node_modules/benowcomponents');
const loginSCSharedAssetsFolder = path.join(rootFolder, '/login/src/assets/shared');
const scSharedAssetsFolder = path.join(rootFolder, '/sharedcomponents/src/assets/shared');
const loginSCAssetsNMFolder = path.join(rootFolder, '/login/node_modules/benowcomponents/assets');
const sharedComponentsSSFolder = path.join(rootFolder, '/sharedcomponents/node_modules/benowservices');
const ngoconsoleSCAssetsNMFolder = path.join(rootFolder, '/ngoconsole/node_modules/benowcomponents/assets');
const paymentlinkSCAssetsNMFolder = path.join(rootFolder, '/paymentlink/node_modules/benowcomponents/assets');

function deleteFolders(folders) {
  return del(folders);
}

gulp.task('clean:ss', function () {
  return deleteFolders([sharedComponentsSSFolder, loginSSFolder, ngoConsoleSSFolder, paymentLinkSSFolder]);
});

gulp.task('clean:sc', function () {
  return deleteFolders([loginSCFolder, loginSCSharedAssetsFolder, serverSharedAssetsFolder, ngoConsoleSCFolder, paymentLinkSCFolder]);
});

gulp.task('clean:ngoconsole', function () {
  return deleteFolders([ngoconsoleServerFolder]);
});

gulp.task('clean:paymentlink', function () {
  return deleteFolders([paymentlinkServerFolder]);
});

gulp.task('clean:login', function () {
  return deleteFolders([loginServerFolder]);
});

gulp.task('delete:indexlogin', function () {
  return deleteFolders([serverLoginIndexFile]);
});

gulp.task('delete:indexngoconsole', function () {
  return deleteFolders([serverNGOConsoleIndexFile]);
});

gulp.task('delete:indexpaymentlink', function () {
  return deleteFolders([serverPaymentLinkIndexFile]);
});

gulp.task('copy:sscomponents', function () {
  return gulp.src([sharedServicesFolder + '/**/*'])
    .pipe(gulp.dest(sharedComponentsSSFolder));
});

gulp.task('copy:sslogin', function () {
  return gulp.src([sharedServicesFolder + '/**/*'])
    .pipe(gulp.dest(loginSSFolder));
});

gulp.task('copy:ssngoconsole', function () {
  return gulp.src([sharedServicesFolder + '/**/*'])
    .pipe(gulp.dest(ngoConsoleSSFolder));
});

gulp.task('copy:sspaymentlink', function () {
  return gulp.src([sharedServicesFolder + '/**/*'])
    .pipe(gulp.dest(paymentLinkSSFolder));
});

gulp.task('copy:scAssetsLogin', function () {
  return gulp.src([scAssetsFolder + '/**/*'])
    .pipe(gulp.dest(loginSCAssetsFolder));
});

gulp.task('copy:scAssetsNGOConsole', function () {
  return gulp.src([scAssetsFolder + '/**/*'])
    .pipe(gulp.dest(ngoconsoleSCAssetsFolder));
});

gulp.task('copy:scAssetsPaymentLink', function () {
  return gulp.src([scAssetsFolder + '/**/*'])
    .pipe(gulp.dest(paymentlinkSCAssetsFolder));
});

gulp.task('copy:scNMAssetsLogin', function () {
  return gulp.src([scAssetsFolder + '/**/*'])
    .pipe(gulp.dest(loginSCAssetsNMFolder));
});

gulp.task('copy:scNMAssetsNGOConsole', function () {
  return gulp.src([scAssetsFolder + '/**/*'])
    .pipe(gulp.dest(ngoconsoleSCAssetsNMFolder));
});

gulp.task('copy:scNMAssetsPaymentLink', function () {
  return gulp.src([scAssetsFolder + '/**/*'])
    .pipe(gulp.dest(paymentlinkSCAssetsNMFolder));
});

gulp.task('copy:scServerAssets', function () {
  return gulp.src([scSharedAssetsFolder + '/**/*'])
    .pipe(gulp.dest(serverSharedAssetsFolder));
});

gulp.task('copy:sclogin', function () {
  return gulp.src([sharedComponentsFolder + '/**/*'])
    .pipe(gulp.dest(loginSCFolder));
});

gulp.task('copy:scngoconsole', function () {
  return gulp.src([sharedComponentsFolder + '/**/*'])
    .pipe(gulp.dest(ngoConsoleSCFolder));
});

gulp.task('copy:scpaymentlink', function () {
  return gulp.src([sharedComponentsFolder + '/**/*'])
    .pipe(gulp.dest(paymentLinkSCFolder));
});

gulp.task('copy:login', function () {
  return gulp.src([loginFolder + '/**/*'])
    .pipe(gulp.dest(loginServerFolder));
});

gulp.task('copy:ngoconsole', function () {
  return gulp.src([ngoconsoleFolder + '/**/*'])
    .pipe(gulp.dest(ngoconsoleServerFolder));
});

gulp.task('copy:paymentlink', function () {
  return gulp.src([paymentlinkFolder + '/**/*'])
    .pipe(gulp.dest(paymentlinkServerFolder));
});

gulp.task('copy:loginAssets', function () {
  return gulp.src([loginAssetsFolder + '/**/*'])
    .pipe(gulp.dest(serverLoginAssetsFolder));
});

gulp.task('copy:ngoconsoleAssets', function () {
  return gulp.src([ngoconsoleAssetsFolder + '/**/*'])
    .pipe(gulp.dest(serverNGOConsoleAssetsFolder));
});

gulp.task('copy:paymentlinkAssets', function () {
  return gulp.src([paymentlinkAssetsFolder + '/**/*'])
    .pipe(gulp.dest(serverPaymentLinkAssetsFolder));
});

gulp.task('change:indexlogin', function() {
  return gulp.src([loginIndexFile])
    .pipe(replace('<base href="/">', '<base href="/login/">'))
    .pipe(gulp.dest(loginServerFolder));
});

gulp.task('change:indexngoconsole', function() {
  return gulp.src([ngoconsoleIndexFile])
    .pipe(replace('<base href="/">', '<base href="/ngo/">'))
    .pipe(gulp.dest(ngoconsoleServerFolder));
});

gulp.task('change:indexpaymentlink', function() {
  return gulp.src([paymentlinkIndexFile])
    .pipe(replace('<base href="/">', '<base href="/ppl/">'))
    .pipe(gulp.dest(paymentlinkServerFolder));
});

gulp.task('distribute:login', function() {
  runSequence(
    'clean:login',
    'copy:login',
    'copy:loginAssets',
    'delete:indexlogin',
    'change:indexlogin',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});

gulp.task('distribute:ngoconsole', function() {
  runSequence(
    'clean:ngoconsole',
    'copy:ngoconsole',
    'copy:ngoconsoleAssets',
    'delete:indexngoconsole',
    'change:indexngoconsole',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});

gulp.task('distribute:paymentlink', function() {
  runSequence(
    'clean:paymentlink',
    'copy:paymentlink',
    'copy:paymentlinkAssets',
    'delete:indexpaymentlink',
    'change:indexpaymentlink',
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
    'copy:ssngoconsole',
    'copy:sspaymentlink',
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
    'copy:scngoconsole',
    'copy:scpaymentlink',
    'copy:scAssetsLogin',
    'copy:scAssetsNGOConsole',
    'copy:scAssetsPaymentLink',
    'copy:scNMAssetsLogin',
    'copy:scNMAssetsNGOConsole',
    'copy:scNMAssetsPaymentLink',
    'copy:scServerAssets',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});

gulp.task('default', function () {
  runSequence(
    'install:sharedservices',
    'build:sharedservices',
    'install:sharedcomponents',
    'build:sharedcomponents',
    'install:login',
    'build:login',
    'install:ngoconsole',
    'build:ngoconsole',
    'install:paymentlink',
    'build:paymentlink',
    'build:success',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});

gulp.task('build:success', function() {
  process.chdir(serverFolder);
  return run('npm install').exec();
});

gulp.task('install:sharedservices', function() {
  process.chdir(sharedServicesRootFolder);
  return run('npm install').exec();
});

gulp.task('build:sharedservices', function() {
  process.chdir(sharedServicesRootFolder);
  return run('npm run build').exec();
});

gulp.task('install:sharedcomponents', function() {
  process.chdir(sharedComponentsRootFolder);
  return run('npm install').exec();
});

gulp.task('build:sharedcomponents', function() {
  process.chdir(sharedComponentsRootFolder);
  return run('npm run build').exec();
});

gulp.task('install:ngoconsole', function() {
  process.chdir(ngoconsoleRootFolder);
  return run('npm install').exec();
});

gulp.task('install:paymentlink', function() {
  process.chdir(paymentlinkRootFolder);
  return run('npm install').exec();
});

gulp.task('install:login', function() {
  process.chdir(loginRootFolder);
  return run('npm install').exec();
});

gulp.task('build:login', function() {
  process.chdir(loginRootFolder);
  return run('npm run build').exec();
});

gulp.task('build:ngoconsole', function() {
  process.chdir(ngoconsoleRootFolder);
  return run('npm run build').exec();
});

gulp.task('build:paymentlink', function() {
  process.chdir(paymentlinkRootFolder);
  return run('npm run build').exec();
});
