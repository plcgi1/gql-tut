const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors')

const resolvers = require('./resolvers')
const schema = require('./schemas')

const app = express();

app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});