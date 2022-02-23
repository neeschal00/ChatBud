import supertest from 'supertest';
import app from '.app.js';

describe('POST /users/login', () => {
    describe("given a username and password", () => {
        it("should return a token", () => {
            return supertest(app)
                .post("/users/login")
                .send({
                    username: "test",
                    password: "test"
                })
                .expect(200)
                .expect("Content-Type", /json/)
                .then(res => {
                    expect(res.body.token).toBeDefined();
                });
        });
    })

    describe("when the username and password is ")

})