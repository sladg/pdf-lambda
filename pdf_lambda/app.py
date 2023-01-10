from pikepdf import Pdf
from tempfile import NamedTemporaryFile
from base64 import b64decode
from io import BytesIO
import pdfkit
from os import environ
from flask import Flask, Response, request

app = Flask(__name__)


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
    config = pdfkit.configuration(
        wkhtmltopdf=environ.get("WKHTMLTOPDF_PATH", None)
    )
    pdfkit.from_string(html, output.name, configuration=config)
    return output.read()


def compress_pdf(pdf: bytes):
    # @TODO: Implement later if needed.
    pass


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


@app.route('/pdf/merge-multiple', methods=['POST', 'PUT'])
# Accept JSON with base64 files inside (pdfs).
# JSON request body: {"files": ["base64", "base64"]}
def http_merge_pdf():
    json_data = request.get_json()
    bases = json_data['files']

    pdf = merge_pdf(bases)

    return Response(pdf, mimetype='application/pdf')


@app.route('/pdf/convert-from-html', methods=['POST', 'PUT'])
# Accept JSON with html and variables.
# JSON request body: {"template": "<div>{{name}}</div>", "variables": {"name": "aha"}
def http_convert_pdf():
    json_data = request.get_json()
    html = json_data['template']
    variables = json_data['variables']

    html = replace_var_in_html(html, variables)
    pdf = convert_to_pdf(html)

    return Response(pdf, mimetype='application/pdf')
