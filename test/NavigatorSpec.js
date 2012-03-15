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
        '           <span>A pre-canned list</span>' +
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

var $preCannedList;
var $hierarchicalList;
var $notAList;
var saver;
var ideaList;
var $list;

describe('Navigator', function () {

    beforeEach(function () {
        $("body").append(PRE_CANNED_LIST)
                .append(NOT_A_LIST)
                .append(HIERARCHICAL_LIST);
        $preCannedList = $("#preCannedList");
        $hierarchicalList = $("#hierarchicalList");
        $notAList = $("#notAList");
        saver = new Saver(new StorageProxy());
        ideaList = new Navigator($preCannedList, saver);
    });

    afterEach(function () {
        $preCannedList.remove();
        $hierarchicalList.remove();
        $notAList.remove();
    });

    it('Fails noisily if an invalid root node is provided', function () {
        assertRootIsInvalid(null);
        assertRootIsInvalid($("#notAList"));
    });
    it('Fails noisily if no saver is provided', function () {
        expect(function() {
            new Navigator($preCannedList, null);
        }).toThrow("No saver provided");
    });
    it('Adds some hidden options and templates for creating new items', function () {
        var $hiddenDiv = $preCannedList.find("div.hidden").first();
        var $optionsDiv = $hiddenDiv.find("#preCannedList_options");
        var $listTemplate = $hiddenDiv.find("#newChild ul");

        expect($optionsDiv.html()).toEqual('<a id="addChild" href="">add</a> | <a id="deleteChild" href="">delete</a>');
        expect($listTemplate.html()).toContain('<li><span>New idea</span></li>');
    });
    it('Allows the user to select a node', function () {
        $list = $preCannedList;

        description("A pre-canned list").click();

        expect(description("A pre-canned list").hasClass("selected")).toEqual(true);
    });
    it('Displays options to add or delete child nodes', function () {
        $list = $preCannedList;

        description("A pre-canned list").click();

        expect(container("A pre-canned list").html()).toContain('<div id="preCannedList_options" class="options"><a id="addChild" href="">add</a> | <a id="deleteChild" href="">delete</a></div>');
    });
    it('Adds a <ul></ul> containing a <li></li> when adding the first child node', function () {
        $list = $preCannedList;

        description("A pre-canned list").click();
        addButton().click();

        expect(container("A pre-canned list").html()).toContain('<ul><li class="expanded"><span>New idea</span></li></ul>');
    });
    it('Only adds a <li></li> when adding subsequent child nodes', function () {
        $list = $preCannedList;

        description("A pre-canned list").click();
        addButton().click();
        addButton().click();

        expect(container("A pre-canned list").html()).toContain('<ul><li class="expanded"><span>New idea</span></li><li class="expanded"><span>New idea</span></li></ul>');
    });
    it('Notices when a node has changed and asks the saver to save', function () {
        spyOn(saver, 'save');
        $list = $preCannedList;

        description("A pre-canned list").click();
        addButton().click();

        description("New idea").click();
        description("New idea").html("some tweaked value");

        description("A pre-canned list").click();
        expect(saver.save).toHaveBeenCalledWith($preCannedList);
    });
    it('Allows the user to clear the tree', function () {
        spyOn(saver, 'clear');
        $list = $preCannedList;

        clearAll().click();

        expect(saver.clear).toHaveBeenCalled();
    });
    it('Allows the user to delete leaf nodes', function () {
        ideaList = new Navigator($hierarchicalList, saver);
        $list = $hierarchicalList;

        description("First grandchild node").click();
        expect(exists(description("First grandchild node"))).toBeTruthy();

        deleteButton().click();

        expect(doesNotExist("First grandchild node")).toBeTruthy();
    });
    it('Allows the user to delete node trees', function () {
        expect(true).toEqual(false);
    });
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

    function container(text) {
        var parent = description(text).parent("li");
        if (parent.length == 0) throw "There is no <li></li> parent of a span containing " + text;
        return parent;
    }

    function clearAll() {
        var dataName = $list.attr("id");
        return $("a#" + dataName + "_clearAll").first();
    }

    function doesNotExist(text) {
        return !exists(nodeDescription(text));
    }

    function description(text) {
        var found = nodeDescription(text);
        if (!exists(found)) throw 'Could not find item containing text "' + text + '"';
        return found;
    }

    function nodeDescription(text) {
        return $list.find("span").filter(
                function () {
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
        var dataName = $list.attr("id");
        return $("#" + dataName + "_options").find("a");
    }
});