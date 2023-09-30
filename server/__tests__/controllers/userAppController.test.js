// userController.test.js

const userController = require("../../controllers/userController");

describe("getUserList", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return a list of users with role "user"', async () => {
    User.find.mockResolvedValue([
      { _id: "1", name: "John", role: "user" },
      { _id: "2", name: "Jane", role: "user" },
    ]);

    await userController.getUserList(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith([
      { _id: "1", name: "John" },
      { _id: "2", name: "Jane" },
    ]);
  });

  it("should handle errors", async () => {
    User.find.mockRejectedValue(new Error("Database error"));

    await userController.getUserList(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Error retrieving users",
    });
  });
});
