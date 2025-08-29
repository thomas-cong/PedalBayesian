# PedalBayesian
### round 2 instructions

Hello!
Here is a basic frontend + backend that implements the Bayesian optimization algorithm for experimental design.

**Using:**

*Flask* for backend and *React* for frontend
**To run:** 

You will need to activate a conda venv from the provided **.yml** for the backend, and install dependencies for the frontend using `npm install`
The yml can be found in the backend folder.
**Notes on VENV:**

The yml file is consumed by conda to create a conda environment by:
conda env create -f environment.yml
**Running the Code:**

To run the backend, activate the venv first and then go:

    cd backend
    python app.py

To run the frontend, navigate to cloned repository and go:

    cd pedal-bayesian-app
    npm run dev

### Notes about design choices

Since the optimization library (obsidian) was really buggy- I wrote the algorithm that should successfully complete optimizations, but the actual frontend propagated data is just a random matrix I generate.

From experience, I know that it's really important for scientists to be able to easily visualize the **distribution** in their features- so the main way to visualize the data is through a histogram per numerical feature. 

Additionally, after the wells are propagated, we can visualize **correlations** between yield and features easily, so that it informs scientists of next steps and lets them interpret whether the reaction behaves as expected.

**Next steps** would be to actually find a library that properly does Bayesian optimization, and convert output into the format currently used by the random dataframe.
