import nltk
import os
import numpy as np
import pandas as pd
import collections
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from wordcloud import WordCloud
from nltk.corpus import stopwords

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('punkt_tab')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

csv_path = os.path.join(BASE_DIR, "data", "spam.csv")


mails = pd.read_csv(csv_path, encoding='latin-1')

mails.drop(['Unnamed: 2', 'Unnamed: 3', 'Unnamed: 4'], axis=1, inplace=True)

mails.rename(columns={'v1': 'spam', 'v2': 'message'}, inplace=True)

mails['spam'] = mails['spam'].map({'ham': False, 'spam': True})


from sklearn.model_selection import train_test_split

train_data, test_data = train_test_split(mails, train_size=0.70, random_state=42)

spam_counts = train_data['spam'].value_counts()
print(spam_counts)






stop_words = set(stopwords.words('english'))
stemmer = PorterStemmer()

def process_message(message, wordlist=None):
    if not message or not isinstance(message, str):
        raise ValueError("Message must be a non-empty string.")

    words = message.lower()  
    words = word_tokenize(words)  
    words = [word for word in words if len(word) > 1]  
    words = [word for word in words if word not in stop_words]  
    words = [stemmer.stem(word) for word in words]  
    return words

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import numpy as np

train_data['preprocessed_message'] = train_data['message'].apply(
    lambda x: ' '.join(process_message(x))
)
test_data['preprocessed_message'] = test_data['message'].apply(
    lambda x: ' '.join(process_message(x))
)

vectorizer = CountVectorizer()
X_train = vectorizer.fit_transform(train_data['preprocessed_message'])
y_train = train_data['spam']
X_test = vectorizer.transform(test_data['preprocessed_message'])
y_test = test_data['spam']

nb_model = MultinomialNB()
nb_model.fit(X_train, y_train)

def spam(message, model=nb_model, vectorizer=vectorizer, percentage=True):
    if not message or not isinstance(message, str):
        raise ValueError("Message must be a non-empty string.")

    preprocessed_message = ' '.join(process_message(message))
    message_vectorized = vectorizer.transform([preprocessed_message])
    spam_prob = model.predict_proba(message_vectorized)[0, 1]

    if percentage:
        print(f"Spam probability: {spam_prob * 100:.2f}%")
    return spam_prob > 0.5 if not percentage else spam_prob * 100

# Save the model and vectorizer
import joblib
joblib.dump(nb_model, 'spam_classifier_model.pkl')
joblib.dump(vectorizer, 'count_vectorizer.pkl')

print("Model and vectorizer saved successfully!")