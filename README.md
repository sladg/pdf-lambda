# PdfLambda

PdfLambda is a simple AWS Lambda function that converts HTML to PDF using [wkhtmltopdf](https://wkhtmltopdf.org/).

Moreover, it's possible to use it for merging multiple PDFs into one.

## Usage

```
npx --package @sladg/pdf-lambda deploy
```

Command will output "Rest API URL" that you can use to make requests.

## Endpoints

`GET /` - simple check to see options and configuration.

`POST /pdf/merge-multiple` - merge multiple PDFs into one

`POST /pdf/convert-from-html` - convert HTML to PDF

Make sure to set `Accept: application/pdf` in request headers.
