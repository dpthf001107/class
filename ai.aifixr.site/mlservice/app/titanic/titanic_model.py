from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

class TitanicModel:
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=300,
            max_depth=7,
            random_state=42
        )

    def fit(self, X, y):
        self.model.fit(X, y)

    def predict(self, X):
        return self.model.predict(X)

    def evaluate(self, X, y):
        pred = self.model.predict(X)
        return accuracy_score(y, pred)
