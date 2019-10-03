const { gql } = require('apollo-server-express')

module.exports = gql`
  extend type Query {
    users(limit: String, offset: String): UserList
    user(id: ID!): User
    me: User
  }
  type UserList {
    count: String!
    data: [User]
  }
  type User {
    id: ID!
    email: String!
  }
  type Token {
    expiresIn: String!
    token: String!
  }
  extend type Mutation {
    signUp(
      email: String!
      password: String!
    ): Token!
    
    signIn(email: String!, password: String!): Token!
  }
`
