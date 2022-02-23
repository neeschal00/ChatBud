// import supertest from 'supertest';
// import app from '.app.js';

const supertest = require('supertest');
const app = require('./app');


describe('POST /users/login', () => {

    describe("get user",()=>{
        test("GET /users/all",(done)=>{
            supertest(app)
            .get("/users/all")
            .expect(200)
            .end((err,res)=>{
                if(err) return done(err);
                done();
            })
        });
    })
    describe("get chats",()=>{
        test("GET /chat/all", (done) => {   
            supertest(app)
            .get("/chat/all")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                done();
            })
        });
    })

    describe("register",()=>{
        test("POST /users/register",(done)=>{
            supertest(app)
            .post("/users/register")
            .send({
                "name":"akkans",
                "email":"akkans@gmail.com",
                // "password":""
        }).expect(400).end((err,res)=>{
            if(err) return done(err);
            done();
        })
    })
    describe("given a username and password", () => {
        it("should return a token", () => {
            return supertest(app)
                .post("/users/login")
                .send({
                    username: "nishan",
                    password: "nishan02"
                })
                .expect(200)
                .expect("Content-Type", /json/)
                .then(res => {
                    expect(res.body.token).toBeDefined();
                });
        });
    })

    describe("when the username and password is ",()=>{
        it("should return an error",()=>{
            return supertest(app)
                .post("/users/login")
                .send({
                    username: "test",
                    password: "test"
                })
                .expect(400)
                .expect
                
        })
    })

})})