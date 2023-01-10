from apig_wsgi import make_lambda_handler
from pdf_lambda.app import app

# Lambda endpoint. Wrapper automatically converts API Gateway events to WSGI events.
handler = make_lambda_handler(app)
