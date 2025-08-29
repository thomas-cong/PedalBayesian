from flask import Flask, request, jsonify
import os
import pandas as pd
from bayesian_optimization import bayesian_optimization

app = Flask(__name__) 

WORKSPACE_DIR = os.path.join(os.path.dirname(__file__), 'workspace')
os.makedirs(WORKSPACE_DIR, exist_ok=True)

workspace_file = ''

@app.route('/api/hello')
def hello_world():
    return {'message': 'Hello from the Python backend!'}

@app.route('/api/upload', methods=['POST'])
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

@app.route('/api/optimize')
def optimize():
    global workspace_file
    if not workspace_file or not os.path.exists(workspace_file):
        return {'error': 'No data file found. Please upload a CSV first.'}, 400
    
    try:
        df = pd.read_csv(workspace_file)
        # Assuming 'yield' is the target column. You might want to make this configurable.
        results = bayesian_optimization(df, 'yield')
        # Convert results to a JSON-serializable format
        results_json = results.to_json(orient='records')
        return jsonify(results_json)
    except Exception as e:
        return {'error': str(e)}, 500
if __name__ == '__main__':
    app.run(debug=True)
