import { StackProps } from "aws-cdk-lib";

interface ExcerptsStackProps extends StackProps {
  domainName: string;
  subdomainName: string;
  bucketName?: string;
  certificateARN: string;
  cacheSeconds?: number;
}
