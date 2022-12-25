from pikepdf import Pdf
from tempfile import NamedTemporaryFile
from base64 import b64decode
from io import BytesIO
import pdfkit
import os

from chalice import Chalice, Response


app = Chalice(app_name='PdfLambda')

app.api.binary_types.append('application/pdf')


def load_base_to_binary(base: str):
    readable_bytes = BytesIO()
    base_bytes = b64decode(base)
    readable_bytes.write(base_bytes)
    return readable_bytes


def merge_pdf(bases):
    pdf = Pdf.new()
    output = BytesIO()

    for base in bases:
        b = load_base_to_binary(base)
        src = Pdf.open(b)
        pdf.pages.extend(src.pages)

    pdf.save(output)
    return output.getvalue()


def replace_var_in_html(html: str, variables={}):
    for variable in variables:
        html = html.replace("{{"+str(variable)+"}}", variables[variable])
    return html


def convert_to_pdf(html: str):
    output = NamedTemporaryFile()
    config = pdfkit.configuration(wkhtmltopdf=os.environ["WKHTMLTOPDF_PATH"])
    pdfkit.from_string(html, output.name, configuration=config)
    return output.read()


def compress_pdf(pdf: bytes):
    # @TODO: Implement later if needed.
    pass

# Available attributes on app.current_request:
#   current_request.query_params - A dict of the query params for the request.
#   current_request.headers - A dict of the request headers.
#   current_request.uri_params - A dict of the captured URI params.
#   current_request.method - The HTTP method (as a string).
#   current_request.json_body - The parsed JSON body (json.loads(raw_body))
#   current_request.raw_body - The raw HTTP body as bytes.
#   current_request.context - A dict of additional context information
#   current_request.stage_vars - Configuration for the API Gateway stage


@app.route('/', methods=['GET'])
def http_index():

    return {
        'app': 'PdfLambda',
        "description": "This is a simple API to merge and convert PDFs.",
        "routes": [
            {
                "method": "POST, PUT",
                "path": "/pdf/merge-multiple",
                "description": "Accept JSON with base64 files inside (pdfs). JSON request body: {'files': ['base64', 'base64']}"
            },
            {
                "method": "POST, PUT",
                "path": "/pdf/convert-from-html",
                "description": "Accept JSON with html and variables. JSON request body: {'template': '<div>{{name}}</div>', 'variables': {'name': 'aha'}"
            }
        ]
    }


@app.route('/pdf/merge-multiple', methods=['POST', 'PUT'], content_types=['application/json'])
# Accept JSON with base64 files inside (pdfs).
# JSON request body: {"files": ["base64", "base64"]}
def http_merge_pdf():
    bases = app.current_request.json_body['files']

    pdf = merge_pdf(bases)

    return Response(
        body=pdf,
        status_code=200,
        headers={
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; file.pdf'
        }
    )


@app.route('/pdf/convert-from-html', methods=['POST', 'PUT'], content_types=['application/json'])
# Accept JSON with html and variables.
# JSON request body: {"template": "<div>{{name}}</div>", "variables": {"name": "aha"}
def http_convert_pdf():
    html = app.current_request.json_body['template']
    variables = app.current_request.json_body['variables']

    html = replace_var_in_html(html, variables)
    pdf = convert_to_pdf(html)

    return Response(
        body=pdf,
        status_code=200,
        headers={
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; file.pdf'
        }
    )
