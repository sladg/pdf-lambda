import { CfnOutput, Duration, Stack } from 'aws-cdk-lib'
import { Code, Function, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda'

export interface SetupPdfLambdaProps {
	handler: string
	codePath: string
	vendorZipPath: string
	wkhtmltopdfZipPath: string
	memory?: number
	timeout?: number
}

export const DEFAULT_MEMORY = 256
export const DEFAULT_TIMEOUT = 10

export const setupPdfLambda = (
	scope: Stack,
	{ codePath, handler, vendorZipPath, wkhtmltopdfZipPath, memory = DEFAULT_MEMORY, timeout = DEFAULT_TIMEOUT }: SetupPdfLambdaProps,
) => {
	const wkhtmlLayer = new LayerVersion(scope, 'WkhtmlBinLayer', {
		code: Code.fromAsset(wkhtmltopdfZipPath),
	})

	const vendorLayer = new LayerVersion(scope, 'VendorLayer', {
		code: Code.fromAsset(vendorZipPath),
	})

	const pdfLambda = new Function(scope, 'PdfLambda', {
		code: Code.fromAsset(codePath),
		// @NOTE: Make sure to keep python3.8 as binaries seems to be messed for other versions.
		runtime: Runtime.PYTHON_3_8,
		handler: handler,
		memorySize: memory,
		timeout: Duration.seconds(timeout),
		layers: [vendorLayer, wkhtmlLayer],
		environment: {
			WKHTMLTOPDF_PATH: '/opt/bin/wkhtmltopdf',
		},
	})

	new CfnOutput(scope, 'pdfLambdaArn', { value: pdfLambda.functionArn })

	return pdfLambda
}
