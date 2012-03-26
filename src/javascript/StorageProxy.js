//

function StorageProxy() {
    this.save = function (key, value) {
        tryIf(storable(), function () {localStorage.setItem(key, value)});
    };

    this.retrieve = function (key) {
        return tryIf(storable(), function () {
            return localStorage.getItem(key);
        });
    };

    this.holds = function(key) {
        return tryIf(storable(), function () {
            return notEmpty(localStorage[key]);
        });
    };

    function notEmpty(someString) {
        return someString && someString != "";
    }

    function tryIf(check, func) {
        try {
            if (check) return func();
        } catch (e) {
            alert("Error trying to store data locally: " + e);
        }
        return undefined;
    }

    function storable() {
        if (typeof(localStorage) == "undefined") throw "Your browser does not support HTML5 localStorage. Try upgrading.";
        return true;
    }
}