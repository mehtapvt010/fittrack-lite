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
import * as sns from "aws-cdk-lib/aws-sns";
import * as subs from "aws-cdk-lib/aws-sns-subscriptions";
import * as cw from "aws-cdk-lib/aws-cloudwatch";
import * as cw_actions from 'aws-cdk-lib/aws-cloudwatch-actions';
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dotenv from 'dotenv';
dotenv.config();

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

    // 3. Lambda role policy
    const billingAlertTopic = new sns.Topic(this, "BillingAlertTopic", {
      displayName: "Billing Alerts Topic"
    });

    // 4. Email Subscription (change to your real email!)
    billingAlertTopic.addSubscription(new subs.EmailSubscription("mehtapvt010@gmail.com"));

    // 5. CloudWatch Alarm
    const billingAlarm = new cw.Alarm(this, "BillingAlarm", {
      metric: new cw.Metric({
        namespace: "AWS/Billing",
        metricName: "EstimatedCharges",
        dimensionsMap: {
          Currency: "USD"
        },
        statistic: "Maximum",
        period: Duration.hours(6), // evaluate every 6h
      }),
      threshold: 5,
      evaluationPeriods: 1,
      comparisonOperator: cw.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: "Alarm when AWS Estimated Charges exceed $5",
    });

    billingAlarm.addAlarmAction(new cw_actions.SnsAction(billingAlertTopic));

    // 6. Grant S3 invoke → Lambda
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
    
    // 7 Lambda for nightly merge
    const mergeLambda = new NodejsFunction(this, "NightlyMergeLambda", {
      entry: path.join(__dirname, "../../lambda/merge/index.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      timeout: Duration.seconds(10),
      memorySize: 256,
      environment: {
        DATABASE_URL: process.env.DATABASE_URL!,
      },
      bundling: {
        // Keep Prisma client code intact
        externalModules: ["@prisma/client"],
        // Make sure @prisma/client is installed into the bundle
        nodeModules: ["@prisma/client"],
    
        // After esbuild finishes, copy the Prisma query engine binaries
        commandHooks: {
          beforeBundling(inputDir: string, outputDir: string): string[] {
            return [];
          },
          beforeInstall(inputDir: string, outputDir: string): string[] {
            return [];
          },
          afterBundling(inputDir: string, outputDir: string): string[] {
            // Copy the entire .prisma/client folder into the Lambda bundle
            const src = path.join(
              __dirname,
              "../../backend/node_modules/.prisma/client"
            );
            const dest = path.join(outputDir, "node_modules", ".prisma", "client");
            // The shell command(s) you need:
            return [
              // ensure destination exists
              `mkdir -p ${dest}`,
              // copy all files
              `cp -R ${src}/* ${dest}`,
            ];
          },
        },
      },
    });

    // 8. Schedule it nightly at midnight UTC
    new Rule(this, "NightlyMergeSchedule", {
      schedule: Schedule.cron({ minute: "0", hour: "0" }),
    }).addTarget(new targets.LambdaFunction(mergeLambda));

    mergeLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        resources: ['*'],
      }),
    );
    
  }

}
