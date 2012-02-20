jQuery(document).ready(function () {
    $("div.ideaList").each(function () {new IdeaList($(this), new Storage())})
});

function asPlain($jquerifiedElement) {
    return $jquerifiedElement[0];
}

function Idea(description, children) {
    this.description = description;
    this.kids = children ? children : [];
}

function IdeaList($root, storage) {
    var data;
    var insertionPoint = "~%~";
    var itemTemplate = '<li><span>d</span>' + insertionPoint + '</li>';

    this.saveLocally = function() { storage.save("ideaList", data); };
    this.startingData = function() {
        var dataName = $root.attr("id");
        var locallySaved = storage.retrieve(dataName);
        return locallySaved ? locallySaved : new Idea("Start Typing");
    };

    function hasChildren(node) { return typeof node.kids == "Array" && node.kids.length > 0; }

    function traverseAndBuild(nodes, accumulator) {
        $.each(nodes, function(index, node) {
            accumulator = accumulator.replace(insertionPoint, itemTemplate.replace("d", node.description));
            if(hasChildren(node)) { traverseAndBuild(node.kids, accumulator.replace(insertionPoint, '<ul>' + insertionPoint + '</ul>')); }
        });
        return accumulator.replace(insertionPoint, "");
    }

    data = this.startingData();
    $root.append(traverseAndBuild([data], '<ul>' + insertionPoint + '</ul>'));






    var $selectedNode;
    var originalText = "";
    var $options = $("#options");
    var $newChildTemplate = $("#newChild").find("li");

//    $root.append('<div id="options" class="options"><a id="addChild" href="">add</a> | <a id="deleteChild" href="">delete</a></div>');

//    $root.find("li").each(function () { treeify($(this)); });

    $options.find("#addChild").click(function (event) {
        var $newChild = $newChildTemplate.clone();
        $selectedNode.parent().find("ul").append(treeify($newChild));
        event.preventDefault();
        event.stopPropagation();
    });

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

        var monkeys = storage.retrieve("monkeys");
        originalText = $target.text();
        $target.addClass("selected");
        $target.after($options);
        $selectedNode = $target;
        asPlain($target).contentEditable = "true";
    }

    function saveIfChanged($node, original) {
        if ($node.text() != original) storage.save("monkeys", $node.text());
    }

    function expandContract($elem) {
        $elem.toggleClass("expanded");
        $elem.toggleClass("contracted");
        $elem.children("ul").toggle();
    }
}

function Storage() {
    this.save = function (key, value) {
        tryIf(storable(), function () {localStorage.setItem(key, value)});
    };

    this.retrieve = function (key) {
        return tryIf(storable(), function () {return localStorage.getItem(key)});
    };

    function tryIf(check, func) {
        try {
            if (check) return func();
        } catch (e) {
            alert("Error trying to store data locally: " + e);
        }
        return undefined;
    }

    function storable() {
        if (typeof(localStorage) == "undefined") {
            alert("Your browser does not support HTML5 localStorage. Try upgrading.");
            return false;
        }
        return true;
    }
}

// JSON.stringify(object), JSON.parse(String)
