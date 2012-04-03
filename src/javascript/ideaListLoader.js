//

jQuery(document).ready(function () {
    var storage = new StorageProxy();
    $("div.ideaList").each(function () {
        new Builder($(this), storage);
        new Navigator($(this), new Saver(storage));
        new ShiftyList($(this).children("ul"));
    })
});

var debug = new Object();

function asPlain($jquerifiedElement) {
    return $jquerifiedElement[0];
}

function strung(object) {
    return JSON.stringify(object);
}

function pretty(object) {
    return JSON.stringify(object,4);
}

function exists($thing) {
    if (!$thing.size) throw "Not a JQuery object";
    return $thing.size() > 0;
}
