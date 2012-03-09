//

var saver;
var storage;

beforeEach(function () {
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
    storage = new StorageStub();
    saver = new Saver(storage);
});

afterEach(function () {
    $("#divWithChildren").remove();
});

describe('Saver', function () {
    it('Traverses the HTML to construct JSON to parse and save when saving locally', function () {
        spyOn(storage, 'save');

        saver.save($("#someIdeaList"));

        var jsonTree = new Idea("Root node", [new Idea("Child 1"), new Idea("Child 2", [new Idea("Grandchild 1")]), new Idea("Child 3")]);
        expect(storage.save).toHaveBeenCalledWith("someIdeaList", strung(jsonTree));
    });
});
