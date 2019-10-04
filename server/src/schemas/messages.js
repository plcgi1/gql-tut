const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    messages(limit: Int, offset: Int, sort: String): MessageList
    message(id: ID!): Message!
  }
  type MessageList {
    count: String!
    data: [Message]
  }
  type Message {
    id: ID!
    text: String!
    owner: User!
    recipient: User!
  }
  extend type Mutation {
    createMessage(text: String!, recipientId: ID!): Message!
    deleteMessage(id: ID!): Boolean!
  }
`
