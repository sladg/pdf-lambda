import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import { CfnOutput, Stack } from 'aws-cdk-lib'
import { Function } from 'aws-cdk-lib/aws-lambda'

export interface SetupApiGwProps {
	pdfLambda: Function
}

export const setupApiGateway = (scope: Stack, { pdfLambda }: SetupApiGwProps) => {
	const apiGateway = new HttpApi(scope, `ServerProxy`, {
		apiName: `${scope.stackName}_proxy`,
		defaultIntegration: new HttpLambdaIntegration('LambdaApigwIntegration', pdfLambda),
	})

	new CfnOutput(scope, 'apiGwUrlUrl', { value: apiGateway.apiEndpoint })

	return apiGateway
}
