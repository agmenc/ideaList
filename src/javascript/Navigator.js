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
            '           ' + Navigator.newChild +
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
        if (isRoot($selectedNode)) {
            var goAhead = confirm("This will delete the entire tree. Is this your intention?");
            if (goAhead) $root.html("Reload the page to build a new tree");
        } else {
            $selectedNode.parent("li").remove();
        }

        event.preventDefault();
        event.stopPropagation();
        saver.save($root);
    }

    function isRoot($span) {
        return $root.find("ul li span").first().text() == $span.text();
    }

    function listOfChildren($span) {
        var $listItem = $span.parent();
        if ($listItem.children("ul").length == 0) $listItem.append("<ul></ul>");
        return $listItem.children("ul");
    }

    function treeify($listItem) {
        $listItem.click(function (event) {
            select($listItem.find("span:first"));
            event.stopPropagation();
        });
        $listItem.find("div:first").click(function(event) {
            expandContract($listItem);
            event.stopPropagation();
        });
        $listItem.addClass("expanded");
        asPlain($listItem.find("span:first")).contentEditable = "true";
        return $listItem;
    }

    function select($target) {
        if ($selectedNode) {
            $selectedNode.removeClass("selected");
            saveIfChanged($selectedNode, originalText);
        }

        originalText = $target.text();
        $target.addClass("selected");
        $target.after(options());
        $selectedNode = $target;
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

Navigator.newChild = '<li class="expanded"><div class="toggle"></div><span contenteditable="true">New idea</span></li>';
