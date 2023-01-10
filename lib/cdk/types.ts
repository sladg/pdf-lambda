import { StackProps } from 'aws-cdk-lib'

export interface CustomStackProps extends StackProps {
	codeZipPath: string
	vendorZipPath: string
	customHandler: string
	wkhtmltopdfZipPath: string
	lambdaTimeout: number
	lambdaMemory: number
}
