const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const {  ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { expressMiddleware } = require('@as-integrations/express5')
const cors = require('cors')
const express = require('express')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const http = require('http')
const jwt = require("jsonwebtoken")
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')
const DataLoader = require('dataloader')

const { resolvers } = require("./resolvers");
const { connectToDatabase } = require("./db");
const typeDefs = require("./schema");
const User = require("./models/user");
const Book = require("./models/book");

const getUserFromAuthHeader = async (auth, jwtSecret) => {
  if (!auth || !auth.startsWith("Bearer ")) {
    return null;
  }

  const decodedToken = jwt.verify(auth.substring(7), jwtSecret);
  return User.findById(decodedToken.id);
};

const startServer = async (port, mongoUri, jwtSecret) => {
  await connectToDatabase(mongoUri);

  const app = express();
  const httpServer = http.createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  });
  
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            }
          }
        }
      }
    ]
  });

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization
        const currentUser = await getUserFromAuthHeader(auth, jwtSecret)

        const loaders = {
          bookCountByAuthor: new DataLoader(async (authorIds) => {
            const pipeline = [
              { $match: { author: { $in: authorIds } } },
              { $group: { _id: "$author", count: { $sum: 1 } } },
            ]
            const results = await Book.aggregate(pipeline)
            const map = new Map(results.map(r => [String(r._id), r.count]))
            return authorIds.map(id => map.get(String(id)) ?? 0)
          })
        }
        return { currentUser, loaders }
      },
    }));

    httpServer.listen(port, () =>
      console.log(`Server is now running on http://localhost:${port}`)
  );
};

module.exports = { startServer };
