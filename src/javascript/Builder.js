//

function Builder($root, storage) {
    checkPreconditions($root);
    var dataName = $root.attr("id");
    var data = startingData(dataName);
    var insertionPoint = "~%~";
    var exitPoint = "%~%";
    var itemTemplate = '<li><span>d</span>' + insertionPoint + '</li>';

    function checkPreconditions($rootElement) {
        if (asPlain($rootElement).hasChildNodes()) throw "Cannot bind an ideaList to a DOM object with children. Use an empty div instead.";
    }

    function startingData(storageName) {
        var locallySaved = storage.retrieve(storageName);
        return locallySaved ? locallySaved : new Idea("Start Typing");
    }

    function hasChildren(jsonNode) { return jsonNode.kids.length > 0; }

    function print(jsonNode) { return jsonNode.description + " [" + jsonNode.kids.length + "]"; }

    function traverseAndBuild(nodes, accumulator) {
        $.each(nodes, function (index, node) {
            accumulator = accumulator.replace(insertionPoint, itemTemplate.replace("d", node.description));
            if (hasChildren(node)) {
                accumulator = traverseAndBuild(node.kids, accumulator.replace(insertionPoint, '<ul>' + insertionPoint + '</ul>' + exitPoint));
                accumulator = accumulator.replace(insertionPoint, "");
                accumulator = accumulator.replace(exitPoint, insertionPoint);
            }
        });
        return accumulator;
    }

    $root.append(traverseAndBuild([data], '<ul>' + insertionPoint + '</ul>').replace(insertionPoint, ""));
}