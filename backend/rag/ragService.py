from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma


EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"


embeddings = HuggingFaceEmbeddings(
    model_name=EMBEDDING_MODEL
)


text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)


def create_vector_store(
    resume_text: str,
    job_description: str
):

    resume_chunks = text_splitter.split_text(resume_text)

    job_chunks = text_splitter.split_text(job_description)

    documents = []

    for chunk in resume_chunks:
        documents.append(chunk)

    for chunk in job_chunks:
        documents.append(chunk)

    vector_store = Chroma.from_texts(
        texts=documents,
        embedding=embeddings,
        collection_name="resume_analysis"
    )

    return vector_store