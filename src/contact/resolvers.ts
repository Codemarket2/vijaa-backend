export const contactResolvers = {
  'Mutation createContact': 'contactLambda',
  'Mutation updateContact': 'contactLambda',
  'Mutation deleteContact': 'contactLambda',
  'Query getAllContacts': 'contactLambda',
  'Query getContact': 'contactLambda',
};
