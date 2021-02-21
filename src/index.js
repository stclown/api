const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

require('dotenv').config();
const db = require('./db');

const port = process.env.port || 4000;
const DB_HOST = process.env.DB_HOST;

let notes = [
    {id: '1', content: 'Moja pierwsza piękna notatka', author: 'Wasia'},
    {id: '2', content: 'Moja druga piękna notatka', author: 'Kolia'},
    {id: '3', content: 'Moja trzecia piękna notatka', author: 'Walera'},
];


const typeDefs = gql`
    type Note {
        id: ID!,
        content: String!,
        author: String!
    }
    type Query {
        hello: String!,
        notes: [Note!]!,
        note(id: ID!): Note!
    }
    type Mutation {
        newNote(content: String!): Note!
    }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello world!',
        notes: () => notes,
        note: (parent, args) => {
            return notes.find(note => note.id === args.id);
        }
    },
    Mutation: {
        newNote: (parent, args) => {
            let noteValue = {
                id: String(notes.length + 1),
                content: args.content,
                author: 'Adam Scott'
            }

            notes.push(noteValue);
            return noteValue;
        }
    }
};


const app = express();

db.connect(DB_HOST);

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path: '/api' });

app.listen({port}, () =>
    `Serwer GraphQL działa pod adresem http://localhost:${port}${server.graphqlPath}}`
)