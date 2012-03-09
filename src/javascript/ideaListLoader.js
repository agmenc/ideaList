//

jQuery(document).ready(function () {
    $("div.ideaList").each(function () {
        new Builder($(this), new Storage());
        new Navigator($(this), new Saver());
    })
});

var debug = new Object();

function asPlain($jquerifiedElement) {
    return $jquerifiedElement[0];
}

function strung(object) {
    return JSON.stringify(object);
}
