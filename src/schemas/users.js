const { gql } = require('apollo-server-express')

module.exports = gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
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
