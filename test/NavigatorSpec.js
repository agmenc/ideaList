//

var $preCannedList;
var saver;
var ideaList;
var PRE_CANNED_LIST = '' +
        '<div id="preCannedList" class="ideaList">' +
        '   <ul><li class="expanded"><span>A pre-canned list</span></li></ul>' +
        '   <div class="hidden">' +
        '      <div id="preCannedList_options" class="options"><a id="addChild" href="">add</a> | <a id="deleteChild" href="">delete</a></div>' +
        '      <div id="newChild">' +
        '          <ul>' +
        '              <li><span>Start Typing</span></li>' +
        '          </ul>' +
        '      </div>' +
        '   </div>' +
        '</div>';
var NOT_A_LIST = '<div id="someRootWithoutIdeaListClass"></div>';
var NO_OPTIONS_LIST = '<div id="noOptionsList" class="ideaList"></div>';

beforeEach(function () {
    $("body")
            .append(PRE_CANNED_LIST)
            .append(NOT_A_LIST)
            .append(NO_OPTIONS_LIST);
    $preCannedList = $("#preCannedList");
    saver = new Saver($preCannedList);
});

describe('Navigator', function () {

    beforeEach(function () {
        $preCannedList.html(PRE_CANNED_LIST);
        console.log("1");
        ideaList = new Navigator($preCannedList, saver);
        console.log("2");
    });

    it('Fails noisily if an invalid root node is provided', function () {
        assertRootIsInvalid(null);
        assertRootIsInvalid($("#someRootWithoutIdealistClass"));
    });
    it('Fails noisily if no saver is provided', function () {
        expect(function() {
            new Navigator($preCannedList, null);
        }).toThrow("No saver provided");
    });
    it('Fails noisily if it cannot find a hidden options div bundled with the root', function () {
        expect(function() {
            new Navigator($("#noOptionsList"), saver);
        }).toThrow("Cannot find options div in Navigator. Looking for #noOptionsList_options");
    });
    it('Allows the user to select a node', function () {
        firstItem().click();

        expect(firstItem().find("span").hasClass("selected")).toEqual(true);
    });
    it('Displays options to add or delete child nodes', function () {
        firstItem().click();

        expect($preCannedList.html()).toContain('<div id="preCannedList_options" class="options"><a id="addChild" href="">add</a> | <a id="deleteChild" href="">delete</a></div>');
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
    it('Notices when a node has changed and asks the saver to save', function () {
        spyOn(saver, 'save');
        firstItem().click();
        addButton().click();

        var childItem = firstItem().find("li").first();
        childItem.click();
        childItem.find("span").html("some tweaked value");

        firstItem().click();

        expect(saver.save).toHaveBeenCalledWith($preCannedList);
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
            new Navigator(someRoot, new Saver());
        }).toThrow("No root node provided");
    }

    function firstItem() {
        return $preCannedList.find("li").first();
    }

    function addButton() {
        return $("#preCannedList_options").find("a").first();
    }
});