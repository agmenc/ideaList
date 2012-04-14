//

function original($e) {
    return $e.originalEvent;
}

function ShiftyList($rootNode) {
    var self = this;

    $rootNode.find("li span").each(function () { makeShifty($(this)); });

    this.dragStart = function($sourceElement) { $sourceElement.addClass("drag"); };

    this.dragEnd = function($sourceElement) { $sourceElement.removeClass("drag"); };

    this.drop = function($sourceElement, $targetElement) {
        var $sourceListItem = $sourceElement.parent();
        var $targetListItem = $targetElement.parent();
        if (!ancestorDescendant($sourceListItem, $targetListItem)) $targetListItem.before($sourceListItem);
    };

    function ancestorDescendant(elem1, elem2) { return exists(elem1.find(elem2)); }

    // Consider creating a separate DnD class, or new Drag() and new Drop();
    var $source;

    function makeShifty($listItem) {
        $listItem.attr("draggable", "true");
        $listItem.bind('dragstart', handleDragStart);
        $listItem.bind('dragover', handleDragOver);
        $listItem.bind('dragend', handleDragEnd);
        $listItem.bind('drop', handleDrop);
    }

    function handleDragStart(event) {
        $source = $(this);
        self.dragStart($source);
        original(event).dataTransfer.effectAllowed = 'move';
        original(event).dataTransfer.setData('text/html', "monkeys");
    }

    function handleDragOver(event) {
        original(event).preventDefault();
        original(event).dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnd(event) { self.dragEnd($source); }

    function handleDrop(event) {
        $target = $(this);
        original(event).stopPropagation();
        self.drop($source, $target);
        return false;
    }
}