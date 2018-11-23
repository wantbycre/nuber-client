import ApolloClient, { Operation } from "apollo-boost";

const client = new ApolloClient({
  request: async (operation: Operation) => {
    operation.setContext({
      clientState: {
        defaults: {
          auth: {
            __typename: "Auth",
            isLoggedIn: Boolean(localStorage.getItem("jwt"))
          }
        },
        resolvers: {
          Mutation: {
            logUserIn: (_, { token }, { cache }) => {
              localStorage.setItem("jwt", token);
              cache.writeData({
                data: {
                  auth: {
                    __typename: "Auth",
                    isLoggedIn: true
                  }
                }
              });
              return null;
            },
            logUserOut: (_, __, { cache }) => {
              localStorage.removeItem("jwt");
              cache.writeData({
                data: {
                  __typename: "Auth",
                  isLoggedIn: false
                }
              });
              return null;
            }
          }
        }
      },
      headers: {
        "X-JWT": localStorage.getItem("jwt") || ""
      }
    });
  },
  uri: "http://localhost:4000"
});

export default client;
