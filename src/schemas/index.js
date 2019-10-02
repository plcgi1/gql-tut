const { gql } = require('apollo-server-express');
const userSchema = require('./users');
const messageSchema = require('./messages');

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
`;
module.exports = [linkSchema, userSchema, messageSchema];