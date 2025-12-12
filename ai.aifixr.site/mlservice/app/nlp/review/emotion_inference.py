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


class EmotionInference:
    
    
    def __init__(self):
        pass

    