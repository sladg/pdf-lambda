#!/usr/bin/env node

import { Command } from 'commander'
import path from 'path'
import packageJson from '../package.json'
import { deployHandler } from './cli/deploy'
import { removeHandler } from './cli/remove'
import { wrapProcess } from './utils'

const program = new Command()

program
	//
	.name(packageJson.name)
	.description(packageJson.description)
	.version(packageJson.version)

program
	.command('deploy')
	.description('Deploy PDF Lambda via CDK')
	.option('--stackName <name>', 'Name of the stack to be deployed.', 'PdfLambdaStack')
	.option('--appPath <path>', 'Absolute path to app.', path.resolve(__dirname, '../dist/cdk/app.js'))
	.option('--region <region>', 'AWS region.', 'eu-central-1')
	.option('--bootstrap', 'Bootstrap CDK stack.', false)
	.option('--lambdaTimeout <sec>', 'Set timeout for lambda function handling server requests.', Number, 15)
	.option('--lambdaMemory <mb>', 'Set memory for lambda function handling server requests.', Number, 512)
	.action(async (options) => {
		console.log('Our config is: ', options)
		const { stackName, appPath, region, bootstrap, lambdaTimeout, lambdaMemory } = options
		wrapProcess(deployHandler({ stackName, appPath, region, bootstrap, lambdaTimeout, lambdaMemory }))
	})

program
	.command('remove')
	.description('Remove PDF Lambda via CDK')
	.option('--stackName <name>', 'Name of the stack to be deployed.', 'PdfLambdaStack')
	.option('--appPath <path>', 'Absolute path to app.', path.resolve(__dirname, '../dist/cdk/app.js'))
	.option('--region <region>', 'AWS region.', 'eu-central-1')
	.action(async (options) => {
		console.log('Our config is: ', options)
		const { stackName, appPath, region } = options
		wrapProcess(removeHandler({ stackName, appPath, region }))
	})

program.parse(process.argv)
