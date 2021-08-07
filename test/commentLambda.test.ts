import produce from "immer";

import "../jest/jestSetup";
import { handler } from "../src/comment";
import { mockUser, createMockEvent } from "../jest/defaultArguments";

const mockComment = {
  _id: "610c18ce0c99eb2950812a1c",
  body: "Muzzamil Shaikh",
  parentId: "6107e825ff14da0870e4b62f",
};

const updatedMockComment = produce(mockComment, (draft) => {
  draft.body = "updated Muzzamil shaikh";
});

const createCommentEvent = createMockEvent("createComment", mockComment);
const updateCommentEvent = createMockEvent("updateComment", updatedMockComment);

describe("Comment Lambda Test", () => {
  it("createComment test", async () => {
    const comment = await handler(createCommentEvent);
    expect(comment._id).toBeDefined();
    expect(comment.body).toBe(mockComment.body);
    expect(comment.createdBy._id).toBeDefined();
  });

  it("updateComment test", async () => {
    await handler(createCommentEvent);
    const comment = await handler(
      createMockEvent("updateComment", updatedMockComment)
    );

    expect(comment._id).toBeDefined();
    expect(comment.body).toBe(updatedMockComment.body);
    expect(comment.createdBy._id).toBeDefined();
  });

  it("getComment test", async () => {
    await handler(createCommentEvent);
    const comment = await handler(
      createMockEvent("getComment", { _id: mockComment._id })
    );
    expect(comment._id).toBeDefined();
    expect(comment.body).toBe(mockComment.body);
    expect(comment.createdBy._id).toBeDefined();
    expect(comment.createdAt).toBeDefined();
  });

  // it("getCommentsByParentID Test", async () => {
  //   await handler(createCommentEvent);
  //   const res = await handler(
  //     createMockEvent("getCommentsByParentID", {
  //       parentId: "6107e825ff14da0870e4b62f",
  //     })
  //   );
  //   const comment = res.data[0];
  //   expect(comment.body).toBe(mockComment.body);
  // });

  it("deleteComment test", async () => {
    await handler(createCommentEvent);
    const res = await handler(
      createMockEvent("deleteComment", { _id: mockComment._id })
    );
    expect(res).toBe(true);
  });
});
