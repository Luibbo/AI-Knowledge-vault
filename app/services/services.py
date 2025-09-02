from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from pinecone import Pinecone
import uuid
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain, RetrievalQA, ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_openai import OpenAI
from langchain_pinecone import PineconeVectorStore
from ..core.config import PINECONE_API_KEY, OPENAI_API_KEY

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index("ai-knowledge-vault")
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vector_store = PineconeVectorStore(index=index, embedding=embeddings)

async def embed_and_store(text: str, user_id: int, chat_id: int, doc_id: int, filename: str):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = splitter.split_text(text)
    # print(text)
    metadatas = [
        {
            "user_id": user_id,
            "chat_id": chat_id,
            "doc_id": doc_id,
            "filename": filename,
            "chunk": idx
        }
        for idx, _ in enumerate(chunks)
    ]

    # додаємо тексти з метаданими у векторну БД
    vector_store.add_texts(texts=chunks, metadatas=metadatas)
    # vectors = embeddings.embed_documents(chunks)
    # to_upsert = []
    # for i, vector in enumerate(vectors):
    #     to_upsert.append((
    #         str(uuid.uuid4()),
    #         vector,
    #         {
    #             "chat_id": chat_id,
    #             "doc_id": doc_id,
    #             "filename": filename,
    #             "chunk": chunks[i]
    #         }
    #     ))

    # index.upsert(vectors=to_upsert)


async def query_pinecone(query: str, chat_id: int, top_k: int = 5):
    query_vector = embeddings.embed_query(query)

    results = index.query(
        vector=query_vector,
        top_k=top_k,
        include_metadata=True,
        filter={"chat_id": {"$eq": chat_id}}
    )
    return results


def delete_document_from_vector_db(field: str ,id: int):
    if field == 'doc_id' or field == 'chat_id':
        index.delete(filter={field: {"$eq": id}},
                     namespace="__default__")        



prompt_template = """
You are a helpful assistant that answers user questions based on the provided context.
Use only the information in the context when possible. 
If the answer is not in the context, say you don’t know.

Context from documents:
{context}

User question:
{question}

Final Answer:
"""    
user_memory = {}

RAG_PROMPT = PromptTemplate(
    input_variables=["context", "question"],
    template=prompt_template
)
chain_type_kwargs =  {'prompt': RAG_PROMPT}

llm = OpenAI(api_key=OPENAI_API_KEY)
