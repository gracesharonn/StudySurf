import json
import os
from dotenv import load_dotenv
from openai import OpenAI

client = OpenAI(api_key="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")
from fastapi import FastAPI
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI()

load_dotenv()


# Model to handle input from the user
class QuizRequest(BaseModel):
    text_content: str
    quiz_level: str

def fetch_questions(text_content, quiz_level):
    RESPONSE_JSON = {
        "mcqs": [
            {
                "mcq": "multiple choice question1",
                "options": {
                    "a": "choice here1",
                    "b": "choice here2",
                    "c": "choice here3",
                    "d": "choice here4",
                },
                "correct": "correct choice option",
            },
            {
                "mcq": "multiple choice question1",
                "options": {
                    "a": "choice here",
                    "b": "choice here",
                    "c": "choice here",
                    "d": "choice here",
                },
                "correct": "correct choice option",
            },
            {
                "mcq": "multiple choice question1",
                "options": {
                    "a": "choice here",
                    "b": "choice here",
                    "c": "choice here",
                    "d": "choice here",
                },
                "correct": "correct choice option",
            },
            {
                "mcq": "multiple choice question1",
                "options": {
                    "a": "choice here",
                    "b": "choice here",
                    "c": "choice here",
                    "d": "choice here",
                },
                "correct": "correct choice option",
            }
        ]
    }

    PROMPT_TEMPLATE = """
    Text: {text_content}
    You are an expert in generating MCQ type quiz on the basis of provided content.
    Given the above text, create a quiz of 5 multiple choice questions keeping difficulty level as {quiz_level}.
    Make sure the questions are not repeated and check all the questions to be conforming the text as well.
    Make sure to format your response like RESPONSE_JSON below and use it as a guide.
    Ensure to make an array of 3 MCQs referring the following response JSON.
    Here is the RESPONSE_JSON:

    {RESPONSE_JSON}
    """

    formatted_template = PROMPT_TEMPLATE.format(text_content=text_content, quiz_level=quiz_level, RESPONSE_JSON=json.dumps(RESPONSE_JSON))

    # Make API request
    response = client.chat.completions.create(model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": formatted_template}
    ],
    temperature=0.3,
    max_tokens=1000,
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0)

    # Extract response JSON
    extracted_response = response.choices[0].message.content

    print(extracted_response)

    # Parse the response and return the questions
    try:
        return json.loads(extracted_response).get("mcqs", [])
    except json.JSONDecodeError:
        print("Failed to decode response as JSON")
        return []

@app.post("/generate_quiz/")
async def generate_quiz(quiz_request: QuizRequest):
    # Call fetch_questions to get the quiz questions based on the input
    questions = fetch_questions(quiz_request.text_content, quiz_request.quiz_level)

    # Format the questions for the response
    formatted_questions = []
    for question in questions:
        formatted_questions.append({
            "question": question["mcq"],
            "options": question["options"],
            "correct": question["correct"]
        })

    return {"quiz": formatted_questions}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8900)