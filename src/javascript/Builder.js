//

function Builder($root, storage) {
    checkPreconditions($root);
    var dataName = $root.attr("id");
    var data = startingData(dataName);
    var insertionPoint = "~%~";
    var exitPoint = "%~%";
    var itemTemplate = Navigator.newChild.replace("</span></li>", '</span>' + insertionPoint + '</li>');

    $root.append(traverseAndBuild([data], '<ul>' + insertionPoint + '</ul>').replace(insertionPoint, ""));

    function checkPreconditions($rootElement) {
        if (asPlain($rootElement).hasChildNodes()) throw "Cannot bind an ideaList to a DOM object with children. Use an empty div instead.";
    }

    function startingData(storageName) {
        if (storage.holds(storageName)) {
            var inflated = Idea.inflateFrom(storage.retrieve(storageName));
            if (inflated && inflated.description) return inflated;
        }
        return new Idea("New idea");
    }

    function traverseAndBuild(nodes, accumulator) {
        $.each(nodes, function (index, node) {
            accumulator = accumulator.replace(insertionPoint, itemTemplate.replace("New idea", node.description));
            if (node.hasChildren && node.hasChildren()) {
                accumulator = traverseAndBuild(node.children(), accumulator.replace(insertionPoint, '<ul>' + insertionPoint + '</ul>' + exitPoint));
                accumulator = accumulator.replace(insertionPoint, "");
                accumulator = accumulator.replace(exitPoint, insertionPoint);
            }
        });
        return accumulator;
    }
}