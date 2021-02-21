const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

require('dotenv').config();
const db = require('./db');
const models = require('./model');

const port = process.env.port || 4000;
const DB_HOST = process.env.DB_HOST;

let notes = [
    {id: '1', content: 'Moja pierwsza piękna notatka', author: 'Wasia'},
    {id: '2', content: 'Moja druga piękna notatka', author: 'Kolia'},
    {id: '3', content: 'Moja trzecia piękna notatka', author: 'Walera'},
];

const app = express();

db.connect(DB_HOST);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
        return { models }
    }
});

server.applyMiddleware({ app, path: '/api' });

app.listen({port}, () =>
    `Serwer GraphQL działa pod adresem http://localhost:${port}${server.graphqlPath}}`
)