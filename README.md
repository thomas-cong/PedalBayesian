# PedalBayesian

round 2

Hello- here is a basic frontend + backend that implements the Bayesian optimization algorithm for experimental design.

Using- Flask for backend and React for frontend
To run- you will need to activate a conda venv from the provided .yml for the backend, and install dependencies for the frontend using npm install

The yml file is consumed by conda to create a conda environment by:
conda env create -f environment.yml

To run the backend, activate the venv and navigate to the backend directory and run:
python app.py

To run the frontend, navigate to the frontend directory and run:
npm run dev

Navigate to localhost:5173 and you should find the application.
