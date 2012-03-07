//

describe('Idea', function () {
    it('Knows how to Stringify itself to a strict JSON format', function () {
        var idea = new Idea("Root node", [new Idea("Child", [new Idea("Grandchild")])]);

        var json = JSON.stringify(idea);

        expect(json).toEqual('{"description":"Root node","children":[{"description":"Child","children":[{"description":"Grandchild","children":[]}]}]}');
    });
    it('Knows how to inflate itself from a strict JSON format', function () {
        expect(false).toEqual(true);
    });
});
