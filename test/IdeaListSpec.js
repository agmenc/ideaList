//

var divToPopulate;
var ideaList;
var A_PRE_CANNED_LIST = '' +
        '<div id="divToPopulate" class="ideaList"></div>' +
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
    divToPopulate = $("#divToPopulate");
});

describe('IdeaList', function () {

    beforeEach(function () {
        divToPopulate.html('<ul><li><span>Some root node</span></li></ul>');
        ideaList = new IdeaList(divToPopulate);
    });

    it('Allows the user to select a node', function () {
        var firstItem = divToPopulate.find("li").first();

        firstItem.click();

        expect(firstItem.find("span").hasClass("selected")).toEqual(true);
    });
    it('Displays options to add or delete child nodes', function () {
        var firstItem = divToPopulate.find("li").first();

        firstItem.click();

        expect(divToPopulate.html()).toContain('<div id="options" class="options"><a id="addChild" href="">add</a> | <a id="deleteChild" href="">delete</a></div>');
    });
    it('Adds a <ul></ul> containing a <li></li> when adding the first child node', function () {
        var firstItem = divToPopulate.find("li").first();
        firstItem.click();

        var addButton = firstItem.find("a").first();
        addButton.click();

        expect(firstItem.html()).toContain('<ul><li class="expanded"><span>Start Typing</span></li></ul>');
    });
    it('Only adds a <li></li> when adding subsequent child nodes', function () {
        var firstItem = divToPopulate.find("li").first();
        firstItem.click();

        var addButton = firstItem.find("input").first();
        addButton.click();

        expect(firstItem.html()).toContain('<ul><li class="expanded"><span>Start Typing</span></li></ul>');
    });
});