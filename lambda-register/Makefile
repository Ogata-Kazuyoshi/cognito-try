sam-local:
	sam build
	sam local start-api --docker-network  cognito-try_cognito-try-net

sam-deploy:
	sam build
	sam deploy --no-confirm-changeset --no-fail-on-empty-changeset

sam-delete:
	sam delete --stack-name temp-ogata-sam

