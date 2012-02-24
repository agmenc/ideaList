//

jQuery(document).ready(function () {
    $("div.ideaList").each(function () {
        new ListBuilder($(this), new Storage());
        new IdeaList($(this));
    })
});

function asPlain($jquerifiedElement) {
    return $jquerifiedElement[0];
}

function Idea(description, children) {
    this.description = description;
    this.kids = children ? children : [];
}
