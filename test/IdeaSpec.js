//

var ideaListAsString;
var ideaListAsObject;

describe('Idea', function () {

    beforeEach(function () {
        ideaListAsString = '{"description":"Root node","children":[{"description":"Child","children":[{"description":"Grandchild","children":[]}]}]}';
        ideaListAsObject = new Idea("Root node", [new Idea("Child", [new Idea("Grandchild")])]);
    });

    it('Knows how to Stringify itself to a strict JSON format', function () {
        var stringified = JSON.stringify(ideaListAsObject);

        expect(stringified).toEqual(ideaListAsString);
    });
    it('Knows how to inflate itself from a strict JSON format', function () {
        var inflated = Idea.inflateFrom(ideaListAsString);

        expect(strung(inflated)).toEqual(strung(ideaListAsObject));
    });
});
