from fastapi import Request, FastAPI
from .models import generator

app = FastAPI()

@app.get("/")
def main():
    return "POST a message with a JSON document that has a 'question' key."

@app.post("/")
def ask_question(request: Request):
    data = request.json()
    print("Received question!")
    return generator(data["question"])