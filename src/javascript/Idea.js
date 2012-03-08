//

function Idea(description, children) {
    var desc = description;
    var kids = children ? children : [];

    this.description = function () { return desc; };
    this.children = function () { return kids; };
    this.hasChildren = function () { return kids.length > 0; };
    this.print = function () { return desc + " [" + kids.length + "]"; };
    this.addChild = function (drugs) { kids.push(drugs); };
    this.toJSON = function () {
        return {description:desc, children:kids};
    };
}

Idea.inflateFrom = function (jsonString) {
    return JSON.parse(jsonString, reviver);

    function reviver(key, value) {
        return validIdea(value) ? new Idea(value.description, value.children) : value;
    }

    function validIdea(value) {
        return value && typeof value === "object" && value.description && value.children;
    }
};