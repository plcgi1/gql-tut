const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const uuidv4 = require('uuid/v4')
const cors = require('cors')

const app = express();

app.use(cors());

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]
    
    messages: [Message!]!
    message(id: ID!): Message!
  }
  
  type Mutation {
    createMessage(text: String!, userId: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }

  type User {
    lastname: String!
    firstname: String!
    username: String!
    id: String!
    messages: [Message!]
  }
`;

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: 1
  },
  2: {
    id: '2',
    text: '2222 By World',
    userId: 2
  },
};

let users = {
  1: {
    id: 1,
    firstname: 'Robin',
    lastname: 'Wieruch',
    messageIds: [1],
  },
  2: {
    id: 2,
    firstname: 'Dave',
    lastname: 'Davids',
    messageIds: [2],
  },
};
const me = users[1];

const resolvers = {
  Query: {
    me: () => {
      return me
    },
    user: (parent, { id }) => {
      return users[id]
    },
    users: () => {
      return Object.values(users)
    },
    messages: () => {
      return Object.values(messages)
    },
    message: (parent, { id }) => {
      return messages[id]
    }
  },
  Mutation: {
    createMessage: (parent, { text, userId }, { me }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId,
      };
      messages[id] = message;
      users[userId].messageIds.push(id);
      return message;
    },
    deleteMessage: (parent, { id }) => {
      if (!messages[id]) return false
      const deletedMessage = messages[id]
      delete messages[id]

      users[deletedMessage.userId].messageIds = users[deletedMessage.userId].messageIds.filter(msgId => msgId !== id )
      return true
    }
  },
  User: {
    username: user => `${user.firstname} ${user.lastname}`,
    messages: user => {
      return Object.values(messages).filter(
        message => message.userId === user.id,
      );
    },
  },
  Message: {
    user: message => {
      return users[message.userId];
    },
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});