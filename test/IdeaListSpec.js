//

var $divToPopulate;
var saver;
var ideaList;
var A_PRE_CANNED_LIST = '' +
        '<div id="divToPopulate" class="ideaList"></div>' +
        '<div id="someRootWithoutIdeaList"></div>' +
        '<div class="hidden">' +
        '   <div id="options" class="options"><a id="addChild" href="">add</a> | <a id="deleteChild" href="">delete</a></div>' +
        '   <div id="newChild">' +
        '       <ul>' +
        '           <li><span>Start Typing</span></li>' +
        '       </ul>' +
        '   </div>' +
        '</div>';

beforeEach(function () {
    $("body").append(A_PRE_CANNED_LIST);
    $divToPopulate = $("#divToPopulate");
    saver = new Saver($divToPopulate);
});

describe('IdeaList', function () {

    beforeEach(function () {
        $divToPopulate.html('<ul><li><span>Some root node</span></li></ul>');
        ideaList = new IdeaList($divToPopulate);
    });

    it('Allows the user to select a node', function () {
        firstItem().click();

        expect(firstItem().find("span").hasClass("selected")).toEqual(true);
    });
    it('Displays options to add or delete child nodes', function () {
        firstItem().click();

        expect($divToPopulate.html()).toContain('<div id="options" class="options"><a id="addChild" href="">add</a> | <a id="deleteChild" href="">delete</a></div>');
    });
    it('Adds a <ul></ul> containing a <li></li> when adding the first child node', function () {
        firstItem().click();

        addButton().click();

        expect(firstItem().html()).toContain('<ul><li class="expanded"><span>Start Typing</span></li></ul>');
    });
    it('Only adds a <li></li> when adding subsequent child nodes', function () {
        firstItem().click();

        addButton().click();
        addButton().click();

        expect(firstItem().html()).toContain('<ul><li class="expanded"><span>Start Typing</span></li><li class="expanded"><span>Start Typing</span></li></ul>');
    });
    it('Fails noisily if an invalid root node is provided', function () {
        assertRootIsInvalid(null);
        assertRootIsInvalid($("#someRootWithoutIdealist"));
    });
    it('Fails noisily if no saver is provided', function () {
        expect(function() {
            new IdeaList($divToPopulate, null);
        }).toThrow("No saver provided");
    });
    it('Notices when a node has changed and asks the saver to save', function () {
        spyOn(saver, 'save');
        firstItem().click();
        addButton().click();

        var childItem = firstItem().find("li").first();
        childItem.click();
        childItem.find("span").html("some tweaked value");

        firstItem().click();

        expect(saver.save).toHaveBeenCalledWith($divToPopulate);
    });
//    it('Notices when a node has changed and asks the saver to save', function () {
//        spyOn(storage, 'save');
//        var theList = given(Idea("root", [Idea("childOne"), Idea("childTwo")]));
//
//        select("childTwo");
//        change("childTwo", "child2");
//        select("childOne");
//
//        expect(storage.save).toHaveBeenCalledWith(Idea("root", [Idea("childOne"), Idea("child2")]));
//    });

    function assertRootIsInvalid(someRoot) {
        expect(function() {
            new IdeaList(someRoot, new Saver());
        }).toThrow("No root node provided");
    }

    function firstItem() {
        return $divToPopulate.find("li").first();
    }

    function addButton() {
        return $("#options").find("a").first();
    }
});