//

function Storage() {
    this.save = function (key, value) {
        tryIf(storable(), function () {localStorage.setItem(key, value)});
    };

    this.retrieve = function (key) {
        return tryIf(storable(), function () {return localStorage.getItem(key)});
    };

    function tryIf(check, func) {
        try {
            if (check) return func();
        } catch (e) {
            alert("Error trying to store data locally: " + e);
        }
        return undefined;
    }

    function storable() {
        if (typeof(localStorage) == "undefined") {
            alert("Your browser does not support HTML5 localStorage. Try upgrading.");
            return false;
        }
        return true;
    }
}

// JSON.stringify(object), JSON.parse(String)