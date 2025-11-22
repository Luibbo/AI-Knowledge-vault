# AI Knowledge Vault

**A RAG-powered web service for intelligent document interaction.**

AI Knowledge Vault is a streamlined web application that allows users to create isolated chat sessions, upload documents, and interact with them using Large Language Models (LLM). By leveraging **Retrieval-Augmented Generation (RAG)**, the system indexes your documents into a vector database, enabling the AI to provide accurate, context-aware answers based specifically on the material you provide.

-----

## Key Features

### User Management

  * **Secure Authentication:** Full registration and login flow.
  * **Session Management:** Implementation of JWT (JSON Web Tokens) with Access and Refresh token rotation.

### Chat System

  * **Isolated Contexts:** Create distinct chat rooms. Each chat has its own independent knowledge base; documents uploaded to "Chat A" do not affect answers in "Chat B".
  * **History Tracking:** Persistent storage of chat history and logs.

### RAG & Document Processing

  * **Document Management:** Upload and delete **text/PDF/docx** files within specific chats.
  * **Vectorization:** Automatic embedding of documents using **Pinecone**.
  * **Intelligent Retrieval:** The system searches for relevant text chunks before sending a prompt to the LLM.
  * **AI Integration:** Powered by **LangChain** and **OpenAI** to synthesize answers from your data.

-----

## Tech Stack

**Backend:**

  *  **FastAPI** (High-performance web framework)
  *  **PostgreSQL** (Primary database)
  *  **SQLAlchemy** (ORM)

**AI & ML:**

  *  **LangChain** (Orchestration framework)
  *  **OpenAI API** (LLM provider)
  *  **Pinecone** (Vector Database for embeddings)

**Security:**

  *  **JWT** (Auth) & **Passlib** (Hashing)

**Frontend**

 *  **JavaScript**
 *  **React**

-----

##  UI & Frontend Overview

Here is a look at the application flow:

### 1\. Authentication

Secure entry point for users to sign up or log in.

<img width="1897" height="906" alt="image" src="https://github.com/user-attachments/assets/27f2ec61-f113-44d2-8c9e-e0b01f3ac6d8" />


### 2\. Dashboard & Chat Management

The main hub where users can view their chat lists and create new context-specific sessions.

<img width="1919" height="906" alt="image" src="https://github.com/user-attachments/assets/5259d481-0a8a-433e-966e-d7e74e5b929f" />


### 3\. Intelligent Chat Interface

The core workspace. The sidebar displays uploaded documents (context), while the main window handles the Q\&A with the LLM.

<img width="1919" height="898" alt="image" src="https://github.com/user-attachments/assets/a8988ecd-037f-4c9f-af75-e52cb54fb724" />


-----

##  Architecture

The project follows a modular structure to ensure scalability and maintainability:

```text
app/
├── api/          # API Endpoints (Routes/Controllers)
├── core/         # Config, Security settings, and Constants
├── db/           # Database Models, Session management, Repositories
├── services/     # Business Logic (LLM interaction, Vectorization, RAG)
├── utils/        # Helper functions and utilities
└── main.py       # FastAPI entry point
```

-----

##  Installation & Setup

### Prerequisites

  * Python 3.10+
  * Node.js (for frontend)
  * PostgreSQL instance
  * API Keys: OpenAI API, Pinecone API

### 1\. Clone the Repository

```bash
git clone https://github.com/your-username/ai-knowledge-vault.git
cd ai-knowledge-vault
```

### 2\. Environment Configuration

Create a `.env` file in the root directory and add your credentials:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SECRET_KEY=your_super_secret_jwt_key
ALGORITHM=HS256

OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
```

### 3\. Run the Backend

Install dependencies and start the FastAPI server:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

*The API will be available at `http://localhost:8000`*

### 4\. Run the Frontend

Navigate to the frontend directory (if applicable), install dependencies, and start the client:

```bash
cd frontend
npm install
npm start
```

-----

##  API Documentation

Once the backend is running, you can access the interactive Swagger documentation at:

 **`http://localhost:8000/docs`**

Available endpoints include:

  * `/login` - login
  * `/user` - register
  * `/user/{id}` - get user
  * `/chat` - all user's chats
  * `/chat` - create
  * `/chat/{chat_id}` - get chat
  * `/chat/{chat_id}` - delete chat
  * `/chat/{chat_id}/messages` - create
  * `/chat/{chat_id}/messages` - all messages
  * `/chat/{chat_id}/messages/{message_id}` - delete message
  * `/chat/{chat_id}/document` - list documents
  * `/chat/{chat_id}/document` - upload document
  * `/chat/{chat_id}/document{document_id}` - get document
  * `/chat/{chat_id}/document/{document_id}` - delete document

-----

##  Roadmap & TODO

  * [ ] **Role-Based Access Control:** Add admin/user roles.
  * [ ] **Response Caching:** Implement Redis to cache common queries and reduce API costs.
  * [ ] **Search History:** View past RAG retrieval steps/sources.
  * [ ] **Testing:** Add unit and integration tests (Pytest).
  * [ ] **Collaboration:** Allow sharing chats between users.

