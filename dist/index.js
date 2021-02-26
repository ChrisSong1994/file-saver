(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.filesaver = factory());
}(this, (function () { 'use strict';

    var click = function (node) {
        try {
            node.dispatchEvent(new MouseEvent("click"));
        }
        catch (e) {
            var evt = document.createEvent("MouseEvents");
            evt.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
            node.dispatchEvent(evt);
        }
    };
    function corsEnabled(url) {
        var xhr = new XMLHttpRequest();
        try {
            xhr.open("HEAD", url, false);
            xhr.send();
        }
        catch (e) { }
        return xhr.status >= 200 && xhr.status <= 299;
    }
    var fetchBlob = function (url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                }
                else {
                    reject(new Error(xhr.statusText || "Download failed."));
                }
            };
            xhr.onerror = function () {
                reject(new Error("Download failed."));
            };
            xhr.send();
        });
    };
    var downloadURL = function (url, name) {
        if (name === void 0) { name = ""; }
        var link = document.createElement("a");
        if ("download" in document.createElement("a"))
            link.download = name;
        link.href = url;
        link.target = "_blank";
        click(link);
    };
    var filesaver = (function (url, filename) {
        if (corsEnabled(url)) {
            return fetchBlob(url)
                .then(function (resp) {
                if (resp.blob) {
                    return resp.blob();
                }
                else {
                    return new Blob([resp]);
                }
            })
                .then(function (blob) {
                if ("msSaveOrOpenBlob" in navigator) {
                    window.navigator.msSaveOrOpenBlob(blob, filename);
                }
                else {
                    var obj = URL.createObjectURL(blob);
                    downloadURL(obj, filename);
                    URL.revokeObjectURL(obj);
                }
            })
                .catch(function (err) {
                throw new Error(err.message);
            });
        }
        else {
            downloadURL(url, filename);
        }
    });

    return filesaver;

})));
