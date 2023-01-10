import { exec } from 'child_process'

export const wrapProcess = async (fn: Promise<any>) => {
	try {
		await fn
	} catch (e) {
		console.error('Process failed with error:', e)
		process.exit(1)
	}
}

interface CommandProps {
	cmd: string
	path?: string
	env?: Record<string, string>
}

export const executeAsyncCmd = async ({ cmd, path, env }: CommandProps) => {
	if (path) {
		process.chdir(path)
	}

	return new Promise((resolve, reject) => {
		const sh = exec(cmd, { env: { ...process.env, ...env } }, (error, stdout, stderr) => {
			if (error) {
				reject(error)
			} else {
				resolve(stdout)
			}
		})

		sh.stdout?.on('data', (data) => {
			console.log(`stdout: ${data}`)
		})
		sh.stderr?.on('data', (data) => {
			console.error(`stderr: ${data}`)
		})
	})
}
