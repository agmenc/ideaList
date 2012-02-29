//

function IdeaList($root, saver) {
    var $selectedNode;
    var originalText = "";
    var $options = $("#options");
    var $newListItem = $("#newChild");

    $root.find("li").each(function () { treeify($(this)); });

    $options.find("#addChild").click(addChild);

    function addChild(event) {
        var $newChild = $newListItem.find("li").clone();
        listOfChildren($selectedNode).append(treeify($newChild));
        event.preventDefault();
        event.stopPropagation();
    }

    function listOfChildren($span) {
        var $listItem = $span.parent();
        if ($listItem.find("ul").length == 0) $listItem.append("<ul></ul>");
        return $listItem.find("ul");
    }

    function treeify($listItem) {
        $listItem.click(function (event) {
            select($listItem.find("span:first"));
            expandContract($listItem);
            event.stopPropagation();
        });
        $listItem.addClass("expanded");
        return $listItem;
    }

    function select($target) {
        if ($selectedNode) {
            $selectedNode.removeClass("selected");
            asPlain($selectedNode).contentEditable = "true";
            saveIfChanged($selectedNode, originalText);
        }

        originalText = $target.text();
        $target.addClass("selected");
        $target.after($options);
        $selectedNode = $target;
        asPlain($target).contentEditable = "true";
    }

    function saveIfChanged($node, original) {
        if ($node.text() != original) saver.save($root);
    }

    function expandContract($elem) {
        $elem.toggleClass("expanded");
        $elem.toggleClass("contracted");
        $elem.children("ul").toggle();
    }
}
