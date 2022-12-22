import { MyStack } from "./MyStack";
import { App } from "@serverless-stack/resources";
import { RemovalPolicy } from "aws-cdk-lib";

export default function (app: App) {
  app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "services",
    bundle: {
      format: "esm",
    },
  });
  app.stack(MyStack);
}
