//

var saver;
var storage;

var SIMPLES = '' +
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
        '</div>';

var REAL_EXAMPLE = '' +
        '<div id="someId" class="ideaList">' +
        '    <ul>' +
        '        <li class="expanded">' +
        '            <span class="" contenteditable="true">Start Typing</span>' +
        '            <ul style="display: block;">' +
        '                <li class="contracted">' +
        '                    <span class="selected" contenteditable="true">A</span>' +
        '                    <div id="someId_options" class="options">' +
        '                        <a id="addChild" href="">add</a> | <a id="deleteChild" href="">delete</a>' +
        '                    </div>' +
        '                </li>' +
        '            </ul>' +
        '        </li>' +
        '    </ul>' +
        '    <div class="hidden">' +
        '       <div id="newChild">' +
        '           <ul>' +
        '               <li>' +
        '                   <span>New idea</span>' +
        '               </li>' +
        '           </ul>' +
        '       </div>' +
        '    </div>' +
        '</div>';

describe('Saver', function () {

    beforeEach(function () {
        storage = new StorageProxy();
        saver = new Saver(storage);
    });

    afterEach(function () {
        $("#someIdeaList").remove();
    });

    it('Traverses the HTML to construct JSON to parse and save when saving locally', function () {
        $("body").append(SIMPLES);
        spyOn(storage, 'save');

        saver.save($("#someIdeaList"));

        var jsonTree = new Idea("Root node", [new Idea("Child 1"), new Idea("Child 2", [new Idea("Grandchild 1")]), new Idea("Child 3")]);
        expect(storage.save).toHaveBeenCalledWith("someIdeaList", strung(jsonTree));
    });
    it('Traverses different HTML too', function () {
        $("body").append(REAL_EXAMPLE);
        spyOn(storage, 'save');

        saver.save($("#someId"));

        var jsonTree = new Idea("Start Typing", [new Idea("A")]);
        expect(storage.save).toHaveBeenCalledWith("someId", strung(jsonTree));
    });
    it('Delegates to the Storage proxy to clear storage', function () {
        spyOn(storage, 'clear');

        saver.clear($("#someIdeaList"));

        expect(storage.clear).toHaveBeenCalled();
    });
});
