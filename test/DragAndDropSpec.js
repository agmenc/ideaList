//

describe('DragAndDrop', function () {

    var dnd;

    beforeEach(function () {
        $("body").append('<div id="aThing">Monkeys</div>');
        dnd = new DragAndDrop($("#aList"), function() {});
    });

    afterEach(function () {
        $("#aThing").remove();
    });

    it('Dragged nodes are styled differently', function () {
        expect($("#aThing").hasClass("drag")).toBeFalsy();

        dnd.dragStart($("#aThing"));

        expect($("#aThing").hasClass("drag")).toBeTruthy();
    });
});