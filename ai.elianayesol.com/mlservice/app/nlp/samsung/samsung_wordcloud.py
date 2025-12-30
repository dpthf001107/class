import re
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
from konlpy.tag import Okt


class SamsungWordCloud:
    
    
    def __init__(self):
        self.okt = Okt()
        # save 폴더 경로 설정 (현재 파일 기준 상대 경로)
        self.save_dir = str(Path(__file__).parent.parent / 'save')
        os.makedirs(self.save_dir, exist_ok=True)
        # NLTK 데이터 다운로드 (필요한 경우)
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt', quiet=True)
        try:
            nltk.data.find('tokenizers/punkt_tab')
        except LookupError:
            nltk.download('punkt_tab', quiet=True)

    def text_process(self):
        freq_txt = self.find_freq()
        self.draw_wordcloud()
        return {
                '전처리 결과' : '완료' ,
                'freq_txt' : freq_txt
                }

    def read_file(self):
        self.okt.pos("삼성전자 글로벌센터 전자사업부" , stem=True)
        # 현재 파일 기준 상대 경로로 data 폴더 찾기
        data_dir = Path(__file__).parent.parent / 'data'
        fname = data_dir / 'kr-Report_2018.txt'
        with open(fname, 'r', encoding='utf-8') as f:
            text = f.read()
        return text

    def extract_hangle(self, text:str):
        temp = text.replace("\n", '')
        tokenizer = re.compile(r'[^ ㄱ-ㅣ가-힣]+')
        return tokenizer.sub('', temp)

    def change_token(self, texts):
        # 한국어 텍스트는 공백으로 분리하거나 Okt를 사용
        # 이미 extract_hangle로 한글만 남았으므로 공백으로 분리
        return texts.split()
    
    def extract_noun(self):
        # 삼성전자의 스마트폰은 -> 삼성전자 스마트폰
        # 한글만 추출한 텍스트를 Okt로 명사 추출
        hangle_text = self.extract_hangle(self.read_file())
        # Okt의 nouns 메서드를 사용하여 명사만 추출 (더 효율적)
        nouns = self.okt.nouns(hangle_text)
        # 길이가 1보다 큰 명사만 필터링
        noun_tokens = [noun for noun in nouns if len(noun) > 1]
        texts = ' '.join(noun_tokens)
        return texts


    def read_stopword(self):
        self.okt.pos("삼성전자 글로벌센터 전자사업부", stem=True)
        # 현재 파일 기준 상대 경로로 data 폴더 찾기
        data_dir = Path(__file__).parent.parent / 'data'
        fname = data_dir / 'stopwords.txt'
        with open(fname, 'r', encoding='utf-8') as f:
            stopwords = f.read()
        return stopwords

    def remove_stopword(self):
        texts = self.extract_noun()
        tokens = self.change_token(texts)
        # print('------- 1 명사 -------')
        # print(texts[:30])
        stopwords = self.read_stopword()
        # print('------- 2 스톱 -------')
        # print(stopwords[:30])
        # print('------- 3 필터 -------')
        texts = [text for text in tokens
                 if text not in stopwords]
        # print(texts[:30])
        return texts

    def find_freq(self):
        texts = self.remove_stopword()
        freqtxt = FreqDist(texts)
        return freqtxt


    def draw_wordcloud(self, filename: str = "samsung_wordcloud.png", auto_save: bool = True, show: bool = True):
        """
        워드클라우드 생성 및 저장
        
        Args:
            filename: 저장할 파일명 (기본값: "samsung_wordcloud.png")
            auto_save: 자동으로 save 폴더에 저장할지 여부 (기본값: True)
            show: 그래프 표시 여부 (기본값: True)
        """
        texts = self.remove_stopword()
        # 현재 파일 기준 상대 경로로 폰트 파일 찾기
        data_dir = Path(__file__).parent.parent / 'data'
        font_path = str(data_dir / 'D2Coding.ttf')
        wcloud = WordCloud(font_path=font_path, relative_scaling=0.2,
                           background_color='white').generate(" ".join(texts))
        
        # 자동 저장 (save 폴더에)
        if auto_save:
            save_path = os.path.join(self.save_dir, filename)
            wcloud.to_file(save_path)
            print(f"워드클라우드가 저장되었습니다: {save_path}")
        
        if show:
            plt.figure(figsize=(12, 12))
            plt.imshow(wcloud, interpolation='bilinear')
            plt.axis('off')
            plt.show()
        
        return wcloud