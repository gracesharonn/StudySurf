import requests

url = "http://127.0.0.1:8900/calculate/quiz/generate"
data = {
    "text_content": "Your sample text here for quiz generation.",
    "quiz_level": "easy"
}

response = requests.post(url, json=data)
print(response.json())  # Prints the response from the server
