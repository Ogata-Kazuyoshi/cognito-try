
frontend-test:
# 	cd frontend && npm run lint
	cd frontend && npm run test

backend-test:
# 	cd backend && ./gradlew ktlintFormat && ./gradlew ktlintCheck
	cd backend && ./gradlew test

all:
	make backend-test
	make frontend-test

build-image-push:
	aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin $(ECR_ENDPOINT)
	docker build --platform linux/amd64 -t $(ECR_REPOSITORY_NAME) .
	docker tag $(ECR_REPOSITORY_NAME):latest $(ECR_ENDPOINT)/$(ECR_REPOSITORY_NAME):latest
	docker push $(ECR_ENDPOINT)/$(ECR_REPOSITORY_NAME):latest
	make register-task-definition

register-task-definition:
	REVISION=$$(aws ecs register-task-definition \
		--family $(TASK_DEFINITION_FAMILY) \
		--network-mode awsvpc \
		--requires-compatibilities FARGATE \
		--cpu "512" \
		--memory "1024" \
		--execution-role-arn $(EXISTING_ECS_TASK_ROLE_ARN) \
		--runtime-platform '{ \
			"operatingSystemFamily": "LINUX", \
			"cpuArchitecture": "X86_64" \
		}' \
		--container-definitions '[{ \
			"name": "$(CONTAINER_NAME)", \
			"image": "$(ECR_ENDPOINT)/$(ECR_REPOSITORY_NAME):latest", \
			"essential": true, \
			"portMappings": [{ \
				"containerPort": 8080, \
				"hostPort": 8080 \
			}], \
			"logConfiguration": { \
				"logDriver": "awslogs", \
				"options": { \
					"awslogs-group": "/ecs/$(CONTAINER_NAME)", \
					"awslogs-region": "ap-northeast-1", \
					"awslogs-stream-prefix": "ecs" \
				} \
			} \
		}]' \
		--query 'taskDefinition.taskDefinitionArn' --output text) && \
	aws ecs update-service --cluster $(ECS_CLUSTER_NAME) --service $(ECS_SERVICE_NAME) --task-definition $$REVISION --force-new-deployment

iac-base-deploy:
	aws cloudformation create-stack --stack-name ogata-cloudformation-base \
	--template-body file://cloudformation/cloudformation-base.yml \
	--capabilities CAPABILITY_NAMED_IAM \

iac-base-update:
	aws cloudformation update-stack --stack-name ogata-cloudformation-base \
	--template-body file://cloudformation/cloudformation-base.yml \
	--capabilities CAPABILITY_NAMED_IAM \


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

iac-cognito-deploy:
	aws cloudformation create-stack --stack-name ogata-cloudformation-cognito \
	--template-body file://cloudformation/cloudformation-cognito.yml \
	--capabilities CAPABILITY_NAMED_IAM \

iac-cognito-update:
	aws cloudformation update-stack --stack-name ogata-cloudformation-cognito \
	--template-body file://cloudformation/cloudformation-cognito.yml \
	--capabilities CAPABILITY_NAMED_IAM \
