from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bs4 import BeautifulSoup
import requests
import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for prod
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScrapeInput(BaseModel):
    url: str

class ChatInput(BaseModel):
    question: str

# Global vector store
db = None

@app.post("/scrape")
def scrape_url(data: ScrapeInput):
    global db
    response = requests.get(data.url)
    soup = BeautifulSoup(response.text, "html.parser")
    text = soup.get_text()
    
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_text(text)

    embeddings = OpenAIEmbeddings()
    db = FAISS.from_texts(chunks, embedding=embeddings)
    
    return {"message": "Scraped and vector DB created"}

@app.post("/chat")
def chat(data: ChatInput):
    global db
    if not db:
        return {"answer": "Please upload website URL first."}

    retriever = db.as_retriever()
    qa = RetrievalQA.from_chain_type(llm=ChatOpenAI(), retriever=retriever)
    answer = qa.run(data.question)
    return {"answer": answer}
