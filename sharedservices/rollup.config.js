export default {
  entry: 'dist/index.js',
  dest: 'dist/bundles/sharedservices.umd.js',
  sourceMap: false,
  format: 'umd',
  moduleName: 'ng.sharedservices',
  globals: {
    '@angular/core': 'ng.core',
    '@angular/http': 'ng.http',
    '@angular/forms': 'ng.forms',
    '@angular/common': 'ng.common',
    '@angular/platform-browser': 'ng.platform-browser',
    'rxjs/Observable': 'Rx',
    'rxjs/ReplaySubject': 'Rx',
    'rxjs/add/operator/map': 'Rx.Observable.prototype',
    'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
    'rxjs/add/observable/fromEvent': 'Rx.Observable',
    'rxjs/add/observable/of': 'Rx.Observable',
    'rxjs/add/operator/map': 'Rx.Observable.prototype',
    'rxjs/add/operator/toPromise': 'Rx.Observable.prototype'
  }
}