# PdfLambda

PdfLambda is a simple AWS Lambda function that converts HTML to PDF using [wkhtmltopdf](https://wkhtmltopdf.org/).

Moreover, it's possible to use it for merging multiple PDFs into one.

## Usage

`/pdf/merge` - merge multiple PDFs into one

`/pdf/convert` - convert HTML to PDF

Make sure to set `Accept: application/pdf` in request headers.
