//

var saver;
var storage;
var simpleExampleJson = new Idea("Root node", [new Idea("Child 1"), new Idea("Child 2", [new Idea("Grandchild 1")]), new Idea("Child 3")]);
var realExampleJson = new Idea("Start Typing", [new Idea("A")]);

var SIMPLES = '' +
        '<div id="simpleExample" class="ideaList">' +
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
        '<div id="realExample" class="ideaList">' +
        '    <ul>' +
        '        <li class="expanded">' +
        '            <span class="" contenteditable="true">Start Typing</span>' +
        '            <ul style="display: block;">' +
        '                <li class="contracted">' +
        '                    <span class="selected" contenteditable="true">A</span>' +
        '                    <div id="realExample_options" class="options">' +
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
        spyOn(storage, 'save');
        $("body").append(SIMPLES);
        $("body").append(REAL_EXAMPLE);
    });

    afterEach(function () {
        $("#simpleExample").remove();
        $("#realExample").remove();
    });

    it('Traverses the HTML to construct JSON to parse and save when saving locally', function () {
        saver.save($("#simpleExample"));

        expect(storage.save).toHaveBeenCalledWith("simpleExample", strung(simpleExampleJson));
    });

    it('Traverses different HTML too', function () {
        saver.save($("#realExample"));

        expect(storage.save).toHaveBeenCalledWith("realExample", strung(realExampleJson));
    });

    it('Returns the json to the caller for export', function () {
        expect(saver.exportTree($("#simpleExample"))).toEqual(strung(simpleExampleJson));
        expect(saver.exportTree($("#realExample"))).toEqual(strung(realExampleJson));
    });
});
