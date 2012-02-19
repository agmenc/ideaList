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
    ideaList = new IdeaList($("#emptyDiv"), storage);
    emptyDiv = $("#emptyDiv");
});

describe('IdeaList', function () {
    it('Given an empty div, turns it into an empty ideaList', function () {
        expect(emptyDiv.html()).toEqual(
                '<ul><li class="expanded"><span>Start Typing</span></li></ul>'
        );
    });
    it('Saves the state of the ideaList as a JSON object', function () {
        spyOn(storage, 'save');

        ideaList.saveLocally();

        expect(storage.save).toHaveBeenCalledWith("ideaList", new Idea("Start Typing"));
    });
    it('Can consume the appropriate JSON object to form a tree.', function () {
        spyOn(storage, 'retrieve').andReturn({'monkeys': 'eat poo'});

        ideaList.loadLocally();

        expect(emptyDiv.html()).toEqual(
                '<ul><li class="expanded"><span>Monkeys eat poo</span></li></ul>'
        );
    });
    it('Looks for saved JSON data to populate the tree', function () {
        expect(true).toEqual(false);
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
