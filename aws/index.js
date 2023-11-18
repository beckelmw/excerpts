import * as cdk from "aws-cdk-lib";
import { ExcerptsStack } from "./excerpts-stack.js";

const app = new cdk.App();

if (!process.env.DOMAIN_NAME) {
  throw new Error(`DOMAIN_NAME needs to be set in .env file`);
}

if (!process.env.SUBDOMAIN_NAME) {
  throw new Error(`SUBDOMAIN_NAME needs to be set in .env file`);
}

if (!process.env.CERTIFICATE_ARN) {
  throw new Error(`CERTIFICATE_ARN needs to be set in .env file`);
}

new ExcerptsStack(app, "ExcerptsAwsStack", {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION,
  },
  bucketName: process.env.BUCKET_NAME,
  domainName: process.env.DOMAIN_NAME,
  subdomainName: process.env.SUBDOMAIN_NAME,
  certificateARN: process.env.CERTIFICATE_ARN,
});
