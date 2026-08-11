from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter


# 1. Embedding model
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# 2. Text splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)


# 3. Create resume vector store
def create_resume_vectorstore(resume_text: str):

    chunks = text_splitter.create_documents([resume_text])

    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name="resume_collection"
    )

    return vectorstore


# 4. Retrieve relevant resume information
def retrieve_resume_context(
    resume_text: str,
    job_description: str,
    k: int = 5
):

    vectorstore = create_resume_vectorstore(resume_text)

    retriever = vectorstore.as_retriever(
        search_kwargs={"k": k}
    )

    documents = retriever.invoke(job_description)

    context = "\n\n".join(
        document.page_content
        for document in documents
    )

    return context