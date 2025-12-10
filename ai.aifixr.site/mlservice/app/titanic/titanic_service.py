import pandas as pd
import os
import logging
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.tree import DecisionTreeClassifier
from lightgbm import LGBMClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
from app.titanic.titanic_method import TitanicMethod
from app.titanic.titanic_dataset import TitanicDataset


# Logger 설정
logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger(__name__)

class TitanicService:
    """타이타닉 TITANIC 승객 데이터 처리 및 머신러닝 서비스"""

    def __init__(self):
        self.dataset = None  # TitanicDataset 객체
        # 모델들
        self.lr_model = None
        self.nb_model = None
        self.rf_model = None
        self.dt_model = None
        self.lgbm_model = None
        self.knn_model = None
        self.ensemble_model = None
        # Scaler
        self.scaler = None
        # 평가 결과
        self.evaluation_results = None

    def preprocess(self):
        the_method = TitanicMethod()
        current_dir = os.path.dirname(os.path.abspath(__file__))

        # -----------------------------
        # 데이터 읽기
        # -----------------------------
        train_path = os.path.join(current_dir, 'train.csv')
        test_path = os.path.join(current_dir, 'test.csv')
        df_train, df_test = the_method.read_csv(train_path, test_path)
        logger.info("❤️❤️ 데이터 읽기 완료")

        # -----------------------------
        # Feature Engineering (원본 데이터 사용)
        # -----------------------------
        logger.info("Feature Engineering 시작...")
        
        # FamilySize 생성 (원본 데이터에서)
        df_train["FamilySize"] = df_train["SibSp"] + df_train["Parch"] + 1
        df_test["FamilySize"] = df_test["SibSp"] + df_test["Parch"] + 1
        
        # IsAlone 생성
        df_train["IsAlone"] = (df_train["FamilySize"] == 1).astype(int)
        df_test["IsAlone"] = (df_test["FamilySize"] == 1).astype(int)

        # -----------------------------
        # Train 전처리
        # -----------------------------
        this_train = the_method.create_df(df_train, 'Survived')       # features만
        this_label = the_method.create_label(df_train, 'Survived')    # label 생성

        # -----------------------------
        # Test 전처리
        # -----------------------------
        this_test = the_method.create_df(df_test, 'Survived')

        # -----------------------------
        # TitanicDataset으로 통합
        # -----------------------------
        this = TitanicDataset()
        this.train = this_train
        this.test = this_test
        this.label = this_label

        self.dataset = this

        # -----------------------------
        # 전처리 적용
        # -----------------------------
        logger.info("❤️❤️ 전처리 시작")
        
        # 불필요한 컬럼 제거
        drop_features = ['SibSp', 'Parch', 'Ticket', 'Cabin']
        self.dataset = the_method.drop_features(self.dataset, *drop_features)
        
        # 기본 전처리
        self.dataset = the_method.pclass_ordinal(self.dataset)
        self.dataset = the_method.fare_ordinal(self.dataset)
        self.dataset = the_method.embarked_nominal(self.dataset)
        self.dataset = the_method.gender_nominal(self.dataset)
        self.dataset = the_method.title_nominal(self.dataset)
        self.dataset = the_method.age_ratio(self.dataset)
        
        # 불필요한 컬럼 제거
        drop_original = ['Name']
        self.dataset = the_method.drop_features(self.dataset, *drop_original)
        
        # 결측치 최종 확인 및 처리
        if self.dataset.train.isnull().sum().sum() > 0:
            logger.warning("결측치 발견, 중앙값으로 대체합니다.")
            self.dataset.train = self.dataset.train.fillna(self.dataset.train.median())
            self.dataset.test = self.dataset.test.fillna(self.dataset.test.median())

        logger.info("❤️❤️ 전처리 완료!")
        
        # 전처리된 데이터 미리보기 (숫자로 변환된 상태)
        logger.info("\n" + "="*80)
        logger.info("전처리된 Train 데이터 (상위 10개 샘플)")
        logger.info("="*80)
        logger.info(f"\n{self.dataset.train.head(10).to_string()}")
        
        logger.info("\n" + "="*80)
        logger.info("데이터 타입 정보")
        logger.info("="*80)
        logger.info(f"\n{self.dataset.train.dtypes.to_string()}")
        
        logger.info("\n" + "="*80)
        logger.info("데이터 통계 정보")
        logger.info("="*80)
        logger.info(f"\n{self.dataset.train.describe().to_string()}")
        
        logger.info("\n" + "="*80)
        logger.info(f"Train 데이터 shape: {self.dataset.train.shape}")
        logger.info(f"Test 데이터 shape: {self.dataset.test.shape}")
        logger.info(f"Label shape: {self.dataset.label.shape}")
        logger.info("="*80 + "\n")

    # -----------------------------
    # 모델링, 학습, 평가
    # -----------------------------
    def modeling(self):
        """6가지 알고리즘 모델 초기화 + 앙상블"""
        logger.info("❤️❤️ 모델링 시작")
        
        # 1. 로지스틱 회귀
        self.lr_model = LogisticRegression(max_iter=1000, random_state=42)
        
        # 2. 나이브베이즈
        self.nb_model = GaussianNB()
        
        # 3. 랜덤포레스트 (하이퍼파라미터 최적화)
        self.rf_model = RandomForestClassifier(
            n_estimators=100, 
            max_depth=None,  # 제한 없음 (이전 버전으로 복원)
            min_samples_split=2,
            random_state=42
        )
        
        # 4. 결정트리
        self.dt_model = DecisionTreeClassifier(random_state=42)
        
        # 5. LightGBM (하이퍼파라미터 최적화)
        self.lgbm_model = LGBMClassifier(
            n_estimators=100, 
            learning_rate=0.1, 
            num_leaves=31, 
            random_state=42,
            verbose=-1
        )
        
        # 6. KNN
        self.knn_model = KNeighborsClassifier(n_neighbors=13)
        
        # 7. 앙상블 모델 (성능 좋은 모델만 선택)
        self.ensemble_model = VotingClassifier(
            estimators=[
                ('rf', self.rf_model), 
                ('lgbm', self.lgbm_model), 
                ('lr', self.lr_model),
                ('nb', self.nb_model)
            ],
            voting='soft'
        )
        
        logger.info("❤️❤️ 모델링 완료")

    def create_k_fold(self):
        """StratifiedKFold 10-Fold 생성"""
        return StratifiedKFold(n_splits=10, shuffle=True, random_state=42)

    def evaluate(self):
        """StratifiedKFold 10-Fold 교차검증으로 평가"""
        logger.info("❤️❤️ 평가 시작 (10-Fold Cross Validation)")
        
        X = self.dataset.train
        y = self.dataset.label.values.ravel()
        
        k_fold = self.create_k_fold()
        results = {}
        
        # 모든 모델 평가
        models = [
            ("logistic_regression", self.lr_model),
            ("naive_bayes", self.nb_model),
            ("random_forest", self.rf_model),
            ("decision_tree", self.dt_model),
            ("lightgbm", self.lgbm_model),
            ("knn", self.knn_model),
            ("ensemble", self.ensemble_model)
        ]
        
        for name, model in models:
            logger.info(f"{name} 평가 중...")
            scores = cross_val_score(
                model, X, y, 
                cv=k_fold, 
                scoring='accuracy',
                n_jobs=-1
            )
            accuracy = round(np.mean(scores) * 100, 2)
            results[name] = float(accuracy)
            logger.info(f'{name} 10-Fold CV 평균 정확도: {accuracy}%')
        
        self.evaluation_results = results
        logger.info("❤️❤️ 평가 완료")
        
        return results
    
    def submit(self):
        """RandomForest 모델로 test 데이터 예측 및 Kaggle 제출용 CSV 생성"""
        logger.info("❤️❤️ 제출 파일 생성 시작")
        
        # RandomForest 모델로 전체 train 데이터 학습
        X_train = self.dataset.train
        y_train = self.dataset.label.values.ravel()
        
        logger.info("RandomForest 모델 학습 중...")
        self.rf_model.fit(X_train, y_train)
        
        # Test 데이터 예측
        X_test = self.dataset.test
        logger.info("Test 데이터 예측 중...")
        predictions = self.rf_model.predict(X_test)
        
        # 원본 test.csv에서 PassengerId 읽기
        current_dir = os.path.dirname(os.path.abspath(__file__))
        test_path = os.path.join(current_dir, 'test.csv')
        df_test_original = pd.read_csv(test_path)
        
        # 제출용 DataFrame 생성
        submission = pd.DataFrame({
            'PassengerId': df_test_original['PassengerId'],
            'Survived': predictions.astype(int)
        })
        
        # download 폴더에 저장 (app/download)
        # current_dir = app/titanic
        # os.path.dirname(current_dir) = app
        download_dir = os.path.join(os.path.dirname(current_dir), 'download')
        os.makedirs(download_dir, exist_ok=True)
        
        submission_path = os.path.join(download_dir, 'titanic_submission.csv')
        submission.to_csv(submission_path, index=False)
        
        logger.info(f"제출 파일 생성 완료: {submission_path}")
        logger.info(f"예측 결과 요약: 생존 {predictions.sum()}명, 사망 {len(predictions) - predictions.sum()}명")
        
        return submission_path
