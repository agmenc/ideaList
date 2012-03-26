//

describe('StorageProxy', function () {
    var storage;

    beforeEach(function () {
        storage = new StorageProxy();
    });

    it('Stores and retrieves key-value pairs', function () {
        storage.save("monkeys", "bananas");

        expect(storage.retrieve("monkeys")).toEqual("bananas");
    });
    it('Knows if a value has been stored locally', function () {
        storage.save("monkeys", "bananas");

        expect(storage.holds("monkeys")).toBeTruthy();
        expect(storage.holds("water")).toBeFalsy();
    });
    it('Works from real JSON data', function () {
        var jsonTree = new Idea("Root node", [new Idea("Child 1"), new Idea("Child 2", [new Idea("Grandchild 1")]), new Idea("Child 3")]);
        storage.save("someId", strung(jsonTree));

        var inflated = Idea.inflateFrom(storage.retrieve("someId"));

        expect(strung(inflated)).toEqual(strung(jsonTree));
    });
});
