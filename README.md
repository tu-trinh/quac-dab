# quac-dab
QUAntum Cleaning DAtaBase.

A probabilistic database cleaning software that helps data scientists improve the accuracy and validity of their data. Given a dataset, QuacDab generates the likelihood of erroneous data, pinpoints their occurrences, and suggests more accurate values.

Inspired by a paper published by researchers at Georgia Tech, we attempted to create a user-friendly and intelligent system that helps with preliminary data cleaning. The core logic behind our service is the concepts of low-rank approximation and probability distributions of data points. We assume that valid datasets are a subset of all possible data, and that there is a fuzzy line representing a probability distribution that separates the two. If the user inputs a feature matrix X, our goal is to find the optimal X-hat that is most likely to contain correct data with the fewest number of missing values and map X to it.

Using principal component analysis, we determine the best rank lower than X's, with which a matrix can still accurately portray the data variance in X. This is because we believe a matrix in which the columns are dependent upon one another can offer more useful and accurate information on a particular data set. After determining the approximation that appears to be the best, we mark columns in X that have been proven to be most likely incorrect and attempt to fix these values and fill in missing ones using values present in the same columns of similar rows.

Work in progress. :)