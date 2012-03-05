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

function Idea(description, children) {
    this.description = description;
    this.kids = children ? children : [];

    this.hasChildren = function() { return this.kids.length > 0; };
    this.print = function() { return this.description + " [" + this.kids.length + "]"; };
}
