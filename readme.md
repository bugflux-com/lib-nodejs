# Bugflux reporting library

 * [Installation and basic usage](#installation-and-basic-usage)
 * [Options](#options)
 * [Reporting manually](#reporting-manually)
 * [Server response](#server-response)

## Installation and basic usage

Install package by running `npm install bugflux --save`.

By default all uncaught exceptions are sent to bugflux server, the only thing you have to do is to set the default configuration:

```js
var bugflux = require('bugflux');

bugflux.setDefault({
    url: 'https://bugflux.your-domain.com/',
    project: 'Your project name',
    version: '0.1.0',
    language: 'en_US',
    environment: 'Production',
});

console.log(bugflux.default.project); // <-- Print "Your project name"
throw new Error(); // <-- Report will be sent here
```

You can disable it by setting `bugflux.options.sendUncaughtExceptions` to `false`.

### Options

All global settings can be found at `bugflux.options.*`:

* `silent` - Disable priting error message to standard error stream when uncaught exception occurs (default `false`);
* `sendUncaughtExceptions` - Enable automatic error reporting when uncaught exception occurs (default `true`).
* `strictSSL` - Force to use https protocol and verified certificates (default `true`, **we do not recommend changing this value**, but you can use it for testing or developing purposes).

## Reporting manually

You can send reports manually by calling `send` method:

```js
var bugflux = require('bugflux');

fn(args, function(err) {
    if(err) bugflux.send(err); // <-- Use default settings
});
```

The `send` method accept `bugflux.report`, raw `Object` or `Error`:

```js
// 1. bugflux.report
var report = new bugflux.report(new Error());
// - or -
var report = new bugflux.report(new Error(), { project: 'Custom project name'});
// - or -
var report = new bugflux.report({ project: 'Awesome project name' });
    report.fill(new Error()); // <-- Fill error details (hash, name, stack_trace)

bugflux.send(report);
```

```js
// 2. Object
bugflux.send({
    url: 'https://bugflux-server/',
    project: 'Awesome project name',
    // and more... see bugflux.com/api/report-an-error.html
});
```

```js
// 3. Error
bugflux.send(new Error('test'));
```

## Server response

The `send` method accept callback as a second argument. The callback parameters are forwarded from [request method](https://github.com/request/request#super-simple-to-use).

```js
var bugflux = require('bugflux');

bugflux.send(new Error(), function(err, res, body) {
    console.log(err, res, body);
});
```