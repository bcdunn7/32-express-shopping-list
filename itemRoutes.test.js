process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('./app');
let items = require('./fakeDb');

let o = {
        name: 'orange',
        price: 2.50
        }
let a = {
        name: 'apple',
        price: 3
        }
let g = {
        name: 'grapes',
        price: 55
        }

beforeEach(function() {
  items.push(o);
  items.push(a);
  items.push(g);
});

afterEach(function() {
	items.length = 0;
});

describe('GET /items', () => {
    test('get all itmes', async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{name: 'orange', price: 2.50}, {name: 'apple', price: 3}, {name: 'grapes', price: 55}])
    })
})

describe('GET /items/:name', () => {
    test('get item by name', async () => {
        const res = await request(app).get(`/items/${o.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({name: 'orange', price: 2.50});
    })
    test('404 if invalid item', async () => {
        const res = await request(app).get(`/items/random`);
        expect(res.statusCode).toBe(404)
    })
})

describe('POST /items', () => {
    test('create item', async () => {
        const res = await request(app).post('/items').send({name: 'milk', price:3});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({"added": {"name": "milk", "price": 3}});
    })
    test('404 if name or price missing', async () => {
        const res = await request(app).post("/items").send({});
        expect(res.statusCode).toBe(400);
    })
})

describe("/PATCH /items/:name", () => {
    test("Updating a item's name", async () => {
      const res = await request(app).patch(`/items/${o.name}`).send({ name: "Orange Juice" });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        "updated": {
          "item": {
            "name": "Orange Juice",
            "price": 2.50
          }
        }
      });
    })
    test('404 if invalid item', async () => {
        const res = await request(app).patch('/items/notAname').send({ name: "Orange Juice" });
        expect(res.statusCode).toBe(404)
    })
})
  
describe("/DELETE /items/:name", () => {
    test("Deleting a item", async () => {
      const res = await request(app).delete(`/items/${o.name}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ 'message': 'Deleted' })
    })
    test("404 if deleting invalid item", async () => {
        const res = await request(app).delete(`/items/random`);
        expect(res.statusCode).toBe(404);
    })
})