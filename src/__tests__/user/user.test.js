const { testServer, closeServices } = require("../config_test");
const { User } = require("../../models");

const createUser = async ({ name, status = "active" }) => {
  const newUser = await User.create({ name, status });

  return newUser.toJSON();
};

describe("############################### USER Apollo Integration ###############################", () => {
  afterAll(async () => {
    await closeServices();
  });

  it("Should save a new user", async () => {
    const userName = "User of Test 334";
    const userStatus = "active";
    const SAVE_USER = `
    mutation saveUserMut($input: UserInput) {
      saveUser(input: $input) {
        message
        status
        user {
          id
          name
          status
          tasksQtd
        }
      }
    }`;

    const result = await testServer.executeOperation({
      query: SAVE_USER,
      variables: {
        input: {
          name: userName,
          status: userStatus,
        },
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.saveUser.user.name).toBe(userName);
  });

  it("should update a user", async () => {
    const userName = "New User for update";
    const userStatus = "active";
    const newUser = await createUser({ name: userName, status: userStatus });

    const newUserId = newUser._id.toString();

    const SAVE_USER = `
    mutation saveUserMut($input: UserInput) {
      saveUser(input: $input) {
        message
        status
        user {
          id
          name
          status
          tasksQtd
        }
      }
    }`;

    const updateResult = await testServer.executeOperation({
      query: SAVE_USER,
      variables: {
        input: {
          id: newUserId,
          name: userName,
          status: userStatus,
        },
      },
    });

    expect(updateResult.errors).toBeUndefined();
    expect(updateResult.data?.saveUser.user.name).toBe(userName);
    expect(updateResult.data?.saveUser.user.id).toBe(newUserId);
  });

  it("should find a given user", async () => {
    const userName = `New User to be found (${Date.now()})`;
    const userStatus = "active";
    const newUser = await createUser({ name: userName, status: userStatus });

    const newUserId = newUser._id.toString();
    const newUserName = newUser.name;

    const LIST_USER = `
    query listUsersQuery($search: UserSearchInput) {
      listUsers(search: $search) {
        msg
        users {
          id
          name
          status
        }
      }
    }`;

    const userList = await testServer.executeOperation({
      query: LIST_USER,
      variables: {
        search: {
          name: newUserName,
        },
      },
    });

    expect(userList.errors).toBeUndefined();
    expect(userList.data?.listUsers.users.length).toBe(1);
    expect(userList.data?.listUsers.users[0].name).toBe(newUserName);
    expect(userList.data?.listUsers.users[0].id).toBe(newUserId);
  });
});
