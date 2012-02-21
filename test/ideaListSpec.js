//

function StorageStub() {
    this.save = function (key, value) {};
    this.retrieve = function (key) {};
}

var storage;
var ideaList;
var emptyDiv;

beforeEach(function () {
    storage = new StorageStub();
    $("body").append('<div id="emptyDiv" class="ideaList"></div>');
    emptyDiv = $("#emptyDiv");
});

describe('IdeaList', function () {
    beforeEach(function () {
        emptyDiv.html("");
        ideaList = new IdeaList($("#emptyDiv"), storage);
    });

    it('Given an empty div, turns it into an empty ideaList', function () {
        expect(emptyDiv.html()).toEqual( '<ul><li><span>Start Typing</span></li></ul>' );
    });
    it('Saves the state of the ideaList as a JSON object', function () {
        spyOn(storage, 'save');

        ideaList.saveLocally();

        expect(storage.save).toHaveBeenCalledWith("emptyDiv", new Idea("Start Typing"));
    });
    it('Uses the div id as key to find saved JSON data to populate the tree', function () {
        emptyDiv.html("");
        spyOn(storage, 'retrieve');

        ideaList = new IdeaList($("#emptyDiv"), storage);

        expect(storage.retrieve).toHaveBeenCalledWith("emptyDiv");
    });
    it('Can consume the appropriate JSON object to form a tree', function () {
        spyOn(storage, 'retrieve').andReturn(new Idea("monkeys"));
        emptyDiv.html("");

        ideaList = new IdeaList($("#emptyDiv"), storage);

        expect(emptyDiv.html()).toEqual( '<ul><li><span>monkeys</span></li></ul>' );
    });
    it('Fails noisily if you try to bind an ideaList to a root that already contains one', function () {
        $("body").append('<div id="divWithChildren" class="ideaList"><span>You are a monkey</span></div>');

        try {
            ideaList = new IdeaList($("#divWithChildren"), storage);
        } catch (e) {
            expect(e).toEqual("Cannot bind an ideaList to a DOM object with children. Use an empty div instead.");
        }
    });

    it('Adds the root node to any div with class of ideaList', function () {
        $("body").append('<div id="test1a" class="ideaList"></div>');
        $("body").append('<div id="test1b" class="ideaList"></div>');
        $("body").append('<div id="test1c" class="4monkeys"></div>');

        findAndBuildIdeaLists();

        expect($("#test1a").html()).toEqual(
                '<div id="test1a" class="ideaList"><ul class="tree" title="Some Title"><li><span>Start Typing</span></li></ul></div>'
        );

        expect($('test1c').html()).toEqual(
                '<div id="test1c" class="4monkeys"></div>'
        );
    });

    it('Can handle many ideaLists in the same browser for the same user', function () {
        expect(true).toEqual(false);
    });
});
