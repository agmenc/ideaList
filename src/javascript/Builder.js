//

function Builder($root, storage) {
    checkPreconditions($root);
    var dataName = $root.attr("id");
    var data = startingData(dataName);
    var insertionPoint = "~%~";
    var itemTemplate = '<li><span>d</span>' + insertionPoint + '</li>';

    this.saveLocally = function () { storage.save(dataName, data); };

    function checkPreconditions($rootElement) {
        if (asPlain($rootElement).hasChildNodes()) throw "Cannot bind an ideaList to a DOM object with children. Use an empty div instead.";
    }

    function startingData(storageName) {
        var locallySaved = storage.retrieve(storageName);
        return locallySaved ? locallySaved : new Idea("Start Typing");
    }

    function hasChildren(jsonNode) { return typeof jsonNode.kids == "Array" && jsonNode.kids.length > 0; }

    function traverseAndBuild(nodes, accumulator) {
        $.each(nodes, function (index, node) {
            accumulator = accumulator.replace(insertionPoint, itemTemplate.replace("d", node.description));
            if (hasChildren(node)) { traverseAndBuild(node.kids, accumulator.replace(insertionPoint, '<ul>' + insertionPoint + '</ul>')); }
        });
        return accumulator.replace(insertionPoint, "");
    }

    $root.append('' +
            '<div class="hidden">' +
            '   <div id="' + dataName + '_options" class="options"><a id="addChild" href="">add</a> | <a id="deleteChild" href="">delete</a></div>' +
            '   <div id="newChild">' +
            '       <li><span>Start Typing</span></li>' +
            '   </div>' +
            '</div>');
    $root.append(traverseAndBuild([data], '<ul>' + insertionPoint + '</ul>'));
}