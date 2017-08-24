export default {
  entry: 'dist/index.js',
  dest: 'dist/bundles/sharedcomponents.umd.js',
  sourceMap: false,
  format: 'umd',
  moduleName: 'ng.sharedcomponents',
  globals: {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/http': 'ng.http',
    'rxjs/Observable': 'Rx',
    'rxjs/ReplaySubject': 'Rx',
    'rxjs/add/operator/map': 'Rx.Observable.prototype',
    'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
    'rxjs/add/observable/fromEvent': 'Rx.Observable',
    'rxjs/add/observable/of': 'Rx.Observable',
    'ng2-translate': 'ng.ng2-translate',
    'benowservices': 'ng.sharedservices'
  }
}