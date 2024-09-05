import chai, { expect } from 'chai';
import chaiHttp from "chai-http";
import server from "../../index";
import User from "../../models/User";
import { Response } from "superagent";

chai.use(chaiHttp);
console.log("type",typeof chai);
// const { expect } = chai;

describe("POST /signup", function () {
	beforeEach(async function () {
		await User.deleteMany({});
	});

	it("should register a new user and return the user details", (done) => {
		const user = {
			username: "testuser",
			email: "testuser@example.com",
			password: "testpassword",
		};

		chai.request.execute(server)
			.post("/signup")
			.send(user)
			.end((err: any, res: Response) => {
				if (err) done(err);

				expect(res).to.have.status(200);
				expect(res.body).to.be.an("object");
				expect(res.body)
					.to.have.property("username")
					.eql(user.username);
				expect(res.body).to.have.property("email").eql(user.email);
				expect(res.body).to.have.property("role").eql("customer");
				done();
			});
	});

	it("should return 400 for invalid input", (done) => {
		const invalidUser = {
			username: "",
			email: "invalidemail",
			password: "",
		};

		chai.request.execute(server)
			.post("/signup")
			.send(invalidUser)
			.end((err: any, res: Response) => {
				if (err) done(err);

				expect(res).to.have.status(400);
				expect(res.body).to.have.property("error").eql("Invalid Input");
				done();
			});
	});

	it("should handle server errors gracefully", (done) => {
		chai.request.execute(server)
			.post("/signup")
			.send({
				username: "testuser",
				email: "testuser@example.com",
				password: "testpassword",
			})
			.end((err: any, res: Response) => {
				if (err) done(err);

				// Assuming that a server error results in a 500 status code
				expect(res).to.have.status(500);
				expect(res.body)
					.to.have.property("error")
					.eql("An unknown error occurred");
				done();
			});
	});
});
