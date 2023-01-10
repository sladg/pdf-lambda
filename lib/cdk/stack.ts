import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha'
import { App, Stack } from 'aws-cdk-lib'
import { Function } from 'aws-cdk-lib/aws-lambda'
import { CustomStackProps } from './types'
import { setupApiGateway, SetupApiGwProps } from './utils/apiGw'
import { setupPdfLambda, SetupPdfLambdaProps } from './utils/pdfLambda'

export class PdfLambdaStack extends Stack {
	pdfLambda?: Function
	apiGateway?: HttpApi

	constructor(scope: App, id: string, config: CustomStackProps) {
		super(scope, id, config)

		console.log("CDK's config:", config)

		this.pdfLambda = this.setupPdfLambda({
			codePath: config.codeZipPath,
			handler: config.customHandler,
			memory: config.lambdaMemory,
			timeout: config.lambdaTimeout,
			vendorZipPath: config.vendorZipPath,
			wkhtmltopdfZipPath: config.wkhtmltopdfZipPath,
		})

		this.apiGateway = this.setupApiGateway({
			pdfLambda: this.pdfLambda,
		})
	}

	setupApiGateway(props: SetupApiGwProps) {
		return setupApiGateway(this, props)
	}

	setupPdfLambda(props: SetupPdfLambdaProps) {
		return setupPdfLambda(this, props)
	}
}
