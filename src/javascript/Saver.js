//

function Saver(storage) {
    function extractData($rootNode) {
        var $rootListItem = $rootNode.find("ul li").first();
        var jsonTree = toIdea($rootListItem);
        accumulateChildren($rootListItem, jsonTree);
        return strung(jsonTree);
    }

    this.save = function ($rootNode) {
        storage.save($rootNode.attr("id"), extractData($rootNode))
    };

    this.exportTree = function($rootNode) {
        return extractData($rootNode);
    };

    function accumulateChildren($listItem, jsonNode) {
        children($listItem).each(function () {
            var child = toIdea($(this));
            if (hasChildren($(this))) accumulateChildren($(this), child);
            jsonNode.addChild(child);
        });
    }

    function children($listItem) {
        return $listItem.children("ul").children("li");
    }

    function hasChildren($listItem) { return children($listItem).length > 0; }

    function toIdea($listItem) {
        var span = $listItem.children("span");
        return new Idea(span.text());
    }
}