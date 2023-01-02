import {
  Api,
  Queue,
  StackContext,
  StaticSite,
  Table,
} from "@serverless-stack/resources";
import { Duration } from "aws-cdk-lib";
import * as sqs from "aws-cdk-lib/aws-sqs";

export function MyStack({ stack }: StackContext) {
  // Create the table
  const table = new Table(stack, "Counter", {
    fields: {
      counter: "string",
    },
    primaryIndex: { partitionKey: "counter" },
  });

  const deadLetterQueue = new sqs.Queue(stack, "DeadLetterQueue", {
    retentionPeriod: Duration.days(14),
  });

  const queue = new Queue(stack, "Queue", {
    consumer: {
      function: {
        handler: "functions/consume-add.main",
        bind: [table],
      },
    },
    cdk: {
      queue: {
        deadLetterQueue: {
          queue: deadLetterQueue,
          maxReceiveCount: 1,
        },
      },
    },
  });

  // Create the HTTP API
  const api = new Api(stack, "Api", {
    routes: {
      "GET /get-count": {
        function: {
          handler: "functions/get-count.main",
          bind: [table],
        },
      },
      "POST /plus-one": {
        function: {
          handler: "functions/plus-one.main",
          bind: [table],
        },
      },
      "POST /add/{number}": {
        function: {
          handler: "functions/queue-add.main",
          bind: [table, queue],
        },
      },
    },
  });

  // Deploy our React app
  const site = new StaticSite(stack, "ReactSite", {
    path: "frontend",
    buildCommand: "npm run build",
    buildOutput: "build",
    environment: {
      REACT_APP_API_URL: api.url,
    },
    cdk: {
      bucket: {
        publicReadAccess: undefined,
      },
    },
  });

  // Show the URLs in the output
  stack.addOutputs({
    SiteUrl: site.url,
    ApiEndpoint: api.url,
  });
}
