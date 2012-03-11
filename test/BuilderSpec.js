//

var storage;
var listBuilder;
var $emptyDiv;

describe('Builder', function () {

    beforeEach(function () {
        storage = new StorageProxy();
        $("body").append('<div id="emptyDiv" class="ideaList"></div>');
        $emptyDiv = $("#emptyDiv");
        $emptyDiv.html("");
        listBuilder = new Builder($emptyDiv, storage);
    });

    afterEach(function () {
        $emptyDiv.remove();
        $("#divWithChildren").remove();
    });

    it('Given an empty div, turns it into an empty ideaList', function () {
        expect($emptyDiv.html()).toContain('<ul><li><span>Start Typing</span></li></ul>');
    });
    it('Fails noisily if you try to bind an ideaList to a root that already contains one', function () {
        $("body").append('<div id="divWithChildren" class="ideaList"><span>You are a monkey</span></div>');

        expect(function() {
            new Builder($("#divWithChildren"), storage);
        }).toThrow("Cannot bind an ideaList to a DOM object with children. Use an empty div instead.");
    });
    it('Uses the div id as key to find saved JSON data to populate the tree', function () {
        $emptyDiv.html("");
        spyOn(storage, 'retrieve').andReturn(null);

        listBuilder = new Builder($emptyDiv, storage);

        expect(storage.retrieve).toHaveBeenCalledWith("emptyDiv");
    });
    it('Can consume the appropriate JSON object to form the root node of a tree', function () {
        spyOn(storage, 'retrieve').andReturn('{"description": "monkeys", "children": []}');
        $emptyDiv.html("");

        listBuilder = new Builder($("#emptyDiv"), storage);

        expect($emptyDiv.html()).toContain('<ul><li><span>monkeys</span></li></ul>');
    });
    it('Can consume the appropriate JSON object to form a tree', function () {
        spyOn(storage, 'retrieve').andReturn(strung(new Idea("trees", [new Idea("bananas"), new Idea("apples", [new Idea("cider")]), new Idea("other fruit")])));
        $emptyDiv.html("");

        listBuilder = new Builder($("#emptyDiv"), storage);

        expect($emptyDiv.html()).toContain(
                '<ul><li><span>trees</span><ul><li><span>bananas</span></li><li><span>apples</span><ul><li><span>cider</span></li></ul></li><li><span>other fruit</span></li></ul></li></ul>'
        );
    });
});
