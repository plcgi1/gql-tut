const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    messages: [Message!]!
    message(id: ID!): Message!
  }
  type Message {
    id: ID!
    text: String!
    owner: User!
    recipient: User!
  }
  extend type Mutation {
    createMessage(text: String!, ownerId: ID!, recipientId: ID!): Message!
  }
`
