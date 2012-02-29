//

describe('Saver', function () {
    it('Traverses the HTML to construct JSON to parse and save when saving locally', function () {
        expect(false).toEqual(true);
    });
    it('Saves the state of the ideaList as a JSON object', function () {
        spyOn(storage, 'save');

        listSaver.saveLocally();

        expect(storage.save).toHaveBeenCalledWith("emptyDiv", new Idea("Start Typing"));
    });
});
