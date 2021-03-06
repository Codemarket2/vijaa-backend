import '../jest/jestSetup';
import { handler } from '../src/post';
import { handler as listHandler } from '../src/list';
import { mockUser, createMockEvent } from '../jest/defaultArguments';

const mockPost = {
  _id: '60fc4d29f11b170008d9ec48',
  body: 'Hello Guys @@@__611003ae70e3a6000870e145^^__Doctors@@@^^^ yes @@@__60fc4d29f11b170008d9ec99^^__Dr John@@@^^^ new post',
  media: [],
};

const updatedMockPost = {
  ...mockPost,
  body: 'Hello Guys, How are you all doing?',
};

export const mockListType = {
  _id: '611003ae70e3a6000870e145',
  title: 'Doctors',
  description: 'Doctors description',
};

const mockListItem = {
  _id: '60fc4d29f11b170008d9ec99',
  types: [mockListType._id],
  title: 'Dr John',
  description: 'NYC',
  media: [],
};

const createPostEvent = createMockEvent('createPost', mockPost);
const createListTypeEvent = createMockEvent('createListType', mockListType);
const createListItemEvent = createMockEvent('createListItem', mockListItem);

// yarn test test/postLambda.test.ts

describe('Post Lambda Tests', () => {
  it('getMyPosts test', async () => {
    const res = await handler(createMockEvent('getMyPosts'));
    expect(res.count).toBe(0);
    expect(res.data.length).toBe(0);
  });

  it('getPostsByUserId test', async () => {
    await listHandler(createListTypeEvent);
    await listHandler(createListItemEvent);
    await handler(createPostEvent);
    const res = await handler(
      createMockEvent('getPostsByUserId', { userId: mockUser._id })
    );
    expect(res.count).toBe(1);
    expect(res.data.length).toBe(1);
    const post = res.data[0];
    expect(post.body).toBe(mockPost.body);
    expect(post.media.length).toBe(mockPost.media.length);
    expect(post.createdBy._id).toBeDefined();
    expect(post.createdBy.name).toBe(mockUser.name);
    expect(post.createdBy.picture).toBe(mockUser.picture);
    const tag = post.tags[0];
    // console.log(post.tags[1].tag.types);
    expect(tag.tag._id.toString()).toBe(mockListType._id);
    expect(tag.tag.title).toBe(mockListType.title);
  });

  it('getPosts test', async () => {
    const res = await handler(createMockEvent('getPosts'));
    expect(res.count).toBe(0);
    expect(res.data.length).toBe(0);
  });

  it('getPost test', async () => {
    await handler(createPostEvent);
    const post = await handler(
      createMockEvent('getPost', { _id: mockPost._id })
    );
    expect(post._id).toBeDefined();
    expect(post.body).toBe(mockPost.body);
    expect(post.media.length).toBe(mockPost.media.length);
    expect(post.createdBy._id).toBeDefined();
    expect(post.createdBy.name).toBe(mockUser.name);
    expect(post.createdBy.picture).toBe(mockUser.picture);
  });

  it('createPost test', async () => {
    const post = await handler(createPostEvent);
    expect(post._id).toBeDefined();
    expect(post.body).toBe(mockPost.body);
    expect(post.media.length).toBe(mockPost.media.length);
    expect(post.createdBy._id).toBeDefined();
    expect(post.createdBy.name).toBe(mockUser.name);
    expect(post.createdBy.picture).toBe(mockUser.picture);
  });

  it('updatePost test', async () => {
    await handler(createPostEvent);
    const post = await handler(createMockEvent('updatePost', updatedMockPost));
    expect(post._id).toBeDefined();
    expect(post.body).toBe(updatedMockPost.body);
    expect(post.media.length).toBe(updatedMockPost.media.length);
    expect(post.createdBy._id).toBeDefined();
    expect(post.createdBy.name).toBe(mockUser.name);
    expect(post.createdBy.picture).toBe(mockUser.picture);
  });

  it('deletePost test', async () => {
    await handler(createPostEvent);
    const res = await handler(
      createMockEvent('deletePost', { _id: mockPost._id })
    );
    expect(res).toBe(true);
  });
});
