// Config class.
var config = {
    mongoConfig:{
		'projectUrl':'',
		'userCollectionName':'',
	},
	logger : {
		logDir : __dirname + '/server/log/',
		logFileName : __dirname + '/server/log/app.log'
	}/*,
	ssl: {
		active: true,
		key: 'server.key',
		certificate: 'server.cert',
	}*/,//For Prod.
	ssl: {
		active: false,
		key: '',
		certificate: '',
	},//For dev.
    base: '',
/*	defaultToken: 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vd3d3LmJlbm93LmluLyIsInN1YiI6Inh5QG1hc3Rlay5jb20iLCJkYXRhIjp7Im1jY0NvZGUiOiI2MjExIiwibWVyY2hhbnRDb2RlIjoiQUEzTzEiLCJwcml2YXRlSWQiOiI0MjMiLCJtZXJjaGFudElkIjoiMjI5IiwiZGlzcGxheU5hbWUiOiJBbHJpZ2h0IEVudGVycHJpc2UiLCJtb2JpbGVOdW1iZXIiOiI5MDIyODYxMjYyIn0sImlhdCI6MTQ5NjE0NjY5NH0.3DBNezPrk1NEsSfK92pTsjZnjMYA8ZL9yeh1zS4R68s',
	defaultEmail: 'xy@mastek.com',
*/	defaultToken: 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vd3d3LmJlbm93LmluLyIsInN1YiI6ImFha2FzaC5hc2hlc2hAYmVub3cuaW4iLCJkYXRhIjp7Im1lcmNoYW50SWQiOiIxMjMiLCJtY2NDb2RlIjoiNTgxMiIsIm1vYmlsZU51bWJlciI6Ijk4MjEwMTA4NTQiLCJkaXNwbGF5TmFtZSI6IkJlbm93IENhZmUiLCJtZXJjaGFudENvZGUiOiJBQTNRNyIsInByaXZhdGVJZCI6IjM1NSJ9LCJpYXQiOjE0OTYxNDYzNjN9.xFTroK6Ifyfauo0EM4c8i3ELnRmTKQCJdJm_wZckx3M',
	defaultEmail: 'aakash.ashesh@benow.in',
	me: 'http://localhost:9090',
	paymentGateway: {
		curl: '',
		key: 'i5VAmu',
		url: 'https://secure.payu.in/_payment',
/*		curl: '',
		key: 'BxGvnf',
		url: 'https://test.payu.in/_payment',*/
		furl: 'http://localhost:9090/paymentfailure/',
		surl: 'http://localhost:9090/paymentsuccess/',
		sdksurl: 'http://localhost:9090/paymentstatus/',
		sdkfurl: 'http://localhost:9090/paymentstatus/',
		xauth: 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vd3d3LmJlbm93LmluLyIsInN1YiI6Inh5QG1hc3Rlay5jb20iLCJkYXRhIjp7Im1jY0NvZGUiOiI2MjExIiwibWVyY2hhbnRDb2RlIjoiQUEzTzEiLCJwcml2YXRlSWQiOiI0MjMiLCJtZXJjaGFudElkIjoiMjI5IiwiZGlzcGxheU5hbWUiOiJBbHJpZ2h0IEVudGVycHJpc2UiLCJtb2JpbGVOdW1iZXIiOiI5MDIyODYxMjYyIn0sImlhdCI6MTQ5NjE0NjY5NH0.3DBNezPrk1NEsSfK92pTsjZnjMYA8ZL9yeh1zS4R68s'
	},
	tickerKey: 'yatish',
	beNowSvc: {
		host: 'mobilepayments.benow.in',
        port: '443',
		https: 'https://'
/*		host: 'dev.benow.in',
        port: '8080',
		https: 'http://'*/
	},
	env:'prod'
};

config.port = config.env == 'prod' ? 9090 : 9090;
module.exports = config;