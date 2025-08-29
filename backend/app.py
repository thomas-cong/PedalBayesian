from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
from bayesian_optimization import bayesian_optimization, bayesian_filler

app = Flask(__name__)
CORS(app) 

WORKSPACE_DIR = os.path.join(os.path.dirname(__file__), 'workspace')
os.makedirs(WORKSPACE_DIR, exist_ok=True)

# store a global workspace file- only one file at a time, to design one plate at a time
workspace_file = ''

@app.route('/api/upload', methods=['POST'])
# Uploads file and checks that it is parsable as a CSV
def upload_file():
    global workspace_file
    if 'file' not in request.files:
        return {'error': 'No file part'}, 400
    file = request.files['file']
    if file.filename == '':
        return {'error': 'No selected file'}, 400
    if file and file.filename.endswith('.csv'):
        workspace_file = os.path.join(WORKSPACE_DIR, 'data.csv')
        file.save(workspace_file)
        return {'message': 'File successfully uploaded'}, 200
    else:
        return {'error': 'File must be a CSV file'}, 400

@app.route('/api/fake-fill', methods=['POST'])
# Dummy method to just generate random data for testing visualization
def fill():
    result = bayesian_filler().to_json(orient='records')
    return jsonify(result)

# @app.route('/api/optimize', methods=['POST'])
# def optimize():
#     global workspace_file
#     if not workspace_file or not os.path.exists(workspace_file):
#         return {'error': 'No data file found. Please upload a CSV first.'}, 400

#     data = request.get_json()
#     if not data or 'target_column' not in data:
#         return {'error': 'Target column not provided.'}, 400
    
#     target_column = data['target_column']
#     batch_size = data.get('batch_size', 96) # Default to 96 if not provided

#     try:
#         df = pd.read_csv(workspace_file)
#         results = bayesian_optimization(df, target_column, batch_size=batch_size)
#         # Convert results to a JSON-serializable format
#         results_json = results.to_json(orient='records')
#         return jsonify(results_json)
#     except Exception as e:
#         return {'error': str(e)}, 500
if __name__ == '__main__':
    app.run(debug=True)
