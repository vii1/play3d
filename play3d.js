"use strict";

(function() {
    var iframe = document.getElementById('viewport');
    var errors = document.getElementById('errors');

    var doc = iframe.contentDocument;
    var win = iframe.contentWindow;

    function compilar() {
        var code = editor.getValue();
        win.postMessage(code, '*');
    }

    document.getElementById('botonCompilar').addEventListener("click", compilar);

    window.addEventListener('message', function(e) {
        if(e.source == win && e.origin == window.origin) {
            if(e.data === null) {
                errors.innerHTML = '';
            } else {
                errors.innerText = e.data;
            }
        }
    })

    if(window.origin == 'null') {
        iframe.setAttribute('sandbox', iframe.getAttribute('sandbox') + ' allow-same-origin');
    }
    iframe.setAttribute('srcdoc',
        '<!DOCTYPE html><html><head><title></title>' +
        '<link rel="stylesheet" type="text/css" href="sandbox.css">' +
        '<script type="text/javascript" src="lib/three.min.js"></script>' +
        '<script type="text/javascript" src="lib/controls/OrbitControls.js"></script>' +
        '</head><body>' +
        '<script type="text/javascript" src="play3d-sandbox.js"></script>' +
        '</body></html>');

    window.addEventListener('keydown', function(e) {
        if(e.altKey && e.key == "Enter") {
            compilar();
        }
    });
    setTimeout(compilar, 500);    
}());