var config = require('./../configs/Config');

var http;
if (config.beNowSvc.https == 'http://')
    http = require('http');
else
    http = require('https');

// Messages class.
var helper = {
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
    }    
};

module.exports = helper;