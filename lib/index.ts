import path from 'path'

export const codeZipPath = path.resolve(__dirname, './code.zip')
export const vendorZipPath = path.resolve(__dirname, './vendor-layer.zip')
export const wkhtmltopdfPath = path.resolve(__dirname, './wkhtmltopdf-layer.zip')

export const handler = 'pdf_lambda/handler.handler'
