//

function StorageStub() {
    this.save = function (key, value) {};
    this.retrieve = function (key) {};
}

var storage;
var listBuilder;
var listSaver;
var emptyDiv;

beforeEach(function () {
    storage = new StorageStub();
    $("body").append('<div id="emptyDiv" class="ideaList"></div>');
    emptyDiv = $("#emptyDiv");
});

describe('Builder', function () {
    beforeEach(function () {
        emptyDiv.html("");
        listBuilder = new Builder($("#emptyDiv"), storage);
    });

    it('Given an empty div, turns it into an empty ideaList', function () {
        expect(emptyDiv.html()).toContain('<ul><li><span>Start Typing</span></li></ul>');
    });
    it('Uses the div id as key to find saved JSON data to populate the tree', function () {
        emptyDiv.html("");
        spyOn(storage, 'retrieve');

        listBuilder = new Builder($("#emptyDiv"), storage);

        expect(storage.retrieve).toHaveBeenCalledWith("emptyDiv");
    });
    it('Can consume the appropriate JSON object to form a tree', function () {
        spyOn(storage, 'retrieve').andReturn(new Idea("monkeys"));
        emptyDiv.html("");

        listBuilder = new Builder($("#emptyDiv"), storage);

        expect(emptyDiv.html()).toContain('<ul><li><span>monkeys</span></li></ul>');
    });
    it('Fails noisily if you try to bind an ideaList to a root that already contains one', function () {
        $("body").append('<div id="divWithChildren" class="ideaList"><span>You are a monkey</span></div>');

        try {
            listBuilder = new Builder($("#divWithChildren"), storage);
        } catch (e) {
            expect(e).toEqual("Cannot bind an ideaList to a DOM object with children. Use an empty div instead.");
        }
    });
    it('Leaves some hidden options and a template for the main list to use', function () {
        var hiddenDivContents = emptyDiv.find("div.hidden").first().html();

        expect(hiddenDivContents).toContain('<div id="emptyDiv_options" class="options">');
        expect(hiddenDivContents).toContain('<div id="newChild">');
    });
});
