import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import scipy
from scipy import stats
from sklearn.decomposition import PCA
import seaborn as sns; sns.set()

def fix_strs(df):
    """Extract columns with string values and fix typos."""
    df = df.copy()
    empty_cols = [col for col in df.columns if df[col].isnull().sum() == len(df)]
    df = df.drop(columns = empty_cols)
    print("dropped:", empty_cols)
    print("len before:", len(df.columns))

    str_cols = [col for col in df.columns if df[col].dtype == object]
    unusable_cols, usable_cols = [], []
    for col in str_cols:
        counts = df[col].value_counts().to_dict()
        occur_thresh = max(2, np.percentile(list(counts.values()), 25) - 1.5 * scipy.stats.iqr(list(counts.values())))
        # print("thresh:", np.percentile(list(counts.values()), 25), 1.5 * scipy.stats.iqr(list(counts.values())), counts.values())
        typos = [k for k, v in counts.items() if v < occur_thresh]
        correct_vals = [k for k, v in counts.items() if v >= occur_thresh]
        if len(correct_vals) == 0:
            unusable_cols.append(col)
        else:
            corrections = {typo: closest_match(typo, correct_vals) for typo in typos}
            df.replace({col: corrections})
            print("\tfixed typos:", corrections, correct_vals)
            usable_cols.append(col)

    print("dropping cols:", unusable_cols)
    df = df.drop(columns=unusable_cols)
    print("encoding cols:", usable_cols)
    encoded = pd.get_dummies(df)

    # print(encoded.head())
    print("len after:", len(encoded.columns))

    return encoded

def edit_diff(start, goal):
    """A diff function that computes the edit distance from START to GOAL."""
    if goal == '' or start == '':
        return abs(len(start) - len(goal))
    elif start[0] == goal[0]:
        return edit_diff(start[1:], goal[1:])
    else:
        add_diff = 1 + edit_diff(goal[0] + start, goal)
        sub_diff = 1 + edit_diff(start[1:], goal[1:])
        removed_diff = 1 + edit_diff(start[1:], goal)
        return min(add_diff, sub_diff, removed_diff)

def closest_match(val, options):
    """Find the closest matching word."""
    return min(options, key = lambda option: edit_diff(option, val))

def low_rank_approximate(A, k): # A is data, k is rank constraint
    u, s, vh = np.linalg.svd(A)
    # print(u.shape, s.shape, vh.shape)
    A_hat = np.dot(u[:,:k] * s[:k], vh[:k])
    return A_hat

def best_rank_eigen(A):
    pca = PCA().fit(A)
    eigenvals = pca.explained_variance_
    print("eigens", eigenvals)
    k = next(i for i, eigenval in enumerate(eigenvals) if eigenval < 1)
    return k

def best_rank_var(A):
    pca = PCA().fit(A)
    total_variance = [0] + list(np.cumsum(pca.explained_variance_ratio_))
    print("total_variance", total_variance)

    k = next(i for i, var in enumerate(total_variance) if var > 0.9)
    return k

def plot_ranks(A):
    pca = PCA().fit(A)

    plt.plot([0] + list(np.cumsum(pca.explained_variance_ratio_)))
    plt.xlabel('number of components')
    plt.ylabel('cumulative explained variance')
    plt.axvline(best_rank_var(A), color="red")
    plt.axvline(best_rank_eigen(A), color="green")
    plt.show()

def generate_probs(A, A_hat):
    P = np.abs(A-A_hat)
    # P /= np.max(P, axis=0, keepdims=True) #max along each column
    P /= np.max(P, keepdims=True) # total max (due to F norm)
    return P

if __name__ == "__main__":
    # Will be user inputs
    # sb = pd.read_csv('tomslee_airbnb_santa_barbara_1520_2017-07-23.csv')
    sb = pd.read_csv('winequality-white.csv', ';')
    # print(sb)
# p
    df = fix_strs(sb)
    A = df.to_numpy()
    # A = np.random.random((7,3))
    # A[:,0] /= 10
    # A[:,2] *= 100
    print("A:", A.shape, np.linalg.norm(A))
    k = max(best_rank_eigen(A), best_rank_var(A))
    A_hat = low_rank_approximate(A, k)
    print("k:", k, np.linalg.norm(A - A_hat))
    P = generate_probs(A, A_hat)
    P_df = pd.DataFrame(data=P, columns=df.columns)
    print(P_df.sort_values(by=[df.columns[0]]))
    
