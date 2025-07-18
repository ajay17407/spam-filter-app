import sys 
import joblib
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import CountVectorizer
from nltk.stem import PorterStemmer

model = joblib.load('models/spam_classifier_model.pkl')
vectorizer =  joblib.load('models/count_vectorizer.pkl')

stop_words = set(stopwords.words("english"))
stemmer  = PorterStemmer()

def process_message(message):
    if not message or not isinstance(message, str):
        raise ValueError("Message must be a non-empty string.")

    words = message.lower()  
    words = word_tokenize(words) 
    words = [word for word in words if len(word) > 1]  
    words = [word for word in words if word not in stop_words]  
    words = [stemmer.stem(word) for word in words]  
    return " ".join(words)

message = sys.argv[1]


processed_message = process_message(message)


message_vectorized = vectorizer.transform([processed_message])
spam_prob = model.predict_proba(message_vectorized)[0,1]

print(spam_prob)