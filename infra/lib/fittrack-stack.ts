import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { Bucket, HttpMethods } from "aws-cdk-lib/aws-s3";
import { Function as LambdaFunction, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { Stack, StackProps } from "aws-cdk-lib";
import { CfnOutput } from "aws-cdk-lib";
import { LambdaDestination } from "aws-cdk-lib/aws-s3-notifications";
import { EventType } from "aws-cdk-lib/aws-s3";
import * as path from "path";

export class FittrackStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 1. S3 bucket for raw meal CSV uploads
    const mealUploads = new Bucket(this, "MealUploadsBucket", {
      bucketName: `fittrack-meal-uploads-${this.node.tryGetContext("stage")}`,
      versioned: false,
      removalPolicy: RemovalPolicy.DESTROY,
      cors: [{
        allowedMethods: [HttpMethods.POST, HttpMethods.PUT, HttpMethods.GET],
        allowedOrigins: ["http://localhost:5173"], // or restrict to http://localhost:5173
        allowedHeaders: ["*"],
        exposedHeaders: ["ETag"],
        maxAge: 3000
      }]
    });

    // 2. Lambda parser (source added in section 4)
    const mealParser = new LambdaFunction(this, "MealParserFn", {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset(path.resolve(__dirname, "../../lambda/meal-parser/dist")),
      handler: "handler.handler",
      timeout: Duration.seconds(30),
      environment: {
        PG_URL: process.env.PG_URL!,
      },
    });

    // 3. Grant S3 invoke → Lambda
    mealUploads.addEventNotification(
      EventType.OBJECT_CREATED,
      new LambdaDestination(mealParser),
      { suffix: ".csv" }
    );

    mealUploads.grantRead(mealParser);
    mealParser.addToRolePolicy(new PolicyStatement({
      actions: ["rds-data:*"],
      resources: ["*"]
    }));

    new CfnOutput(this, "UploadsBucket", {
      value: mealUploads.bucketName,
      exportName: "UploadsBucket"
    });
  }
}
