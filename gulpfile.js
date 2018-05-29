var del = require('del');
var gulp = require('gulp');
var path = require('path');
var run = require('gulp-run');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');

const rootFolder = path.join(__dirname);
const zgRootFolder = path.join(rootFolder, '/zg');
const buyRootFolder = path.join(rootFolder, '/buy');
const payerRootFolder = path.join(rootFolder, '/payer');
const newbizRootFolder = path.join(rootFolder, '/newbiz');
const mglRootFolder = path.join(rootFolder, '/mgl');
const zgFolder = path.join(rootFolder, '/zg/dist');
const buyFolder = path.join(rootFolder, '/buy/dist');
const payerFolder = path.join(rootFolder, '/payer/dist');
const newbizFolder = path.join(rootFolder, '/newbiz/dist');
const mglFolder = path.join(rootFolder, '/mgl/dist');
const serverFolder = path.join(rootFolder, '/server');
const loginRootFolder = path.join(rootFolder, '/login');
const loginFolder = path.join(rootFolder, '/login/dist');
const zgServerFolder = path.join(rootFolder, '/server/zg');
const buyServerFolder = path.join(rootFolder, '/server/buy');
const payerServerFolder = path.join(rootFolder, '/server/payer');
const newbizServerFolder = path.join(rootFolder, '/server/newbiz');
const mglServerFolder = path.join(rootFolder, '/server/mgl');
const mybizServerFolder = path.join(rootFolder, '/server/mybiz');
const loginServerFolder = path.join(rootFolder, '/server/login');
const ngoconsoleRootFolder = path.join(rootFolder, '/ngoconsole');
const zgSCAssetsFolder = path.join(rootFolder, '/zg/src/assets');
const buySCAssetsFolder = path.join(rootFolder, '/buy/src/assets');
const payerSCAssetsFolder = path.join(rootFolder, '/payer/src/assets');
const newbizSCAssetsFolder = path.join(rootFolder, '/newbiz/src/assets');
const mglSCAssetsFolder = path.join(rootFolder, '/mgl/src/assets');
const zgIndexFile = path.join(rootFolder, '/zg/dist/index.html');
const buyIndexFile = path.join(rootFolder, '/buy/dist/index.html');
const payerIndexFile = path.join(rootFolder, '/payer/dist/index.html');
const newbizIndexFile = path.join(rootFolder, '/newbiz/dist/index.html');
const mglIndexFile = path.join(rootFolder, '/mgl/dist/index.html');
const ngoconsoleFolder = path.join(rootFolder, '/ngoconsole/dist');
const paymentlinkRootFolder = path.join(rootFolder, '/paymentlink');
const paymentlinkFolder = path.join(rootFolder, '/paymentlink/dist');
const zgAssetsFolder = path.join(rootFolder, '/zg/dist/assets/zg');
const buyAssetsFolder = path.join(rootFolder, '/buy/dist/assets/buy');
const payerAssetsFolder = path.join(rootFolder, '/payer/dist/assets/payer');
const newbizAssetsFolder = path.join(rootFolder, '/newbiz/dist/assets/newbiz');
const mglAssetsFolder = path.join(rootFolder, '/mgl/dist/assets/mgl');
const loginIndexFile = path.join(rootFolder, '/login/dist/index.html');
const loginSCAssetsFolder = path.join(rootFolder, '/login/src/assets');
const serverZGAssetsFolder = path.join(rootFolder, '/server/assets/zg');
const serverBuyAssetsFolder = path.join(rootFolder, '/server/assets/buy');
const serverPayerAssetsFolder = path.join(rootFolder, '/server/assets/payer');
const serverNewBizAssetsFolder = path.join(rootFolder, '/server/assets/newbiz');
const serverMGLAssetsFolder = path.join(rootFolder, '/server/assets/mgl');
const sharedServicesRootFolder = path.join(rootFolder, '/sharedservices');
const serverZGIndexFile = path.join(rootFolder, '/server/zg/index.html');
const serverBuyIndexFile = path.join(rootFolder, '/server/buy/index.html');
const serverPayerIndexFile = path.join(rootFolder, '/server/payer/index.html');
const serverNewBizIndexFile = path.join(rootFolder, '/server/newbiz/index.html');
const serverMGLIndexFile = path.join(rootFolder, '/server/mgl/index.html');
const ngoconsoleTransFolder = path.join(rootFolder, '/ngoconsole/src/app');
const mybizAssetsFolder = path.join(rootFolder, '/mybiz/src/assets/mybiz');
const ngoconsoleServerFolder = path.join(rootFolder, '/server/ngoconsole');
const sharedServicesFolder = path.join(rootFolder, '/sharedservices/dist');
const loginAssetsFolder = path.join(rootFolder, '/login/dist/assets/login');
const zgSSFolder = path.join(rootFolder, '/zg/node_modules/benowservices');
const buySSFolder = path.join(rootFolder, '/buy/node_modules/benowservices');
const payerSSFolder = path.join(rootFolder, '/payer/node_modules/benowservices');
const newbizSSFolder = path.join(rootFolder, '/newbiz/node_modules/benowservices');
const mglSSFolder = path.join(rootFolder, '/mgl/node_modules/benowservices');
const paymentlinkServerFolder = path.join(rootFolder, '/server/paymentlink');
const scAssetsFolder = path.join(rootFolder, '/sharedcomponents/src/assets');
const sharedComponentsRootFolder = path.join(rootFolder, '/sharedcomponents');
const serverLoginAssetsFolder = path.join(rootFolder, '/server/assets/login');
const serverMyBizAssetsFolder = path.join(rootFolder, '/server/assets/mybiz');
const sharedComponentsFolder = path.join(rootFolder, '/sharedcomponents/dist');
const serverLoginIndexFile = path.join(rootFolder, '/server/login/index.html');
const serverMyBizIndexFile = path.join(rootFolder, '/server/mybiz/index.html');
const zgSCFolder = path.join(rootFolder, '/zg/node_modules/benowcomponents');
const buySCFolder = path.join(rootFolder, '/buy/node_modules/benowcomponents');
const payerSCFolder = path.join(rootFolder, '/payer/node_modules/benowcomponents');
const newbizSCFolder = path.join(rootFolder, '/newbiz/node_modules/benowcomponents');
const mglSCFolder = path.join(rootFolder, '/mgl/node_modules/benowcomponents');
const serverSharedAssetsFolder = path.join(rootFolder, '/server/assets/shared');
const ngoconsoleSCAssetsFolder = path.join(rootFolder, '/ngoconsole/src/assets');
const loginSSFolder = path.join(rootFolder, '/login/node_modules/benowservices');
const ngoconsoleIndexFile = path.join(rootFolder, '/ngoconsole/dist/index.html');
const paymentlinkIndexFile = path.join(rootFolder, '/paymentlink/dist/index.html');
const loginSCFolder = path.join(rootFolder, '/login/node_modules/benowcomponents');
const paymentlinkSCAssetsFolder = path.join(rootFolder, '/paymentlink/src/assets');
const ngoconsoleTransFile = path.join(rootFolder, '/ngoconsole/src/app/app.module.ts');
const serverNGOConsoleAssetsFolder = path.join(rootFolder, '/server/assets/ngoconsole');
const serverNGOConsoleIndexFile = path.join(rootFolder, '/server/ngoconsole/index.html');
const serverPaymentLinkAssetsFolder = path.join(rootFolder, '/server/assets/paymentlink');
const ngoconsoleAssetsFolder = path.join(rootFolder, '/ngoconsole/dist/assets/ngoconsole');
const ngoConsoleSSFolder = path.join(rootFolder, '/ngoconsole/node_modules/benowservices');
const serverPaymentLinkIndexFile = path.join(rootFolder, '/server/paymentlink/index.html');
const paymentLinkSSFolder = path.join(rootFolder, '/paymentlink/node_modules/benowservices');
const ngoConsoleSCFolder = path.join(rootFolder, '/ngoconsole/node_modules/benowcomponents');
const paymentlinkAssetsFolder = path.join(rootFolder, '/paymentlink/dist/assets/paymentlink');
const zgSCAssetsNMFolder = path.join(rootFolder, '/zg/node_modules/benowcomponents/assets');
const buySCAssetsNMFolder = path.join(rootFolder, '/buy/node_modules/benowcomponents/assets');
const payerSCAssetsNMFolder = path.join(rootFolder, '/payer/node_modules/benowcomponents/assets');
const newbizSCAssetsNMFolder = path.join(rootFolder, '/newbiz/node_modules/benowcomponents/assets');
const mglSCAssetsNMFolder = path.join(rootFolder, '/mgl/node_modules/benowcomponents/assets');
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
  return deleteFolders([sharedComponentsSSFolder, loginSSFolder, ngoConsoleSSFolder, paymentLinkSSFolder, mglSSFolder, zgSSFolder, newbizSSFolder,
    buySSFolder, payerSSFolder]);
});

gulp.task('clean:sc', function () {
  return deleteFolders([loginSCFolder, loginSCSharedAssetsFolder, serverSharedAssetsFolder, ngoConsoleSCFolder, paymentLinkSCFolder, 
    mglSCFolder, zgSCFolder, buySCFolder, newbizSCFolder, payerSCFolder]);
});

gulp.task('clean:zg', function () {
  return deleteFolders([zgServerFolder]);
});

gulp.task('clean:buy', function () {
  return deleteFolders([buyServerFolder]);
});

gulp.task('clean:payer', function () {
  return deleteFolders([payerServerFolder]);
});

gulp.task('clean:newbiz', function () {
  return deleteFolders([newbizServerFolder]);
});

gulp.task('clean:mgl', function () {
  return deleteFolders([mglServerFolder]);
});

gulp.task('clean:mybiz', function () {
  return deleteFolders([mybizServerFolder]);
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

gulp.task('delete:indexmgl', function () {
  return deleteFolders([serverMGLIndexFile]);
});

gulp.task('delete:indexzg', function () {
  return deleteFolders([serverZGIndexFile]);
});

gulp.task('delete:indexbuy', function () {
  return deleteFolders([serverBuyIndexFile]);
});

gulp.task('delete:indexpayer', function () {
  return deleteFolders([serverPayerIndexFile]);
});

gulp.task('delete:indexnewbiz', function () {
  return deleteFolders([serverNewBizIndexFile]);
});

gulp.task('delete:indexmybiz', function () {
  return deleteFolders([serverMyBizIndexFile]);
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

gulp.task('copy:sszg', function () {
  return gulp.src([sharedServicesFolder + '/**/*'])
    .pipe(gulp.dest(zgSSFolder));
});

gulp.task('copy:ssbuy', function () {
  return gulp.src([sharedServicesFolder + '/**/*'])
    .pipe(gulp.dest(buySSFolder));
});

gulp.task('copy:sspayer', function () {
  return gulp.src([sharedServicesFolder + '/**/*'])
    .pipe(gulp.dest(payerSSFolder));
});

gulp.task('copy:ssnewbiz', function () {
  return gulp.src([sharedServicesFolder + '/**/*'])
    .pipe(gulp.dest(newbizSSFolder));
});

gulp.task('copy:ssmgl', function () {
  return gulp.src([sharedServicesFolder + '/**/*'])
    .pipe(gulp.dest(mglSSFolder));
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

gulp.task('copy:scAssetsZG', function () {
  return gulp.src([scAssetsFolder + '/**/*'])
    .pipe(gulp.dest(zgSCAssetsFolder));
});

gulp.task('copy:scAssetsBuy', function () {
  return gulp.src([scAssetsFolder + '/**/*'])
    .pipe(gulp.dest(buySCAssetsFolder));
});

gulp.task('copy:scAssetsPayer', function () {
  return gulp.src([scAssetsFolder + '/**/*'])
    .pipe(gulp.dest(payerSCAssetsFolder));
});

gulp.task('copy:scAssetsNewBiz', function () {
  return gulp.src([scAssetsFolder + '/**/*'])
    .pipe(gulp.dest(newbizSCAssetsFolder));
});

gulp.task('copy:scAssetsMGL', function () {
  return gulp.src([scAssetsFolder + '/**/*'])
    .pipe(gulp.dest(mglSCAssetsFolder));
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

gulp.task('copy:scNMAssetsZG', function () {
  return gulp.src([scAssetsFolder + '/**/*'])
    .pipe(gulp.dest(zgSCAssetsNMFolder));
});

gulp.task('copy:scNMAssetsBuy', function () {
  return gulp.src([scAssetsFolder + '/**/*'])
    .pipe(gulp.dest(buySCAssetsNMFolder));
});

gulp.task('copy:scNMAssetsPayer', function () {
  return gulp.src([scAssetsFolder + '/**/*'])
    .pipe(gulp.dest(payerSCAssetsNMFolder));
});

gulp.task('copy:scNMAssetsNewBiz', function () {
  return gulp.src([scAssetsFolder + '/**/*'])
    .pipe(gulp.dest(newbizSCAssetsNMFolder));
});

gulp.task('copy:scNMAssetsMGL', function () {
  return gulp.src([scAssetsFolder + '/**/*'])
    .pipe(gulp.dest(mglSCAssetsNMFolder));
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

gulp.task('copy:sczg', function () {
  return gulp.src([sharedComponentsFolder + '/**/*'])
    .pipe(gulp.dest(zgSCFolder));
});

gulp.task('copy:scbuy', function () {
  return gulp.src([sharedComponentsFolder + '/**/*'])
    .pipe(gulp.dest(buySCFolder));
});

gulp.task('copy:scpayer', function () {
  return gulp.src([sharedComponentsFolder + '/**/*'])
    .pipe(gulp.dest(payerSCFolder));
});

gulp.task('copy:scnewbiz', function () {
  return gulp.src([sharedComponentsFolder + '/**/*'])
    .pipe(gulp.dest(newbizSCFolder));
});

gulp.task('copy:scmgl', function () {
  return gulp.src([sharedComponentsFolder + '/**/*'])
    .pipe(gulp.dest(mglSCFolder));
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

gulp.task('copy:zg', function () {
  return gulp.src([zgFolder + '/**/*'])
    .pipe(gulp.dest(zgServerFolder));
});

gulp.task('copy:buy', function () {
  return gulp.src([buyFolder + '/**/*'])
    .pipe(gulp.dest(buyServerFolder));
});

gulp.task('copy:payer', function () {
  return gulp.src([payerFolder + '/**/*'])
    .pipe(gulp.dest(payerServerFolder));
});

gulp.task('copy:newbiz', function () {
  return gulp.src([newbizFolder + '/**/*'])
    .pipe(gulp.dest(newbizServerFolder));
});

gulp.task('copy:mgl', function () {
  return gulp.src([mglFolder + '/**/*'])
    .pipe(gulp.dest(mglServerFolder));
});

gulp.task('copy:mybiz', function () {
  return gulp.src([ngoconsoleFolder + '/**/*'])
    .pipe(gulp.dest(mybizServerFolder));
});

gulp.task('copy:paymentlink', function () {
  return gulp.src([paymentlinkFolder + '/**/*'])
    .pipe(gulp.dest(paymentlinkServerFolder));
});

gulp.task('copy:loginAssets', function () {
  return gulp.src([loginAssetsFolder + '/**/*'])
    .pipe(gulp.dest(serverLoginAssetsFolder));
});

gulp.task('copy:mybizAssets', function () {
  return gulp.src([mybizAssetsFolder + '/**/*'])
    .pipe(gulp.dest(serverMyBizAssetsFolder));
});

gulp.task('copy:ngoconsoleAssets', function () {
  return gulp.src([ngoconsoleAssetsFolder + '/**/*'])
    .pipe(gulp.dest(serverNGOConsoleAssetsFolder));
});

gulp.task('copy:zgAssets', function () {
  return gulp.src([zgAssetsFolder + '/**/*'])
    .pipe(gulp.dest(serverZGAssetsFolder));
});

gulp.task('copy:buyAssets', function () {
  return gulp.src([buyAssetsFolder + '/**/*'])
    .pipe(gulp.dest(serverBuyAssetsFolder));
});

gulp.task('copy:payerAssets', function () {
  return gulp.src([payerAssetsFolder + '/**/*'])
    .pipe(gulp.dest(serverPayerAssetsFolder));
});

gulp.task('copy:newbizAssets', function () {
  return gulp.src([newbizAssetsFolder + '/**/*'])
    .pipe(gulp.dest(serverNewBizAssetsFolder));
});

gulp.task('copy:mglAssets', function () {
  return gulp.src([mglAssetsFolder + '/**/*'])
    .pipe(gulp.dest(serverMGLAssetsFolder));
});

gulp.task('copy:paymentlinkAssets', function () {
  return gulp.src([paymentlinkAssetsFolder + '/**/*'])
    .pipe(gulp.dest(serverPaymentLinkAssetsFolder));
});

gulp.task('change:indexlogin', function() {
  return gulp.src([loginIndexFile])
    .pipe(replace('<base href="/">', '<base href="/lgn/">'))
    .pipe(gulp.dest(loginServerFolder));
});

gulp.task('change:indexngoconsole', function() {
  return gulp.src([ngoconsoleIndexFile])
    .pipe(replace('<base href="/">', '<base href="/ngocsl/">'))
    .pipe(gulp.dest(ngoconsoleServerFolder));
});

gulp.task('change:indexmgl', function() {
  return gulp.src([mglIndexFile])
    .pipe(replace('<base href="/">', '<base href="/mgl/">'))
    .pipe(gulp.dest(mglServerFolder));
});

gulp.task('change:indexzg', function() {
  return gulp.src([zgIndexFile])
    .pipe(replace('<base href="/">', '<base href="/zg/">'))
    .pipe(gulp.dest(zgServerFolder));
});

gulp.task('change:indexbuy', function() {
  return gulp.src([buyIndexFile])
    .pipe(replace('<base href="/">', '<base href="/">'))
    .pipe(gulp.dest(buyServerFolder));
});

gulp.task('change:indexpayer', function() {
  return gulp.src([payerIndexFile])
    .pipe(replace('<base href="/">', '<base href="/">'))
    .pipe(gulp.dest(payerServerFolder));
});

gulp.task('change:indexnewbiz', function() {
  return gulp.src([newbizIndexFile])
    .pipe(replace('<base href="/">', '<base href="/newbiz/">'))
    .pipe(gulp.dest(newbizServerFolder));
});

gulp.task('change:indexmybiz', function() {
  return gulp.src([ngoconsoleIndexFile])
    .pipe(replace('<base href="/">', '<base href="/mybiz/">'))
    .pipe(replace('Benow - NGO Console', 'Benow - My Business'))
    .pipe(gulp.dest(mybizServerFolder));
});

gulp.task('change:ngotrans', function() {
  return gulp.src([ngoconsoleTransFile])
    .pipe(replace('/assets/ngoconsole/i18n', '/assets/mybiz/i18n'))
    .pipe(gulp.dest(ngoconsoleTransFolder));
});

gulp.task('revert:ngotrans', function() {
  return gulp.src([ngoconsoleTransFile])
    .pipe(replace('/assets/mybiz/i18n', '/assets/ngoconsole/i18n'))
    .pipe(gulp.dest(ngoconsoleTransFolder));
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

gulp.task('distribute:mgl', function() {
  runSequence(
    'clean:mgl',
    'copy:mgl',
    'copy:mglAssets',
    'delete:indexmgl',
    'change:indexmgl',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});

gulp.task('distribute:zg', function() {
  runSequence(
    'clean:zg',
    'copy:zg',
    'copy:zgAssets',
    'delete:indexzg',
    'change:indexzg',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});

gulp.task('distribute:buy', function() {
  runSequence(
    'clean:buy',
    'copy:buy',
    'copy:buyAssets',
    'delete:indexbuy',
    'change:indexbuy',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});

gulp.task('distribute:payer', function() {
  runSequence(
    'clean:payer',
    'copy:payer',
    'copy:payerAssets',
    'delete:indexpayer',
    'change:indexpayer',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});

gulp.task('distribute:newbiz', function() {
  runSequence(
    'clean:newbiz',
    'copy:newbiz',
    'copy:newbizAssets',
    'delete:indexnewbiz',
    'change:indexnewbiz',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});

gulp.task('predistribute:mybiz', function() {
  runSequence(
    'change:ngotrans',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});

gulp.task('distribute:mybiz', function() {
  runSequence(
    'copy:mybiz',
    'copy:mybizAssets',
    'delete:indexmybiz',
    'change:indexmybiz',
    'revert:ngotrans',
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
    'copy:ssmgl',
    'copy:sszg',
    'copy:ssbuy',
    'copy:sspayer',
    'copy:ssnewbiz',
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
    'copy:scmgl',
    'copy:sczg',
    'copy:scbuy',
    'copy:scpayer',
    'copy:scnewbiz',
    'copy:sclogin',
    'copy:scngoconsole',
    'copy:scpaymentlink',
    'copy:scAssetsMGL',
    'copy:scAssetsZG',
    'copy:scAssetsBuy',
    'copy:scAssetsPayer',
    'copy:scAssetsNewBiz',
    'copy:scAssetsLogin',
    'copy:scAssetsNGOConsole',
    'copy:scAssetsPaymentLink',
    'copy:scNMAssetsMGL',
    'copy:scNMAssetsZG',
    'copy:scNMAssetsBuy',
    'copy:scNMAssetsPayer',
    'copy:scNMAssetsNewBiz',
    'copy:scNMAssetsLogin',
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
    'clean:mybiz',
    'install:sharedservices',
    'build:sharedservices',
    'install:sharedcomponents',
    'build:sharedcomponents',
    'install:login',
    'build:login',
    'install:ngoconsole',
    'build:ngoconsole',
    'predistribute:mybiz',
    'build:mybiz',
    'install:paymentlink',
    'build:paymentlink',
    'install:mgl',
    'build:mgl',
    'install:zg',
    'build:zg',
    'install:buy',
    'build:buy',
    'install:payer',
    'build:payer',
    'install:newbiz',
    'build:newbiz',
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

gulp.task('install:zg', function() {
  process.chdir(zgRootFolder);
  return run('npm install').exec();
});

gulp.task('install:buy', function() {
  process.chdir(buyRootFolder);
  return run('npm install').exec();
});

gulp.task('install:payer', function() {
  process.chdir(payerRootFolder);
  return run('npm install').exec();
});

gulp.task('install:newbiz', function() {
  process.chdir(newbizRootFolder);
  return run('npm install').exec();
});

gulp.task('install:mgl', function() {
  process.chdir(mglRootFolder);
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

gulp.task('build:mgl', function() {
  process.chdir(mglRootFolder);
  return run('npm run build').exec();
});

gulp.task('build:zg', function() {
  process.chdir(zgRootFolder);
  return run('npm run build').exec();
});

gulp.task('build:buy', function() {
  process.chdir(buyRootFolder);
  return run('npm run build').exec();
});

gulp.task('build:payer', function() {
  process.chdir(payerRootFolder);
  return run('npm run build').exec();
});

gulp.task('build:newbiz', function() {
  process.chdir(newbizRootFolder);
  return run('npm run build').exec();
});

gulp.task('build:mybiz', function() {
  process.chdir(ngoconsoleRootFolder);
  return run('npm run build:biz').exec();
});

gulp.task('build:paymentlink', function() {
  process.chdir(paymentlinkRootFolder);
  return run('npm run build').exec();
});
