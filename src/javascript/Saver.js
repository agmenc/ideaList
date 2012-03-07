//

function Saver() {
    this.save = function ($rootNode) {
        var $rootListItem = $rootNode.find("ul li").first();
        var jsonTree = toIdea($rootListItem);
        traverseChildren($rootListItem, jsonTree);
    };

    function traverseChildren($listItem, jsonNode) {
        children($listItem).each(function () {
            var child = toIdea($(this));
            if (hasChildren($(this))) traverseChildren($(this), child);
            jsonNode.addChild(child);
        });
    }

    function children($listItem) { return $listItem.children().children(); }

    function hasChildren($listItem) { return children($listItem).length > 0; }

    function toIdea($listItem) {
        var span = $listItem.children("span");
        return new Idea("Monkeys");
    }
}