//

function DragAndDrop($applicableElements, dropHandler) {
    var self = this;
    $applicableElements.each(function () { makeDragAndDroppable($(this)); });
    this.dragStart = function($sourceElement) { $sourceElement.addClass("drag"); };
    this.dragEnd = function($sourceElement) { $sourceElement.removeClass("drag"); };
    this.drop = dropHandler;

    var $source;

    function makeDragAndDroppable($listItem) {
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

    function original($e) { return $e.originalEvent; }
}