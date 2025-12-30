import pandas as pd
from pandas import DataFrame
from app.titanic.titanic_dataset import TitanicDataset


class TitanicMethod(object):

    def __init__(self):
        pass

    # -----------------------------
    # 기본 처리
    # -----------------------------
    def read_csv(self, train_path: str, test_path: str):
        return pd.read_csv(train_path), pd.read_csv(test_path)

    def create_df(self, df: DataFrame, label: str) -> DataFrame:
        return df.drop(columns=[label], errors="ignore")

    def create_label(self, df: DataFrame, label: str) -> DataFrame:
        return df[[label]]

    # -----------------------------
    # 공통: TitanicDataset 구조 기반 처리
    # -----------------------------
    def drop_features(self, this: TitanicDataset, *features: str):
        this.train.drop(columns=list(features), errors="ignore", inplace=True)
        this.test.drop(columns=list(features), errors="ignore", inplace=True)
        return this

    # -----------------------------
    # 결측치 체크
    # -----------------------------
    def check_null(self, this: TitanicDataset):
        return this.train.isnull().sum(), this.test.isnull().sum()

    # -----------------------------
    # Pclass (Ordinal)
    # -----------------------------
    def pclass_ordinal(self, this: TitanicDataset):
        this.train["Pclass"] = this.train["Pclass"].astype(int)
        this.test["Pclass"] = this.test["Pclass"].astype(int)
        return this

    # -----------------------------
    # Title 생성 + Rare 통합
    # -----------------------------
    def title_nominal(self, this: TitanicDataset):

        def extract(df):
            return df["Name"].str.extract(r',\s*([^\.]+)\.', expand=False)

        this.train["Title"] = extract(this.train)
        this.test["Title"] = extract(this.test)

        rare_titles = [
            "Lady", "Countess", "Capt", "Col", "Don", "Dr", "Major", "Rev",
            "Sir", "Jonkheer", "Dona"
        ]

        this.train["Title"] = this.train["Title"].replace(rare_titles, "Rare")
        this.test["Title"] = this.test["Title"].replace(rare_titles, "Rare")

        mapping = {
            "Master": 0,
            "Miss": 1,
            "Mr": 2,
            "Mrs": 3,
            "Rare": 4
        }

        # 매핑되지 않은 값(NaN 포함)은 "Rare"(4)로 처리
        this.train["Title"] = this.train["Title"].map(mapping).fillna(4).astype(int)
        this.test["Title"] = this.test["Title"].map(mapping).fillna(4).astype(int)

        return this

    # -----------------------------
    # Sex encoding
    # -----------------------------
    def gender_nominal(self, this: TitanicDataset):
        mapping = {"male": 0, "female": 1}
        this.train["Sex"] = this.train["Sex"].map(mapping).astype(int)
        this.test["Sex"] = this.test["Sex"].map(mapping).astype(int)
        return this

    # -----------------------------
    # Embarked encoding
    # -----------------------------
    def embarked_nominal(self, this: TitanicDataset):

        mode_val = this.train["Embarked"].mode()[0]

        this.train["Embarked"].fillna(mode_val, inplace=True)
        this.test["Embarked"].fillna(mode_val, inplace=True)

        mapping = {"S": 0, "C": 1, "Q": 2}

        this.train["Embarked"] = this.train["Embarked"].map(mapping).astype(int)
        this.test["Embarked"] = this.test["Embarked"].map(mapping).astype(int)

        return this

    # -----------------------------
    # Fare (qcut)
    # -----------------------------
    def fare_ordinal(self, this: TitanicDataset):

        median_val = this.train["Fare"].median()

        this.train["Fare"].fillna(median_val, inplace=True)
        this.test["Fare"].fillna(median_val, inplace=True)

        train_bins = pd.qcut(this.train["Fare"], q=4, retbins=True, duplicates="drop")[1]

        this.train["Fare"] = pd.cut(this.train["Fare"], bins=train_bins, labels=False, include_lowest=True).astype(int)
        this.test["Fare"] = pd.cut(this.test["Fare"], bins=train_bins, labels=False, include_lowest=True).astype(int)

        return this

    # -----------------------------
    # Age imputing (Title 기반)
    # -----------------------------
    def age_ratio(self, this: TitanicDataset):

        combined = pd.concat([this.train, this.test], ignore_index=True)

        title_medians = combined.groupby("Title")["Age"].median()
        global_median = combined["Age"].median()

        def fill(df):
            df["Age"] = df.apply(
                lambda row: title_medians[row["Title"]] if pd.isna(row["Age"]) else row["Age"],
                axis=1
            )
            df["Age"].fillna(global_median, inplace=True)
            return df

        this.train = fill(this.train)
        this.test = fill(this.test)

        return this
