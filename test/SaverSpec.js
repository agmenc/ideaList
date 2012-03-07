//

var saver;

beforeEach(function () {
    storage = new StorageStub();
    $("body").append('' +
            '<div id="someIdeaList" class="ideaList">' +
            '   <ul>' +
            '       <li><span>Root node</span>' +
            '           <ul>' +
            '               <li><span>Child 1</span></li>' +
            '               <li><span>Child 2</span>' +
            '                   <ul>' +
            '                       <li><span>Grandchild 1</span></li>' +
            '                   </ul>' +
            '               </li>' +
            '               <li><span>Child 3</span></li>' +
            '           </ul>' +
            '       </li>' +
            '   </ul>' +
            '</div>'
    );
    saver = new Saver();
});

afterEach(function () {
    $("#divWithChildren").remove();
});

describe('Saver', function () {
    it('Traverses the HTML to construct JSON to parse and save when saving locally', function () {
        spyOn(storage, 'save');

        saver.save($("#someIdeaList"));

        var expected = new Idea("Root node", [new Idea("Child 1"), new Idea("Child 2", [new Idea("Grandchild 1")]), new Idea("Child 3")]);
        var strung = JSON.stringify(expected);
        console.log("strung = " + strung);
        var deFunctionedExpected = JSON.parse(strung);
        expect(storage.save).toHaveBeenCalledWith("someIdeaList", deFunctionedExpected);
    });
    it('Saves the state of the ideaList as a stringified JSON object', function () {
        spyOn(storage, 'save');

        saver.save($("#someIdeaList"));

        expect(storage.retrieve("emptyDiv")).toEqual('{"description": "Root node", "children": [{"description": "Child 1", "children": []}]}');
    });
});
