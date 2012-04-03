//

var shiftyList;
var A_LIST = '' +
        '<ul id="aList" class="shiftyList">' +
        '    <li><span>Parent1</span></li>' +
        '    <li>' +
        '        <span>Parent2</span>' +
        '        <ul>' +
        '            <li><span>ChildA</span></li>' +
        '            <li>' +
        '                <span>ChildB</span>' +
        '                <ul>' +
        '                    <li><span>GrandChildA</span></li>' +
        '                    <li><span>GrandChildB</span></li>' +
        '                </ul>' +
        '            </li>' +
        '        </ul>' +
        '    </li>' +
        '    <li><span>Parent3</span></li>' +
        '</ul>';

describe('ShiftyList', function () {

    beforeEach(function () {
        $("body").append(A_LIST);
        shiftyList = new ShiftyList($("#aList"));
    });

    afterEach(function () {
        $("#aList").remove();
    });

    it('Nodes are draggable', function () {
        expect(span("ChildA").attr("draggable")).toBeTruthy();
    });
    it('Dragged nodes are styled differently', function () {
        shiftyList.dragStart(span("ChildA"));

        expect(span("ChildA").hasClass("drag")).toBeTruthy();
    });
    it('We can drop a child onto an ancestor', function () {
        shiftyList.drop(span("GrandChildA"), span("Parent2"));

        expect(ancestry(span("GrandChildA"))).toEqual("GrandChildA");
    });
    it('We cannot drop an ancestor onto a child', function () {
        shiftyList.drop(span("Parent2"), span("GrandChildA"));

        expect(ancestry(span("GrandChildA"))).toEqual("GrandChildA, ChildB, Parent2");
    });

    function ul(text) {
        return span(text).parent("ul");
    }

    function span(text) {
        return $("#aList li").filter(function () {
            return $(this).children("span").text() == text;
        }).children("span");
    }

    function ancestry($element) {
        return $element.parents("li").map(function() {
            return $(this).children("span").first().text();
        }).get().join(", ");
    }
});