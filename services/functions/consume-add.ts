import { Table } from "@serverless-stack/node/table";
import { SQSHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const { number } = JSON.parse(record.body);

    const getParams = {
      // Get the table name from the environment variable
      TableName: Table.Counter.tableName,
      // Get the row where the counter is called "clicks"
      Key: {
        counter: "clicks",
      },
    };
    const results = await dynamoDb.get(getParams).promise();

    // If there is a row, then get the value of the
    // column called "tally"
    let count = results.Item ? results.Item.tally : 0;

    const putParams = {
      TableName: Table.Counter.tableName,
      Key: {
        counter: "clicks",
      },
      // Update the "tally" column
      UpdateExpression: "SET tally = :count",
      ExpressionAttributeValues: {
        // Increase the count
        ":count": parseInt(count) + parseInt(number),
      },
    };
    await dynamoDb.update(putParams).promise();
  }
};
