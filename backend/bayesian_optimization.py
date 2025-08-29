from obsidian.parameters import Param_Categorical, Param_Continuous
from obsidian.optimizer import BayesianOptimizer
from obsidian import ParamSpace, Target, Campaign
import pandas as pd
import numpy as np
import random

def parse_columns(df, target_column):
    '''
    takes a pandas dataframe and returns a list of obsidian parameter objects for features.
    '''
    params = []
    feature_columns = [col for col in df.columns if col != target_column]
    for col in feature_columns:
        if df[col].dtype == np.dtype('O'):
            params.append(Param_Categorical(name=col, categories=df[col].unique().tolist()))
        else:
            params.append(Param_Continuous(name=col, min=float(df[col].min()), max=float(df[col].max())))
    return params

def bayesian_optimization(df, target_column, batch_size=96, fitted_model = None):
    params = parse_columns(df, target_column)
    X_space = ParamSpace(params)
    target = Target(target_column, aim='max')
    bayesian_optimizer = BayesianOptimizer(X_space, surrogate='GP')
    if fitted_model:
        bayesian_optimizer.load(fitted_model)
    else:
        bayesian_optimizer.fit(df, target=target)
    assert bayesian_optimizer.is_fit
    print("Starting Suggest process")
    results = bayesian_optimizer.suggest(m_batch=batch_size, target=target)
    print("Suggest process completed")
    return results
def bayesian_filler():
    '''
    Filler function that generates random 96 well dataframe
    '''
    dataframe = pd.DataFrame(columns=['catalyst','solvent','temperature','pressure_atm','concentration_M','time_h','pH','yield'])
    dataframe['catalyst'] = [random.choice(['Catalyst_1','Catalyst_2','Catalyst_3','Catalyst_4','Catalyst_5']) for _ in range(96)]
    dataframe['solvent'] = [random.choice(['Acetone','Ethanol','Hexane','Toluene','Xylene']) for _ in range(96)]
    dataframe['temperature'] = [random.uniform(20,150) for _ in range(96)]
    dataframe['pressure_atm'] = [random.uniform(1,20) for _ in range(96)]
    dataframe['concentration_M'] = [random.uniform(0.1,1) for _ in range(96)]
    dataframe['time_h'] = [random.uniform(1,24) for _ in range(96)]
    dataframe['pH'] = [random.uniform(1,14) for _ in range(96)]
    dataframe['yield'] = [random.uniform(0,100) for _ in range(96)]
    
    return dataframe


if __name__ == '__main__':
    print(bayesian_filler())
