# PdfLambda

PdfLambda is a simple AWS Lambda function that converts HTML to PDF using [wkhtmltopdf](https://wkhtmltopdf.org/).

Moreover, it's possible to use it for merging multiple PDFs into one.

## Usage

Very simple and straight forward `npx --package @sladg/pdf-lambda cli deploy`. Pass `--help` in the end for all options and configuration.

In case you want to clean it up, use `npx --package @sladg/pdf-lambda cli remove`.

Command will output "Rest API URL" that you can use to make requests.

## Endpoints

`GET /` - simple check to see options and configuration.

`POST /pdf/merge-multiple` - merge multiple PDFs into one

`POST /pdf/convert-from-html` - convert HTML to PDF

Make sure to set `Accept: application/pdf` in request headers.

## Notes

Does not support `var(--color)` CSS properties due to `wkhtmltopdf` limitations.

Generally the CSS and HTML should be as simple as possible, it's not as powerful as Chrome or Firefox, but it's way faster and smaller, resulting in small & efficient solution.