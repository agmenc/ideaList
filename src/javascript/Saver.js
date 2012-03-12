//

function Saver(storage) {
    this.clear = function() { storage.clear(); };

    this.save = function ($rootNode) {
        var dataName = $rootNode.attr("id");
        var $rootListItem = $rootNode.find("ul li").first();
        var jsonTree = toIdea($rootListItem);
        accumulateChildren($rootListItem, jsonTree);
        console.log("saving ==> " + pretty(jsonTree));
        storage.save(dataName, strung(jsonTree))
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