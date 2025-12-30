# ************
# NLTK 자연어 처리 패키지 - OOP 버전
# ************
"""
https://datascienceschool.net/view-notebook/118731eec74b4ad3bdd2f89bab077e1b/
NLTK(Natural Language Toolkit) 패키지는 
교육용으로 개발된 자연어 처리 및 문서 분석용 파이썬 패키지다. 
다양한 기능 및 예제를 가지고 있으며 실무 및 연구에서도 많이 사용된다.
NLTK 패키지가 제공하는 주요 기능은 다음과 같다.
- 말뭉치
- 토큰 생성
- 형태소 분석
- 품사 태깅
"""

import nltk
from nltk.tokenize import sent_tokenize, word_tokenize, RegexpTokenizer
from nltk.stem import PorterStemmer, LancasterStemmer, WordNetLemmatizer
from nltk.tag import pos_tag, untag
from nltk import Text, FreqDist
from wordcloud import WordCloud
import matplotlib.pyplot as plt
from typing import List, Tuple, Dict, Optional
from pathlib import Path
import os


class EmmaWordCloud:
    """
    제인 오스틴의 '엠마' 소설을 분석하고 워드클라우드를 생성하는 클래스
    
    이 클래스는 NLTK를 사용하여:
    - 말뭉치 로드 및 전처리
    - 토큰 생성
    - 형태소 분석
    - 품사 태깅
    - 빈도 분석
    - 워드클라우드 생성
    """
    
    def __init__(self, corpus_name: str = "austen-emma.txt", download_quiet: bool = True):
        """
        초기화 메서드
        
        Args:
            corpus_name: 분석할 말뭉치 파일명 (기본값: "austen-emma.txt")
            download_quiet: NLTK 데이터 다운로드 시 조용한 모드 사용 여부
        """
        # NLTK 데이터 다운로드
        nltk.download('book', quiet=download_quiet)
        nltk.download('punkt', quiet=download_quiet)
        nltk.download('averaged_perceptron_tagger', quiet=download_quiet)
        nltk.download('averaged_perceptron_tagger_eng', quiet=download_quiet)
        nltk.download('wordnet', quiet=download_quiet)
        nltk.download('omw-1.4', quiet=download_quiet)  # WordNet 데이터
        
        # 말뭉치 로드
        self.corpus_name = corpus_name
        self.raw_text = nltk.corpus.gutenberg.raw(corpus_name)
        
        # 토큰화기 초기화
        self.regex_tokenizer = RegexpTokenizer("[\w]+")
        
        # 형태소 분석기 초기화
        self.porter_stemmer = PorterStemmer()
        self.lancaster_stemmer = LancasterStemmer()
        self.lemmatizer = WordNetLemmatizer()
        
        # Text 객체 초기화 (나중에 생성)
        self.text: Optional[Text] = None
        
        # 빈도 분포 객체 초기화
        self.freq_dist: Optional[FreqDist] = None
        self.names_freq_dist: Optional[FreqDist] = None
        
        # 기본 불용어 리스트
        self.stopwords = ["Mr.", "Mrs.", "Miss", "Mr", "Mrs", "Dear"]
        
        # save 폴더 경로 설정 (현재 파일 기준 상대 경로)
        self.save_dir = str(Path(__file__).parent.parent / 'save')
        os.makedirs(self.save_dir, exist_ok=True)
    
    def get_available_corpus_files(self) -> List[str]:
        """
        사용 가능한 Gutenberg 말뭉치 파일 목록 반환
        
        Returns:
            말뭉치 파일명 리스트
        """
        return nltk.corpus.gutenberg.fileids()
    
    def get_raw_text_preview(self, length: int = 1302) -> str:
        """
        원문 텍스트 미리보기
        
        Args:
            length: 미리볼 텍스트 길이
            
        Returns:
            원문 텍스트의 일부
        """
        return self.raw_text[:length]
    
    # ************
    # 토큰 생성 메서드
    # ************
    
    def tokenize_sentences(self, text: Optional[str] = None) -> List[str]:
        """
        문장 단위로 토큰화
        
        Args:
            text: 토큰화할 텍스트 (None이면 전체 원문 사용)
            
        Returns:
            문장 리스트
        """
        target_text = text if text is not None else self.raw_text
        return sent_tokenize(target_text)
    
    def tokenize_words(self, text: Optional[str] = None) -> List[str]:
        """
        단어 단위로 토큰화
        
        Args:
            text: 토큰화할 텍스트 (None이면 전체 원문 사용)
            
        Returns:
            단어 토큰 리스트
        """
        target_text = text if text is not None else self.raw_text
        return word_tokenize(target_text)
    
    def tokenize_regex(self, text: Optional[str] = None) -> List[str]:
        """
        정규표현식을 사용한 토큰화
        
        Args:
            text: 토큰화할 텍스트 (None이면 전체 원문 사용)
            
        Returns:
            정규표현식으로 토큰화된 단어 리스트
        """
        target_text = text if text is not None else self.raw_text
        return self.regex_tokenizer.tokenize(target_text)
    
    # ***************
    # 형태소 분석 메서드
    # ***************
    
    def stem_porter(self, words: List[str]) -> List[str]:
        """
        Porter Stemmer를 사용한 어간 추출
        
        Args:
            words: 어간 추출할 단어 리스트
            
        Returns:
            어간 추출된 단어 리스트
        """
        return [self.porter_stemmer.stem(w) for w in words]
    
    def stem_lancaster(self, words: List[str]) -> List[str]:
        """
        Lancaster Stemmer를 사용한 어간 추출
        
        Args:
            words: 어간 추출할 단어 리스트
            
        Returns:
            어간 추출된 단어 리스트
        """
        return [self.lancaster_stemmer.stem(w) for w in words]
    
    def lemmatize(self, words: List[str], pos: Optional[str] = None) -> List[str]:
        """
        원형 복원 (Lemmatization)
        
        Args:
            words: 원형 복원할 단어 리스트
            pos: 품사 태그 (선택사항)
            
        Returns:
            원형 복원된 단어 리스트
        """
        if pos:
            return [self.lemmatizer.lemmatize(w, pos=pos) for w in words]
        return [self.lemmatizer.lemmatize(w) for w in words]
    
    # **********
    # POS 태깅 메서드
    # **********
    
    def get_pos_tag_help(self, tag: str) -> None:
        """
        품사 태그에 대한 도움말 출력
        
        Args:
            tag: 품사 태그 (예: 'VB', 'NN', 'NNP')
        """
        nltk.help.upenn_tagset(tag)
    
    def tag_pos(self, sentence: str) -> List[Tuple[str, str]]:
        """
        품사 태깅 수행
        
        Args:
            sentence: 품사 태깅할 문장
            
        Returns:
            (단어, 품사) 튜플 리스트
        """
        tokens = word_tokenize(sentence)
        return pos_tag(tokens)
    
    def extract_nouns(self, tagged_list: List[Tuple[str, str]]) -> List[str]:
        """
        명사만 추출
        
        Args:
            tagged_list: 품사 태깅된 리스트
            
        Returns:
            명사 리스트
        """
        return [t[0] for t in tagged_list if t[1] == "NN"]
    
    def remove_tags(self, tagged_list: List[Tuple[str, str]]) -> List[str]:
        """
        품사 태그 제거
        
        Args:
            tagged_list: 품사 태깅된 리스트
            
        Returns:
            태그가 제거된 단어 리스트
        """
        return untag(tagged_list)
    
    def create_pos_tokenizer(self, tagged_list: List[Tuple[str, str]]):
        """
        품사 정보를 포함한 토큰 생성 함수 생성
        
        Args:
            tagged_list: 품사 태깅된 리스트
            
        Returns:
            토큰 생성 함수
        """
        def tokenizer(doc):
            return ["/".join(p) for p in tagged_list]
        return tokenizer
    
    # ***********
    # Text 클래스 관련 메서드
    # ***********
    
    def create_text_object(self, name: str = "Emma") -> Text:
        """
        NLTK Text 객체 생성
        
        Args:
            name: Text 객체 이름
            
        Returns:
            Text 객체
        """
        tokens = self.tokenize_regex()
        self.text = Text(tokens, name=name)
        return self.text
    
    def plot_word_frequency(self, num_words: int = 20, show: bool = True) -> None:
        """
        단어 빈도 그래프 그리기
        
        Args:
            num_words: 표시할 상위 단어 개수
            show: 그래프 표시 여부
        """
        if self.text is None:
            self.create_text_object()
        
        self.text.plot(num_words)
        if show:
            plt.show()
    
    def plot_dispersion(self, words: List[str], show: bool = True) -> None:
        """
        단어 분산 플롯 그리기
        
        Args:
            words: 분산을 확인할 단어 리스트
            show: 그래프 표시 여부
        """
        if self.text is None:
            self.create_text_object()
        
        self.text.dispersion_plot(words)
        if show:
            plt.show()
    
    def get_concordance(self, word: str, lines: int = 5) -> None:
        """
        단어의 문맥 표시
        
        Args:
            word: 찾을 단어
            lines: 표시할 줄 수
        """
        if self.text is None:
            self.create_text_object()
        
        self.text.concordance(word, lines=lines)
    
    def get_similar_words(self, word: str, num: int = 10) -> None:
        """
        유사한 문맥에서 사용된 단어 찾기
        
        Args:
            word: 기준 단어
            num: 반환할 단어 개수
        """
        if self.text is None:
            self.create_text_object()
        
        self.text.similar(word, num)
    
    def get_collocations(self, num: int = 10) -> None:
        """
        연어(collocation) 찾기
        
        Args:
            num: 반환할 연어 개수
        """
        if self.text is None:
            self.create_text_object()
        
        self.text.collocations(num)
    
    # ***********
    # FreqDist 관련 메서드
    # ***********
    
    def create_vocab_freq_dist(self) -> FreqDist:
        """
        전체 어휘 빈도 분포 생성
        
        Returns:
            FreqDist 객체
        """
        if self.text is None:
            self.create_text_object()
        
        self.freq_dist = self.text.vocab()
        return self.freq_dist
    
    def extract_names(self, pos_tag_name: str = "NNP") -> List[str]:
        """
        고유명사(이름) 추출
        
        Args:
            pos_tag_name: 추출할 품사 태그 (기본값: "NNP" - 고유명사)
            
        Returns:
            이름 리스트
        """
        from nltk.tag import pos_tag as nltk_pos_tag
        tokens = self.tokenize_regex()
        tagged_tokens = nltk_pos_tag(tokens)
        names = [
            t[0] for t in tagged_tokens 
            if t[1] == pos_tag_name and t[0] not in self.stopwords
        ]
        return names
    
    def create_names_freq_dist(self, pos_tag_name: str = "NNP") -> FreqDist:
        """
        이름 빈도 분포 생성
        
        Args:
            pos_tag_name: 추출할 품사 태그 (기본값: "NNP")
            
        Returns:
            이름 빈도 분포 객체
        """
        names = self.extract_names(pos_tag_name)
        self.names_freq_dist = FreqDist(names)
        return self.names_freq_dist
    
    def get_freq_stats(self, word: str, freq_dist: Optional[FreqDist] = None) -> Dict:
        """
        단어 빈도 통계 조회
        
        Args:
            word: 조회할 단어
            freq_dist: 사용할 빈도 분포 객체 (None이면 names_freq_dist 사용)
            
        Returns:
            빈도 통계 딕셔너리
        """
        if freq_dist is None:
            if self.names_freq_dist is None:
                self.create_names_freq_dist()
            freq_dist = self.names_freq_dist
        
        return {
            "total_words": freq_dist.N(),
            "count": freq_dist[word],
            "frequency": freq_dist.freq(word)
        }
    
    def get_most_common(self, num: int = 5, freq_dist: Optional[FreqDist] = None) -> List[Tuple[str, int]]:
        """
        가장 빈번한 단어 조회
        
        Args:
            num: 반환할 단어 개수
            freq_dist: 사용할 빈도 분포 객체 (None이면 names_freq_dist 사용)
            
        Returns:
            (단어, 빈도) 튜플 리스트
        """
        if freq_dist is None:
            if self.names_freq_dist is None:
                self.create_names_freq_dist()
            freq_dist = self.names_freq_dist
        
        return freq_dist.most_common(num)
    
    # ***********
    # 워드클라우드 메서드
    # ***********
    
    def generate_wordcloud(
        self,
        width: int = 1000,
        height: int = 600,
        background_color: str = "white",
        random_state: int = 0,
        freq_dist: Optional[FreqDist] = None,
        show: bool = True,
        auto_save: bool = True,
        filename: str = "emma_wordcloud.png"
    ) -> WordCloud:
        """
        워드클라우드 생성
        
        Args:
            width: 이미지 너비
            height: 이미지 높이
            background_color: 배경색
            random_state: 랜덤 시드
            freq_dist: 사용할 빈도 분포 객체 (None이면 names_freq_dist 사용)
            show: 그래프 표시 여부
            auto_save: 자동으로 save 폴더에 저장할지 여부 (기본값: True)
            filename: 저장할 파일명 (기본값: "emma_wordcloud.png")
            
        Returns:
            WordCloud 객체
        """
        if freq_dist is None:
            if self.names_freq_dist is None:
                self.create_names_freq_dist()
            freq_dist = self.names_freq_dist
        
        wc = WordCloud(
            width=width,
            height=height,
            background_color=background_color,
            random_state=random_state
        )
        
        wc.generate_from_frequencies(freq_dist)
        
        # 자동 저장 (save 폴더에)
        if auto_save:
            save_path = os.path.join(self.save_dir, filename)
            wc.to_file(save_path)
        
        if show:
            plt.imshow(wc)
            plt.axis("off")
            plt.show()
        
        return wc
    
    def save_wordcloud(
        self,
        filepath: Optional[str] = None,
        width: int = 1000,
        height: int = 600,
        background_color: str = "white",
        random_state: int = 0,
        freq_dist: Optional[FreqDist] = None,
        filename: str = "emma_wordcloud.png"
    ) -> str:
        """
        워드클라우드를 파일로 저장
        
        Args:
            filepath: 저장할 파일 경로 (None이면 save 폴더에 filename으로 저장)
            width: 이미지 너비
            height: 이미지 높이
            background_color: 배경색
            random_state: 랜덤 시드
            freq_dist: 사용할 빈도 분포 객체 (None이면 names_freq_dist 사용)
            filename: filepath가 None일 때 사용할 파일명 (기본값: "emma_wordcloud.png")
            
        Returns:
            저장된 파일 경로
        """
        # filepath가 제공되지 않으면 save 폴더에 저장
        if filepath is None:
            filepath = os.path.join(self.save_dir, filename)
        
        wc = self.generate_wordcloud(
            width=width,
            height=height,
            background_color=background_color,
            random_state=random_state,
            freq_dist=freq_dist,
            show=False,
            auto_save=False  # save_wordcloud에서 직접 저장하므로 중복 저장 방지
        )
        wc.to_file(filepath)
        return filepath


# ***********
# 사용 예제
# ***********

if __name__ == "__main__":
    # 클래스 인스턴스 생성
    emma = EmmaWordCloud()
    
    # 원문 미리보기
    print("=== 원문 미리보기 ===")
    print(emma.get_raw_text_preview(500))
    print("\n")
    
    # 토큰 생성 예제
    print("=== 문장 토큰화 예제 ===")
    sentences = emma.tokenize_sentences(emma.raw_text[:1000])
    print(sentences[3] if len(sentences) > 3 else sentences)
    print("\n")
    
    # 형태소 분석 예제
    print("=== 형태소 분석 예제 ===")
    words = ['lives', 'crying', 'flies', 'dying']
    print("Porter Stemmer:", emma.stem_porter(words))
    print("Lancaster Stemmer:", emma.stem_lancaster(words))
    print("Lemmatizer:", emma.lemmatize(words))
    print("Lemmatizer (verb):", emma.lemmatize(["dying"], pos="v"))
    print("\n")
    
    # POS 태깅 예제
    print("=== POS 태깅 예제 ===")
    sentence = "Emma refused to permit us to obtain the refuse permit"
    tagged = emma.tag_pos(sentence)
    print(tagged)
    print("명사만 추출:", emma.extract_nouns(tagged))
    print("\n")
    
    # Text 객체 생성 및 분석
    print("=== Text 객체 분석 ===")
    emma.create_text_object()
    emma.get_concordance('Emma', lines=3)
    print("\n")
    
    # 빈도 분석
    print("=== 빈도 분석 ===")
    emma.create_names_freq_dist()
    stats = emma.get_freq_stats("Emma")
    print(f"전체 단어 수: {stats['total_words']}")
    print(f"'Emma' 출현 횟수: {stats['count']}")
    print(f"'Emma' 출현 빈도: {stats['frequency']:.4f}")
    print(f"가장 빈번한 단어 (상위 5개): {emma.get_most_common(5)}")
    print("\n")
    
    # 워드클라우드 생성
    print("=== 워드클라우드 생성 ===")
    emma.generate_wordcloud(show=True)
