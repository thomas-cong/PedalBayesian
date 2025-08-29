from obsidian.parameters import Param_Categorical, Param_Continuous
from obsidian.optimizer import BayesianOptimizer
from obsidian import ParamSpace, Target, Campaign
import pandas as pd
import numpy as np

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


if __name__ == '__main__':
    df = pd.read_csv('SimplifiedSynthetic.csv')
    print(parse_columns(df, 'yield'))
    suggested_experiments = bayesian_optimization(df, 'yield')
    print(suggested_experiments)
    print("Suggested Experiments:")
    print(suggested_experiments)
