function $(selector) {
    return document.querySelector(selector);
}

function later(cb) {
  setTimeout(cb, 600)
}

function fail(msg) {
    document.querySelector('.test-result').textContent += msg
}

function done(msg) {
    var resultCtr = document.querySelector('.test-result')
    if (resultCtr.textContent === "") {
        resultCtr.classList.add('success')
    }
    resultCtr.textContent += "complete"
}

function assertScroll(actual, expected) {
    // Allow a little bit of leeway
    if (Math.abs(actual - expected) > 3) {
        fail(":failure: Expected '" + actual + "' to be '" + expected + "':")
    }
}

function parseQuery(qstr) {
    var query = {};
    var a = qstr.substr(1).split('&');
    for (var i = 0; i < a.length; i++) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }
    return query;
}
