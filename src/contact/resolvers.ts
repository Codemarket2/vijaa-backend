export const contactResolvers = {
  'Mutation createContact': 'contactLambda',
  'Mutation updateContact': 'contactLambda',
  'Mutation deleteContact': 'contactLambda',
  'Mutation createMailingList': 'contactLambda',
  'Query getAllContacts': 'contactLambda',
  'Query getContact': 'contactLambda',
};
