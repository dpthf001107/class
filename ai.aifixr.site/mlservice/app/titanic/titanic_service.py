import pandas as pd
import os
import logging
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier
from lightgbm import LGBMClassifier
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from app.titanic.titanic_method import TitanicMethod
from app.titanic.titanic_dataset import TitanicDataset

# Logger 설정
logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger(__name__)

class TitanicService:
    """타이타닉 승객 데이터 처리 및 머신러닝 서비스"""

    def __init__(self):
        self.dataset = None  # TitanicDataset 객체
        # 모델들
        self.lr_model = None
        self.nb_model = None
        self.rf_model = None
        self.lgbm_model = None
        self.svm_model = None
        # 학습/검증 데이터
        self.X_train = None
        self.X_val = None
        self.y_train = None
        self.y_val = None
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
        # Train 전처리
        # -----------------------------
        this_train = the_method.create_df(df_train, 'Survived')       # features만
        this_label = the_method.create_label(df_train, 'Survived')    # label 생성

        logger.info("❤️❤️ Train 데이터 정보")
        logger.info("1. Train 의 type: %s", type(this_train))
        logger.info("2. Train 의 columns: %s", list(this_train.columns))
        logger.info("3. Train 의 상위 5개 행:\n%s", this_train.head(5))
        logger.info("4. Train null 개수:\n%s", this_train.isnull().sum())

        # -----------------------------
        # Test 전처리
        # -----------------------------
        this_test = the_method.create_df(df_test, 'Survived')
        logger.info("💛💛 Test 데이터 정보")
        logger.info("1. Test 의 type: %s", type(this_test))
        logger.info("2. Test 의 columns: %s", list(this_test.columns))
        logger.info("3. Test 의 상위 5개 행:\n%s", this_test.head(5))
        logger.info("4. Test null 개수:\n%s", this_test.isnull().sum())

        # -----------------------------
        # TitanicDataset으로 통합
        # -----------------------------
        this = TitanicDataset()
        this.train = this_train
        this.test = this_test
        this.label = this_label     # 여기서 label 할당!

        self.dataset = this

        # -----------------------------
        # 전처리 적용
        # -----------------------------
        logger.info("❤️❤️ 전처리 시작")
        drop_features = ['SibSp', 'Parch', 'Ticket', 'Cabin']
        self.dataset = the_method.drop_features(self.dataset, *drop_features)
        self.dataset = the_method.pclass_ordinal(self.dataset)
        self.dataset = the_method.fare_ordinal(self.dataset)
        self.dataset = the_method.embarked_nominal(self.dataset)
        self.dataset = the_method.gender_nominal(self.dataset)
        self.dataset = the_method.title_nominal(self.dataset)  # Title 생성 후 age_ratio
        self.dataset = the_method.age_ratio(self.dataset)

        # 불필요한 컬럼 제거
        drop_original = ['Name']
        self.dataset = the_method.drop_features(self.dataset, *drop_original)

        # -----------------------------
        # 전처리 후 정보
        # -----------------------------
        logger.info("❤️❤️ 전처리 후 Train 데이터 정보")
        logger.info("1. Train 의 type: %s", type(self.dataset.train))
        logger.info("2. Train 의 columns: %s", list(self.dataset.train.columns))
        logger.info("3. Train 의 상위 5개 행:\n%s", self.dataset.train.head(5))
        logger.info("4. Train null 개수:\n%s", self.dataset.train.isnull().sum())

        logger.info("💛💛 전처리 후 Test 데이터 정보")
        logger.info("1. Test 의 type: %s", type(self.dataset.test))
        logger.info("2. Test 의 columns: %s", list(self.dataset.test.columns))
        logger.info("3. Test 의 상위 5개 행:\n%s", self.dataset.test.head(5))
        logger.info("4. Test null 개수:\n%s", self.dataset.test.isnull().sum())

        logger.info("❤️❤️ 전처리 완료!")

    # -----------------------------
    # 모델링, 학습, 평가
    # -----------------------------
    def modeling(self):
        """5가지 알고리즘 모델 초기화"""
        logger.info("❤️❤️ 모델링 시작")
        
        # 1. 로지스틱 회귀
        self.lr_model = LogisticRegression(max_iter=1000, random_state=42)
        
        # 2. 나이브베이즈
        self.nb_model = GaussianNB()
        
        # 3. 랜덤포레스트
        self.rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
        
        # 4. LightGBM
        self.lgbm_model = LGBMClassifier(random_state=42, verbose=-1)
        
        # 5. SVM
        self.svm_model = SVC(kernel='rbf', random_state=42)
        
        logger.info("❤️❤️ 모델링 완료")

    def learning(self):
        """Train/Validation 분할 후 5가지 모델 학습"""
        logger.info("❤️❤️ 학습 시작")
        
        # 전처리 후 결측치 확인
        if self.dataset.train.isnull().sum().sum() > 0:
            raise ValueError("전처리 후에도 결측치가 남아있습니다.")
        
        # Train/Validation 분할 (80:20, stratify=y)
        X = self.dataset.train
        y = self.dataset.label.values.ravel()  # DataFrame을 1D array로 변환
        
        self.X_train, self.X_val, self.y_train, self.y_val = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        logger.info(f"Train 데이터: {len(self.X_train)}개, Validation 데이터: {len(self.X_val)}개")
        
        # 1. 로지스틱 회귀 학습
        logger.info("로지스틱 회귀 학습 중...")
        self.lr_model.fit(self.X_train, self.y_train)
        
        # 2. 나이브베이즈 학습
        logger.info("나이브베이즈 학습 중...")
        self.nb_model.fit(self.X_train, self.y_train)
        
        # 3. 랜덤포레스트 학습
        logger.info("랜덤포레스트 학습 중...")
        self.rf_model.fit(self.X_train, self.y_train)
        
        # 4. LightGBM 학습
        logger.info("LightGBM 학습 중...")
        self.lgbm_model.fit(self.X_train, self.y_train)
        
        # 5. SVM 학습
        logger.info("SVM 학습 중...")
        self.svm_model.fit(self.X_train, self.y_train)
        
        logger.info("❤️❤️ 학습 완료")

    def evaluate(self):
        """Validation 데이터로 각 모델 평가"""
        logger.info("❤️❤️ 평가 시작")
        
        # 1. 로지스틱 회귀 평가
        lr_pred = self.lr_model.predict(self.X_val)
        lr_accuracy = accuracy_score(self.y_val, lr_pred)
        logger.info(f'로지스틱 회귀 활용한 검증 정확도: {lr_accuracy:.4f}')
        
        # 2. 나이브베이즈 평가
        nb_pred = self.nb_model.predict(self.X_val)
        nb_accuracy = accuracy_score(self.y_val, nb_pred)
        logger.info(f'나이브베이즈 활용한 검증 정확도: {nb_accuracy:.4f}')
        
        # 3. 랜덤포레스트 평가
        rf_pred = self.rf_model.predict(self.X_val)
        rf_accuracy = accuracy_score(self.y_val, rf_pred)
        logger.info(f'랜덤포레스트 활용한 검증 정확도: {rf_accuracy:.4f}')
        
        # 4. LightGBM 평가
        lgbm_pred = self.lgbm_model.predict(self.X_val)
        lgbm_accuracy = accuracy_score(self.y_val, lgbm_pred)
        logger.info(f'LightGBM 활용한 검증 정확도: {lgbm_accuracy:.4f}')
        
        # 5. SVM 평가
        svm_pred = self.svm_model.predict(self.X_val)
        svm_accuracy = accuracy_score(self.y_val, svm_pred)
        logger.info(f'SVM 활용한 검증 정확도: {svm_accuracy:.4f}')
        
        # 결과 저장
        self.evaluation_results = {
            "logistic_regression": float(lr_accuracy),
            "naive_bayes": float(nb_accuracy),
            "random_forest": float(rf_accuracy),
            "lightgbm": float(lgbm_accuracy),
            "svm": float(svm_accuracy)
        }
        
        logger.info("❤️❤️ 평가 완료")
        
        return self.evaluation_results
