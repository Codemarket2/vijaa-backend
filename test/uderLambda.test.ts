import "../jest/jestSetup";
import { handler } from "../src/user";
import {
  mockUser,
  mockUserId,
  createMockEvent,
} from "../jest/defaultArguments";

const updatedMockUser = {
  ...mockUser,
  name: "Elliot",
  email: "elliot@domain.com",
};

const updateMockUserProfile = {
  ...mockUser,
  name: "Elliot",
  email: "elliot@domain.com",
  userProfile: {
    cancerType: "bone cancer",
    doctors: [{ name: "sachin", hospital: "city hospital" }],
    symptoms: ["vitamin deficiency"],
  },
};

const createUserEvent = createMockEvent("createUser", mockUser);
const getUsersEvent = createMockEvent("getUsers");

const getUserByCognitoUserIdEvent = createMockEvent("getUserByCognitoUserId", {
  userId: mockUser.userId,
});
const updateUserEvent = createMockEvent("updateUser", updatedMockUser);
const updateUserStatusEvent = createMockEvent("updateUserStatus", {
  ...mockUser,
  status: false,
});

const updateUserProfileEvent = createMockEvent(
  "updateUserProfile",
  updateMockUserProfile
);

jest.mock("../src/user/utils/helper", () => {
  const adminToggleUserStatus = () => console.log("adminToggleUserStatus mock");
  return { adminToggleUserStatus };
});

describe("User Lambda Tests", () => {
  it("getUsers test", async () => {
    const users = await handler(getUsersEvent);
    expect(users.count).toBe(0);
    expect(users.users.length).toBe(0);
  });

  it("createUser test", async () => {
    const newUser = await handler(createUserEvent);
    expect(newUser._id).toBeDefined();
    expect(newUser.name).toBe(mockUser.name);
    expect(newUser.email).toBe(mockUser.email);
    expect(newUser.picture).toBe(mockUser.picture);
    expect(newUser.userId).toBe(mockUser.userId);
    expect(newUser.createdBy).toBe(mockUserId);
    expect(newUser.active).toBe(true);
  });

  it("getUserByCognitoUserId test", async () => {
    await handler(createUserEvent);
    const user = await handler(getUserByCognitoUserIdEvent);
    expect(user._id).toBeDefined();
    expect(user.name).toBe(mockUser.name);
    expect(user.email).toBe(mockUser.email);
    expect(user.picture).toBe(mockUser.picture);
    expect(user.userId).toBe(mockUser.userId);
    expect(user.createdBy).toBe(mockUserId);
    expect(user.active).toBe(true);
  });

  it("updateUser test", async () => {
    await handler(createUserEvent);
    const user = await handler(updateUserEvent);
    expect(user._id).toBeDefined();
    expect(user.name).toBe(updatedMockUser.name);
    expect(user.email).toBe(updatedMockUser.email);
    expect(user.picture).toBe(updatedMockUser.picture);
    expect(user.userId).toBe(updatedMockUser.userId);
    expect(user.createdBy).toBe(mockUserId);
    expect(user.active).toBe(true);
  });

  it("updateUserProfile Test", async () => {
    await handler(createUserEvent);
    const user = await handler(updateUserProfileEvent);
    expect(user._id).toBeDefined();
    expect(user.name).toBe(updateMockUserProfile.name);
    expect(user.email).toBe(updateMockUserProfile.email);
    expect(user.picture).toBe(updateMockUserProfile.picture);
    expect(user.userId).toBe(updateMockUserProfile.userId);
    expect(user.createdBy).toBe(mockUserId);
    expect(user.active).toBe(true);
    expect(user.userProfile.cancerType).toBe(
      updateMockUserProfile.userProfile.cancerType
    );
    expect(user.userProfile.doctors[0].name).toBe(
      updateMockUserProfile.userProfile.doctors[0].name
    );
    expect(user.userProfile.doctors[0].hospital).toBe(
      updateMockUserProfile.userProfile.doctors[0].hospital
    );
    expect(user.userProfile.symptoms[0]).toBe(
      updateMockUserProfile.userProfile.symptoms[0]
    );
  });

  it("updateUserStatus test", async () => {
    await handler(createUserEvent);
    const user = await handler(updateUserStatusEvent);
    expect(user._id).toBeDefined();
    expect(user.name).toBe(mockUser.name);
    expect(user.email).toBe(mockUser.email);
    expect(user.picture).toBe(mockUser.picture);
    expect(user.userId).toBe(mockUser.userId);
    expect(user.createdBy).toBe(mockUserId);
    expect(user.active).toBe(false);
  });
});
