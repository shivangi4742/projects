var fs = require('fs');
var uuid = require('uuid');
var findRemoveSync = require('find-remove');

var config = require('./../configs/Config');

var http;
if (config.beNowSvc.https == 'http://')
    http = require('http');
else
    http = require('https');

// Messages class.
var helper = {
    gandaLogic: function (txnid) {
        if (!txnid || txnid.length < 16)
            return 100;
        else {
            var str = txnid.charCodeAt(2).toString() + txnid.charCodeAt(3).toString() + txnid.charCodeAt(4).toString() + txnid.substring(14);
            return parseInt(str);
        }
    },

    cleanOldFiles: function () {
        try {
            var result = findRemoveSync('qrs', { age: { seconds: 3600 }, extensions: '.png' })
        }
        catch (err) {
        }
    },

    postSaveImgAndCallback: function (extServerOptions, obj, name, cb) {
        try {
            this.cleanOldFiles();
            var fileName = 'qrs/' + name + uuid.v1() + '.png';
            var f = fs.createWriteStream(fileName);
            var reqPost = http.request(extServerOptions, function (res) {
                var buffer = '';
                res.on('data', function (chunk) {
                    f.write(chunk);
                });
                res.on('end', function (err) {
                    if (res.statusCode === 200) {
                        f.end();
                        cb({ 'src': fileName });
                    }
                    else
                        cb({ 'success': false, 'status': res.statusCode });
                });
            });

            reqPost.write(JSON.stringify(obj));
            reqPost.end();
            reqPost.on('error', function (e) {
                cb({ 'error': e, 'success': false });
            });
        }
        catch (e) {
            cb({ 'success': false, 'status': 501, 'validationErrors': 'Output is not in proper format' });
        }
    },

    getDefaultExtFileServerOptions: function (path, method, headers) {
        var extServerOptions = {
            uri: path,
            method: method,
            headers: {}
        };

        if (headers['user-agent'])
            extServerOptions.headers['User-Agent'] = headers['user-agent'];
        else if (headers['User-Agent'])
            extServerOptions.headers['User-Agent'] = headers['User-Agent'];
        else
            extServerOptions.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36';

        if (headers['content-type'])
            extServerOptions.headers['Content-Type'] = headers['content-type'];
        else if (headers['Content-Type'])
            extServerOptions.headers['Content-Type'] = headers['Content-Type'];
        else
            extServerOptions.headers['Content-Type'] = 'application/json';

        if (headers['X-AUTHORIZATION'])
            extServerOptions.headers['X-AUTHORIZATION'] = headers['X-AUTHORIZATION'];
        else if (headers['x-authorization'])
            extServerOptions.headers['X-AUTHORIZATION'] = headers['x-authorization'];
        else
            extServerOptions.headers['X-AUTHORIZATION'] = config.defaultToken

        if (headers['X-EMAIL'])
            extServerOptions.headers['X-EMAIL'] = headers['X-EMAIL'];
        else if (headers['x-email'])
            extServerOptions.headers['X-EMAIL'] = headers['x-email'];
        else
            extServerOptions.headers['X-EMAIL'] = config.defaultEmail;

        return extServerOptions;
    },

    postAndCallbackString: function (extServerOptions, obj, cb) {
        try {
            var reqPost = http.request(extServerOptions, function (res) {
                var buffer = '';
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    buffer += chunk;
                });
                res.on('end', function (err) {
                    if (res.statusCode === 200)
                        cb({ 'url': buffer.toString() });
                    else if (res.statusCode === 400 && buffer) {
                        var dta = JSON.parse(buffer);
                        if (dta.validationErrors)
                            cb({ 'success': false, 'status': res.statusCode, 'validationErrors': dta.validationErrors });
                        else
                            cb({ 'success': false, 'status': res.statusCode });
                    }
                    else
                        cb({ 'success': false, 'status': res.statusCode });
                });
            });

            reqPost.write(JSON.stringify(obj));
            reqPost.end();
            reqPost.on('error', function (e) {
                cb({ 'error': e, 'success': false });
            });
        }
        catch (e) {
            cb({ 'success': false, 'status': 501, 'validationErrors': 'Output is not in proper format' });
        }
    },

    getDefaultExtServerOptions: function (path, method, headers) {
        var extServerOptions = {
            host: config.beNowSvc.host,
            port: config.beNowSvc.port,
            path: path,
            method: method,
            headers: {}
        };

        if (headers['user-agent'])
            extServerOptions.headers['User-Agent'] = headers['user-agent'];
        else if (headers['User-Agent'])
            extServerOptions.headers['User-Agent'] = headers['User-Agent'];
        else
            extServerOptions.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36';

        if (headers['content-type'])
            extServerOptions.headers['Content-Type'] = headers['content-type'];
        else if (headers['Content-Type'])
            extServerOptions.headers['Content-Type'] = headers['Content-Type'];
        else
            extServerOptions.headers['Content-Type'] = 'application/json';

        if (headers['X-AUTHORIZATION'])
            extServerOptions.headers['X-AUTHORIZATION'] = headers['X-AUTHORIZATION'];
        else if (headers['x-authorization'])
            extServerOptions.headers['X-AUTHORIZATION'] = headers['x-authorization'];
        else
            extServerOptions.headers['X-AUTHORIZATION'] = config.defaultToken

        if (headers['X-EMAIL'])
            extServerOptions.headers['X-EMAIL'] = headers['X-EMAIL'];
        else if (headers['x-email'])
            extServerOptions.headers['X-EMAIL'] = headers['x-email'];
        else
            extServerOptions.headers['X-EMAIL'] = config.defaultEmail;

        return extServerOptions;
    },

    getDefaultedExtServerOptions: function (path, method, headers) {
        var extServerOptions = {
            host: config.beNowSvc.host,
            port: config.beNowSvc.port,
            path: path,
            method: method,
            headers: {}
        };

        extServerOptions.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36';
        extServerOptions.headers['Content-Type'] = 'application/json';

        if (headers['X-AUTHORIZATION'])
            extServerOptions.headers['X-AUTHORIZATION'] = headers['X-AUTHORIZATION'];
        else if (headers['x-authorization'])
            extServerOptions.headers['X-AUTHORIZATION'] = headers['x-authorization'];
        else
            extServerOptions.headers['X-AUTHORIZATION'] = config.defaultToken

        if (headers['X-EMAIL'])
            extServerOptions.headers['X-EMAIL'] = headers['X-EMAIL'];
        else if (headers['x-email'])
            extServerOptions.headers['X-EMAIL'] = headers['x-email'];
        else
            extServerOptions.headers['X-EMAIL'] = config.defaultEmail;

        return extServerOptions;
    },

    getIntExtServerOptions: function (path, method, token, email) {
        var extServerOptions = {
            host: config.beNowSvc.host,
            port: config.beNowSvc.port,
            path: path,
            method: method,
            headers: {}
        };

        extServerOptions.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36';
        extServerOptions.headers['Content-Type'] = 'application/json';
        extServerOptions.headers['X-AUTHORIZATION'] = token;
        extServerOptions.headers['X-EMAIL'] = email;
        return extServerOptions;
    },

    getAndCallback: function (extServerOptions, cb, notJSON) {
        return http.get({
            host: extServerOptions.host,
            path: extServerOptions.path,
            port: extServerOptions.port,
            headers: extServerOptions.headers
        }, function (res) {
            var body = '';
            res.setEncoding('utf8');
            res.on('data', function (d) {
                body += d;
            });
            res.on('end', function () {
                if (res.statusCode === 200)
                    if (body)
                        if (notJSON)
                            cb(body);
                        else
                            cb(JSON.parse(body));
                    else
                        cb(null);
                else if (res.statusCode === 400 && body) {
                    var dta = JSON.parse(body);
                    if (dta.validationErrors)
                        cb({ 'success': false, 'status': res.statusCode, 'validationErrors': dta.validationErrors });
                    else
                        cb({ 'success': false, 'status': res.statusCode });
                }
                else
                    cb({ 'success': false, 'status': res.statusCode });
            });
        });
    },

    getExtServerOptions: function (path, method, headers) {
        var extServerOptions = {
            host: config.beNowSvc.host,
            port: config.beNowSvc.port,
            path: path,
            method: method,
            headers: {}
        };

        if (headers['user-agent'])
            extServerOptions.headers['User-Agent'] = headers['user-agent'];
        else if (headers['User-Agent'])
            extServerOptions.headers['User-Agent'] = headers['User-Agent'];
        else
            extServerOptions.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36';

        if (headers['content-type'])
            extServerOptions.headers['Content-Type'] = headers['content-type'];
        else if (headers['Content-Type'])
            extServerOptions.headers['Content-Type'] = headers['Content-Type'];
        else
            extServerOptions.headers['Content-Type'] = 'application/json';

        if (headers['X-AUTHORIZATION'])
            extServerOptions.headers['X-AUTHORIZATION'] = headers['X-AUTHORIZATION'];
        else if (headers['x-authorization'])
            extServerOptions.headers['X-AUTHORIZATION'] = headers['x-authorization'];

        if (headers['X-EMAIL'])
            extServerOptions.headers['X-EMAIL'] = headers['X-EMAIL'];
        else if (headers['x-email'])
            extServerOptions.headers['X-EMAIL'] = headers['x-email'];

        return extServerOptions;
    },

    postAndCallback: function (extServerOptions, obj, cb) {
        try {
            var reqPost = http.request(extServerOptions, function (res) {
                var buffer = '';
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    buffer += chunk;
                });
                res.on('end', function (err) {
                    if (res.statusCode === 200)
                        cb(JSON.parse(buffer));
                    else if (res.statusCode === 400 && buffer) {
                        var dta = JSON.parse(buffer);
                        if (dta.validationErrors)
                            cb({ 'success': false, 'status': res.statusCode, 'validationErrors': dta.validationErrors });
                        else
                            cb({ 'success': false, 'status': res.statusCode });
                    }
                    else
                        cb({ 'success': false, 'status': res.statusCode });
                });
            });

            reqPost.write(JSON.stringify(obj));
            reqPost.end();
            reqPost.on('error', function (e) {
                cb({ 'error': e, 'success': false });
            });
        }
        catch (e) {
            cb({ 'success': false, 'status': 501, 'validationErrors': 'Output is not in proper format' });
        }
    },

    getCurDateTimeString() {
        var dt = new Date();
        return this.getCurDateString() + ' ' + this.getDate(dt.getHours()) + ':' + this.getDate(dt.getMinutes()) + ':'
            + this.getDate(dt.getSeconds());
    },

    getCurDateString() {
        var dt = new Date();
        return this.getDate(dt.getDate()) + '-' + this.getMonth(dt.getMonth()) + '-' + dt.getFullYear();
    },

    getMonth(m) {
        var mon = parseInt(m, 10) + 1;
        if (mon < 10)
            return '0' + mon.toString();

        return mon.toString();
    },

    getDate(d) {
        if (parseInt(d, 10) < 10)
            return '0' + d.toString();

        return d.toString();
    },

    inWords: function (totalRent) {
        var rupeePrefix = 'Rupees ';
        var paisaPrefix = 'Paise';
        var and = 'and ';
        if (totalRent >= 1 && totalRent < 2)
            rupeePrefix = 'Rupee ';

        if (totalRent < 1) {
            and = '';
            rupeePrefix = '';
        }

        if ((Math.round(totalRent * 100) % 100) >= 1 && (Math.round(totalRent * 100) % 100) < 2) {
            paisaPrefix = 'Paisa';
        }

        var n;
        var d;
        var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ',
            'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
        var b = ['', '', 'Twenty', 'Thirty', 'Fourty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        var number = parseFloat(totalRent).toFixed(2).split(".");
        var num = parseInt(number[0]);
        var digit = parseInt(number[1]);
        if ((num.toString(n)).length > 9)
            return 'Overflow';

        n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        d = ('00' + digit).substr(-2).match(/^(\d{2})$/);;
        if (!n) return; var str = '';

        str += rupeePrefix, '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
        str += (n[5] != 0) ? (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : ' ';

        str += (d[1] != 0) ? ((str != '') ? and : '') + (a[Number(d[1])] || b[d[1][0]] + ' ' + a[d[1][1]]) + paisaPrefix + ' Only ' : 'Only';
        return str;
    }
};

module.exports = helper;