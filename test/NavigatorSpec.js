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

        expect($optionsDiv.html()).toEqual(Navigator.options);
        expect($listTemplate.html()).toContain(Navigator.newChild);
    });
    it('Allows the user to select a node', function () {
        description("A pre-canned list").click();

        expect(description("A pre-canned list").hasClass("selected")).toEqual(true);
    });
    it('Displays options to add or delete child nodes', function () {
        description("A pre-canned list").click();

        expect(container("A pre-canned list").html()).toContain('<div id="preCannedList_options" class="options">' + Navigator.options + '</div>');
    });
    it('Adds a <ul></ul> containing a <li></li> when adding the first child node', function () {
        description("A pre-canned list").click();

        addButton().click();

        expect(container("A pre-canned list").html()).toContain('<ul>' + Navigator.newChild + '</ul>');
    });
    it('Adds a <li></li> but not a <ul></ul> when adding subsequent child nodes', function () {
        description("A pre-canned list").click();
        addButton().click();

        addButton().click();

        expect(container("A pre-canned list").html()).toContain('<ul>' + Navigator.newChild + Navigator.newChild + '</ul>');
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
    it('If user deletes the root node, they get an annoying "Are you sure?" dialog', function () {
        deleteRootNode(true);

        expect(window.confirm).toHaveBeenCalledWith("This will delete the entire tree. Is this your intention?");
    });
    it('If user deletes the root node, it really does all disappear', function () {
        deleteRootNode(true);

        expect(exists(description("Hierarchical list"))).toBeFalsy();
        expect(exists(description("First child node"))).toBeFalsy();
    });
    it('The delete dialog allows the user to back down from a total delete', function () {
        deleteRootNode(false);

        expect(exists(description("First child node"))).toBeTruthy();
    });
    it('If user deletes the root node, they have to start again', function () {
        deleteRootNode(true);

        expect(tree().text()).toEqual("Reload the page to build a new tree");
    });
    it('If user deletes the root node, the tree is wiped from storage', function () {
        spyOn(saver, 'save');

        deleteRootNode(true);

        expect(saver.save).toHaveBeenCalledWith(notNetscapeNavigator.root());
    });
    it('Asks the saver to extract backup text', function () {
        notNetscapeNavigator = new Navigator($("#hierarchicalList"), saver);
        spyOn(saver, 'exportTree');

        saveButton().click();

        expect(saver.exportTree).toHaveBeenCalledWith(notNetscapeNavigator.root());
    });
    it('Points an iFrame at exported JSON, so that users can save it', function () {
        notNetscapeNavigator = new Navigator($("#hierarchicalList"), saver);
        spyOn(saver, 'export').andReturn('{"description": "monkeys", "children": []}');

        saveButton().click();

        // expect iFrame src toEqual('{"description": "monkeys", "children": []}');
        expect(false).toEqual(true);
    });
//    it('Notices when a node has changed and asks the saver to save', function () {
//        spyOn(storage, 'save'); // ==> just assume this (i.e. always spy on this: it's a stub)
//        given(Idea("root", [Idea("childOne"), Idea("childTwo")]));
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

    function tree() {
        return notNetscapeNavigator.root();
    }

    // TODO - CAS - 14/03/2012 - Just use option("Add") and option("Delete")
    function addButton() {
        return options("add");
    }

    function deleteButton() {
        return options("delete");
    }

    function backupButton() {
        return options("save backup");
    }

    function options(text) {
        var dataName = notNetscapeNavigator.root().attr("id");
        return $("#" + dataName + "_options").find("a").filter(function() {
            return $(this).text() == text;
        });
    }

    function deleteRootNode(allowKill) {
        notNetscapeNavigator = new Navigator($("#hierarchicalList"), saver);
        spyOn(window, 'confirm').andReturn(allowKill);
        description("Hierarchical list").click();
        deleteButton().click();
    }
});