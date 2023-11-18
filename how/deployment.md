---
title: Deployment to S3 and Cloudfront via AWS CDK
---

Below is my [AWS CDK stack](https://docs.aws.amazon.com/cdk/v2/guide/home.html) to deploy the infrastructure for this site.

This stack creates an S3 bucket and Cloudfront CDN distribution. It then adds an DNS A record to the Route53 hosted zone for my domain.

```js
import * as cdk from "aws-cdk-lib";
import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import {
  CachePolicy,
  Distribution,
  OriginAccessIdentity,
  SecurityPolicyProtocol,
  ViewerProtocolPolicy,
  Function,
  FunctionCode,
  FunctionEventType,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";

export class ExcerptsStack extends cdk.Stack {
  /**
   * This stack creates the following AWS resources:
   * - S3 Bucket
   * - Cloudfront distribution pointed at S3 bucket
   *  - Uses existing certificate for SSL
   *  - Defaults caching to 60 seconds
   *  - Viewer function to rewrite URLs ending with / to /index.html
   * - DNS A record pointed at Cloudfront distribution
   * @param {cdk.App} scope
   * @param {string} id
   * @param {import("./types").ExcerptsStackProps} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const cacheSeconds = props.cacheSeconds || 60;

    const bucket = new Bucket(this, "Bucket", {
      bucketName: props.bucketName,
      accessControl: BucketAccessControl.PRIVATE,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );
    bucket.grantRead(originAccessIdentity);

    const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
      domainName: props.domainName,
    });

    const certificate = Certificate.fromCertificateArn(
      this,
      "Certificate",
      props.certificateARN
    );

    const rewriteFunction = new Function(this, "Function", {
      code: FunctionCode.fromInline(`function handler(event) {
        var request = event.request;
        if (request.uri.endsWith("/")) {
          request.uri += "index.html";
        }
        return request;
      }`),
    });

    const distribution = new Distribution(this, "Distribution", {
      defaultRootObject: "index.html",
      certificate: certificate,
      domainNames: [`${props.subdomainName}.${props.domainName}`],
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: "/404.html",
          ttl: cdk.Duration.seconds(cacheSeconds),
        },
      ],
      defaultBehavior: {
        compress: true,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        origin: new S3Origin(bucket, { originAccessIdentity }),
        cachePolicy: new CachePolicy(this, "S3CachePolicy", {
          defaultTtl: cdk.Duration.seconds(cacheSeconds),
          enableAcceptEncodingGzip: true,
          enableAcceptEncodingBrotli: true,
        }),
        functionAssociations: [
          {
            function: rewriteFunction,
            eventType: FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
    });

    distribution.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    new ARecord(this, "ARecord", {
      recordName: props.subdomainName,
      zone: hostedZone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });
  }
}

```