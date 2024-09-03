import chaiHttp from "chai-http/index.js";
import server from "../../index.js";
import User from "../../models/User.js";

let chai;
await import("chai").then((result) => (chai = result.use(chaiHttp)));

chai.should();

describe("Signup api", function () {
	beforeEach(function (done) {
		User.deleteMany({})
			.then((result) => {
				console.log("Users deleted:", result);
				done();
			})
			.catch((error) => {
				console.error("Error deleting users:", error);
				done(error);
			});
	});

	describe("POST /auth/signup", function () {
		it("it should register a new user", (done) => {
			const user = {
				username: "testuser",
				email: "testuser@example.com",
				password: "testpassword",
			};

			chai.request(server)
				.post("/auth/signup")
				.send(user)
				.end((err, res) => {
					if (err) done(err);

					res.should.have.status(200);
					res.body.should.be.a("object");
					res.body.should.have.property("username").eql("testuser");
					done();
				});
		});
	});
});
