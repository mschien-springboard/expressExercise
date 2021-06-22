const ExpressError = require("./expressError");
const items = require("./fakeDb");

class Item {
    constructor(name, price) {
        this.name = name;
        this.price = price;

        items.push(this);
    }

    static findAll() {
        return items;
    }

    static find(name) {
        const foundItem = items.find(i => i.name === name);
        if (foundItem === undefined) {
            throw new ExpressError("Not Found", 404);
        }
        return foundItem;
    }

    static update(name, data) {
        let foundItem = Item.find(name);
        if (foundItem === undefined) {
            throw new ExpressError("Not Found", 404);
        }
        foundItem.name = data.name;
        foundItem.price = data.price;

        return foundItem;
    }

    static remove(name) {
        let foundIdx = items.findIndex(i => i.name === name);
        if (foundIdx === -1) {
            throw new ExpressError("Not Found", 404);
        }
        items.splice(foundIdx, 1);
    }
}

module.exports = Item;