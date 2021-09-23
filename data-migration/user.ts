import * as fs from 'fs';
import slugify from 'slugify';
import { User } from '../src/user/utils/userModel';
import ListItem from '../src/list/utils/listItemModel';
import { DB } from '../src/utils/DB';

const userTypeId = '6119695c580ba8000904f06b';

//   const res = await ListItem.deleteMany({ types: [userTypeId] });
//   fs.writeFileSync('data-migration/users.text', JSON.stringify(users));

const importUserFromFile = async () => {
  let users: any = fs.readFileSync('data-migration/users.text');
  users = JSON.parse(users);
  const res = await ListItem.create(users);
};

const addUserToType = async () => {
  let users: any = await User.find();
  users = users.map((user) => {
    return {
      title: user.name,
      description: user.email,
      _id: user._id,
      types: [userTypeId],
      slug: slugify(user.name, { lower: true }),
      createdBy: '6119695c580ba8000904f06b',
    };
  });
  console.log('users', users);
  const res = await ListItem.create(users);
};

const runScript = async () => {
  try {
    let dbString =
      'mongodb+srv://<username>:<password>@codemarket-staging.k16z7.mongodb.net/PROJECT_NAME?retryWrites=true&w=majority';
    dbString = dbString.replace('PROJECT_NAME', process.argv[2]);
    dbString = dbString.replace('<username>', process.argv[3]);
    dbString = dbString.replace('<password>', process.argv[4]);
    await DB(dbString);
    await addUserToType();
    process.exit();
  } catch (error) {
    console.log('Error', error);
  }
};

// runScript();
