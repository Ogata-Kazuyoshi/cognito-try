
iac-base-deploy:
	aws cloudformation create-stack --stack-name ogata-cloudformation-base \
	--template-body file://cloudformation/cloudformation-base.yml \
	--capabilities CAPABILITY_NAMED_IAM \

iac-base-update:
	aws cloudformation update-stack --stack-name ogata-cloudformation-base \
	--template-body file://cloudformation/cloudformation-base.yml \
	--capabilities CAPABILITY_NAMED_IAM \

iac-role-deploy:
	aws cloudformation create-stack --stack-name ogata-cloudformation-iam-role \
	--template-body file://cloudformation/cloudformation-iam-role.yml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters ParameterKey=GithubAccount,ParameterValue=$(GITHUB_ACCOUNT) \
	             ParameterKey=GithubRepository,ParameterValue=$(GITHUB_REPOSITORY) \

iac-role-update:
	aws cloudformation update-stack --stack-name ogata-cloudformation-iam-role \
	--template-body file://cloudformation/cloudformation-iam-role.yml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters ParameterKey=GithubAccount,ParameterValue=$(GITHUB_ACCOUNT) \
	             ParameterKey=GithubRepository,ParameterValue=$(GITHUB_REPOSITORY) \

iac-deploy:
	aws cloudformation create-stack --stack-name ogata-cloudformation-app \
	--template-body file://cloudformation/cloudformation-template.yml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters ParameterKey=SubnetId1,ParameterValue=$(SUBNET_ID1) \
	             ParameterKey=SubnetId2,ParameterValue=$(SUBNET_ID2) \
	             ParameterKey=SubnetPrivateId1,ParameterValue=$(SUBNET_PRIVATE_ID1) \
	             ParameterKey=SubnetPrivateId2,ParameterValue=$(SUBNET_PRIVATE_ID2) \
	             ParameterKey=VpcId,ParameterValue=$(VPC_ID) \
	             ParameterKey=ExistingECSTaskRoleArn,ParameterValue=$(EXISTING_ECS_TASK_ROLE_ARN) \
	             ParameterKey=ECRImage,ParameterValue=$(ECR_IMAGE) \
	             ParameterKey=ECRRepositoryName,ParameterValue=$(ECR_REPOSITORY_NAME) \
	             ParameterKey=HostedZoneId,ParameterValue=$(HOSTED_ZONE_ID) \
	             ParameterKey=DomainName,ParameterValue=$(DOMAIN_NAME) \
	             ParameterKey=ACMCertificateArn,ParameterValue=$(ACM_CERTIFICATE_ARN)

iac-update:
	aws cloudformation update-stack --stack-name ogata-cloudformation-app \
	--template-body file://cloudformation/cloudformation-template.yml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters ParameterKey=SubnetId1,ParameterValue=$(SUBNET_ID1) \
	             ParameterKey=SubnetId2,ParameterValue=$(SUBNET_ID2) \
	             ParameterKey=SubnetPrivateId1,ParameterValue=$(SUBNET_PRIVATE_ID1) \
	             ParameterKey=SubnetPrivateId2,ParameterValue=$(SUBNET_PRIVATE_ID2) \
	             ParameterKey=VpcId,ParameterValue=$(VPC_ID) \
	             ParameterKey=ExistingECSTaskRoleArn,ParameterValue=$(EXISTING_ECS_TASK_ROLE_ARN) \
	             ParameterKey=ECRImage,ParameterValue=$(ECR_IMAGE) \
	             ParameterKey=ECRRepositoryName,ParameterValue=$(ECR_REPOSITORY_NAME) \
	             ParameterKey=HostedZoneId,ParameterValue=$(HOSTED_ZONE_ID) \
	             ParameterKey=DomainName,ParameterValue=$(DOMAIN_NAME) \
	             ParameterKey=ACMCertificateArn,ParameterValue=$(ACM_CERTIFICATE_ARN)

iac-cognito-deploy:
	aws cloudformation create-stack --stack-name ogata-cloudformation-cognito \
	--template-body file://cloudformation/cloudformation-cognito.yml \
	--capabilities CAPABILITY_NAMED_IAM \

iac-cognito-update:
	aws cloudformation update-stack --stack-name ogata-cloudformation-cognito \
	--template-body file://cloudformation/cloudformation-cognito.yml \
	--capabilities CAPABILITY_NAMED_IAM \

iac-wafacl-deploy:
	aws cloudformation create-stack --stack-name ogata-cloudformation-wafacl \
	--template-body file://cloudformation/cloudformation-wafacl.yml \
	--capabilities CAPABILITY_NAMED_IAM \
	--region us-east-1

iac-wafacl-update:
	aws cloudformation update-stack --stack-name ogata-cloudformation-wafacl \
	--template-body file://cloudformation/cloudformation-wafacl.yml \
	--capabilities CAPABILITY_NAMED_IAM \
	--region us-east-1

iac-cloudfront-deploy:
	aws cloudformation create-stack --stack-name ogata-cloudformation-cloudfront \
	--template-body file://cloudformation/cloudformation-cloudfront.yml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters ParameterKey=WAFWebACLArn,ParameterValue=$(WAF_ACL_ARN) \
	--region ap-northeast-1

iac-cloudfront-update:
	aws cloudformation update-stack --stack-name ogata-cloudformation-cloudfront \
	--template-body file://cloudformation/cloudformation-cloudfront.yml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters ParameterKey=WAFWebACLArn,ParameterValue=$(WAF_ACL_ARN) \
	--region ap-northeast-1
