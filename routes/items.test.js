process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");

let items = require("../fakeDb");

let item = { name: "aNewItem", price: 1000 };

beforeEach(async () => {
    items.push(item);
});

afterEach(async () => {
    items = [];
});

describe("GET all /items", () => {
    test("Get a list of all items in fakeDb", async () => {
        const res = await request(app).get(`/items`);
        const { items } = res.body;

        expect(res.statusCode).toBe(200);
        expect(items).toHaveLength(1);
        expect(res.body).toEqual({ items: [{ name: "aNewItem", price: 1000 }] });
    });
});

describe("GET /items/:name", () => {
    test("Gets a single item by name", async () => {
        const res = await request(app).get(`/items/${item.name}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.item).toEqual(item);
        expect(res.body).toEqual({ item: { name: "aNewItem", price: 1000 } });
    });

    test("Responds with 404 if item not found", async () => {
        const res = await request(app).get(`/items/nothere`);

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: 'Not Found' })
    });
});

describe("POST /items", () => {
    test("Creates a new item", async () => {
        const res = await request(app).post(`/items`)
            .send({
                name: "anotherNewItem",
                price: 999
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.item).toHaveProperty("name");
        expect(res.body.item).toHaveProperty("price");
        expect(res.body.item.name).toEqual("anotherNewItem");
        expect(res.body.item.price).toEqual(999);
    });
});

describe("PATCH /items/:name", () => {
    test("Updates a single item", async () => {
        const res = await request(app).patch(`/items/${item.name}`)
            .send({
                name: "updatersons"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.item).toEqual({ name: "updatersons" });
        expect(res.body.item.name).toEqual("updatersons");
    });

    test("Responds with 404 if item not found", async () => {
        const res = await request(app).patch(`/items/nothere`);

        expect(res.statusCode).toBe(404);
    });
});

describe("DELETE /items/:name", () => {
    test("Deletes a single item", async () => {
        const res = await request(app).delete(`/items/${item.name}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Deleted" });
    });
});