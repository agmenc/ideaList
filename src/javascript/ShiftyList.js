//

function ShiftyList($rootNode) {
    this.dropHandler = function($sourceElement, $targetElement) {
        var $sourceListItem = $sourceElement.parent();
        var $targetListItem = $targetElement.parent();
        if (!ancestorDescendant($sourceListItem, $targetListItem)) $targetListItem.before($sourceListItem);
    };

    function ancestorDescendant(elem1, elem2) { return exists(elem1.find(elem2)); }

    new DragAndDrop($rootNode.find("li span"), this.dropHandler);
}
