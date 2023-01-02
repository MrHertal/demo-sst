import { Queue } from "@serverless-stack/node/queue";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { SQS } from "aws-sdk";

const sqs = new SQS();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const number = event.pathParameters?.number;

  await sqs
    .sendMessage({
      // @ts-ignore
      QueueUrl: Queue.Queue.queueUrl,
      MessageBody: JSON.stringify({ number }),
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ status: "message queued" }),
  };
};
