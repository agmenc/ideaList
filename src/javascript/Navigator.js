//

function Navigator($root, saver) {
    verifyInputs();
    var dataName = $root.attr("id");
    var $selectedNode;
    var originalText = "";
    var optionsAndTemplates = '' +
            '<div class="hidden">' +
            '   <div id="' + dataName + '_options" class="options"><a id="addChild" href="">add</a> | <a id="deleteChild" href="">delete</a></div>' +
            '   <div id="newChild">' +
            '       <ul>' +
            '           <li><span>New idea</span></li>' +
            '       </ul>' +
            '   </div>' +
            '</div>';

    $root.find("li").each(function () { treeify($(this)); });
    $root.append(optionsAndTemplates);
    options().find("#addChild").click(addChild);
    options().find("#deleteChild").click(deleteNode);

    this.root = function() { return $root; };
    function options() { return $("#" + dataName + "_options") }
    function newListItem() { return $("#newChild") }

    function verifyInputs() {
        if (!saver) throw "No saver provided";
        if (!($root && $root.hasClass("ideaList"))) throw "No root node provided";
    }

    function addChild(event) {
        var $newChild = newListItem().find("li").clone();
        listOfChildren($selectedNode).prepend(treeify($newChild));
        event.preventDefault();
        event.stopPropagation();
    }

    function deleteNode(event) {
        $selectedNode.parent("li").remove();
        event.preventDefault();
        event.stopPropagation();
        saver.save($root);
    }

    function listOfChildren($span) {
        var $listItem = $span.parent();
        if ($listItem.children("ul").length == 0) $listItem.append("<ul></ul>");
        return $listItem.children("ul");
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
        $target.after(options());
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
