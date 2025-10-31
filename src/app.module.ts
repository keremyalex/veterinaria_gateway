import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ConfigModule } from '@nestjs/config';

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }: { request: any; context: any }) {
    const auth = context?.req?.headers?.authorization;
    if (auth) {
      request.http?.headers.set('authorization', auth);
    }

    const requestId = context?.req?.headers['x-request-id'];
    if (requestId) {
      request.http?.headers.set('x-request-id', requestId);
    }
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        playground: false,
        introspection: true
      },
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'auth', url: process.env.AUTH_SERVICE_URL },
          ],
        }),
        buildService: ({ url }) => {
          return new AuthenticatedDataSource({ url });
        },
      },
    }),
  ],
})
export class AppModule { }
