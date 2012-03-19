//

var NOT_A_LIST = '<div id="notAList"></div>';
var PRE_CANNED_LIST = '' +
        '<div id="preCannedList" class="ideaList">' +
        '   <ul><li class="expanded"><span>A pre-canned list</span></li></ul>' +
        '</div>';
var HIERARCHICAL_LIST = '' +
        '<div id="hierarchicalList" class="ideaList">' +
        '   <ul>' +
        '       <li class="expanded">' +
        '           <span>Hierarchical list</span>' +
        '           <ul>' +
        '               <li>' +
        '                   <span>First child node</span>' +
        '                   <ul>' +
        '                       <li><span>First grandchild node</span></li>' +
        '                   </ul>' +
        '               </li>' +
        '               <li>' +
        '                   <span>Second child node</span>' +
        '               </li>' +
        '           </ul>' +
        '       </li>' +
        '   </ul>' +
        '</div>';

var $notAList;
var saver;
var notNetscapeNavigator;

describe('Navigator', function () {

    beforeEach(function () {
        $("body").append(PRE_CANNED_LIST)
                .append(NOT_A_LIST)
                .append(HIERARCHICAL_LIST);
        $notAList = $("#notAList");
        saver = new Saver(new StorageProxy());

        notNetscapeNavigator = new Navigator($("#preCannedList").first(), saver);
    });

    afterEach(function () {
        $("#preCannedList").remove();
        $("#hierarchicalList").remove();
    });

    it('Fails noisily if an invalid root node is provided', function () {
        assertRootIsInvalid(null);
        assertRootIsInvalid($("#notAList"));
    });
    it('Fails noisily if no saver is provided', function () {
        expect(function() {
            new Navigator($("#preCannedList"), null);
        }).toThrow("No saver provided");
    });
    it('Adds some hidden options and templates for creating new items', function () {
        var $hiddenDiv = notNetscapeNavigator.root().find("div.hidden").first();
        var $optionsDiv = $hiddenDiv.find("#preCannedList_options");
        var $listTemplate = $hiddenDiv.find("#newChild ul");

        expect($optionsDiv.html()).toEqual('<a id="addChild" href="">add</a> | <a id="deleteChild" href="">delete</a>');
        expect($listTemplate.html()).toContain('<li><span>New idea</span></li>');
    });
    it('Allows the user to select a node', function () {
        description("A pre-canned list").click();

        expect(description("A pre-canned list").hasClass("selected")).toEqual(true);
    });
    it('Displays options to add or delete child nodes', function () {
        description("A pre-canned list").click();

        expect(container("A pre-canned list").html()).toContain('<div id="preCannedList_options" class="options"><a id="addChild" href="">add</a> | <a id="deleteChild" href="">delete</a></div>');
    });
    it('Adds a <ul></ul> containing a <li></li> when adding the first child node', function () {
        description("A pre-canned list").click();
        addButton().click();

        expect(container("A pre-canned list").html()).toContain('<ul><li class="expanded"><span>New idea</span></li></ul>');
    });
    it('Only adds a <li></li> when adding subsequent child nodes', function () {
        description("A pre-canned list").click();
        addButton().click();
        addButton().click();

        expect(container("A pre-canned list").html()).toContain('<ul><li class="expanded"><span>New idea</span></li><li class="expanded"><span>New idea</span></li></ul>');
    });
    it('Notices when a node has changed and asks the saver to save', function () {
        spyOn(saver, 'save');

        description("A pre-canned list").click();
        addButton().click();

        description("New idea").click();
        description("New idea").html("some tweaked value");

        description("A pre-canned list").click();
        expect(saver.save).toHaveBeenCalledWith(notNetscapeNavigator.root());
    });
    it('Allows the user to delete leaf nodes', function () {
        notNetscapeNavigator = new Navigator($("#hierarchicalList"), saver);
        description("First grandchild node").click();
        expect(exists(description("First grandchild node"))).toBeTruthy();

        deleteButton().click();

        expect(exists(description("First grandchild node"))).toBeFalsy();
    });
    it('Allows the user to delete node trees', function () {
        notNetscapeNavigator = new Navigator($("#hierarchicalList"), saver);
        description("First child node").click();
        expect(exists(description("First child node"))).toBeTruthy();
        expect(exists(description("First grandchild node"))).toBeTruthy();

        deleteButton().click();

        expect(exists(description("First child node"))).toBeFalsy();
        expect(exists(description("First grandchild node"))).toBeFalsy();
    });
    it('Deleting nodes fires a save', function () {
        notNetscapeNavigator = new Navigator($("#hierarchicalList"), saver);
        description("First grandchild node").click();
        spyOn(saver, 'save');

        deleteButton().click();

        expect(saver.save).toHaveBeenCalledWith(notNetscapeNavigator.root());
    });
//    it('If user deletes the root node, they get an annoying "Are you sure?" dialog', function () {
//        expect(true).toBeFalsy();
//    });
    // TODO - CAS - 14/03/2012 - now we can delete the Clear All feature
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
            new Navigator(someRoot, new Saver(new StorageProxy()));
        }).toThrow("No root node provided");
    }

    function clearAll() {
        var dataName = notNetscapeNavigator.root().attr("id");
        return $("a#" + dataName + "_clearAll").first();
    }

    function container(text) {
        return description(text).parent("li");
    }

    function description(text) {
        return notNetscapeNavigator.root().find("span").filter(function () {
            return $(this).text() == text;
        }).first();
    }

    // TODO - CAS - 14/03/2012 - Just use option("Add") and option("Delete")
    function addButton() {
        return options().first();
    }

    function deleteButton() {
        return options().last();
    }

    function options() {
        var dataName = notNetscapeNavigator.root().attr("id");
        return $("#" + dataName + "_options").find("a");
    }
});