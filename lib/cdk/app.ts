import { App } from 'aws-cdk-lib'
import path from 'path'
import { PdfLambdaStack } from './stack'
import { DEFAULT_MEMORY, DEFAULT_TIMEOUT } from './utils/pdfLambda'

const app = new App()

if (!process.env.STACK_NAME) {
	throw new Error('Name of CDK stack was not specified!')
}

new PdfLambdaStack(app, process.env.STACK_NAME, {
	lambdaTimeout: process.env.LAMBDA_TIMEOUT ? Number(process.env.LAMBDA_TIMEOUT) : DEFAULT_TIMEOUT,
	lambdaMemory: process.env.LAMBDA_MEMORY ? Number(process.env.LAMBDA_MEMORY) : DEFAULT_MEMORY,
	codeZipPath: path.resolve(__dirname, '../../dist/code.zip'),
	vendorZipPath: path.resolve(__dirname, '../../dist/vendor-layer.zip'),
	wkhtmltopdfZipPath: path.resolve(__dirname, '../../dist/wkhtmltopdf-layer.zip'),
	customHandler: 'app.handler',
	env: {
		account: process.env.CDK_DEFAULT_ACCOUNT,
		region: process.env.REGION ?? process.env.CDK_DEFAULT_REGION,
	},
})

app.synth()
