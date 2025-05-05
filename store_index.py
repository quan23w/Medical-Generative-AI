from src.helpers import load_pdf_file, text_splitter, download_huggingface_embedding_model
from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
from langchain_pinecone import PineconeVectorStore
from dotenv import load_dotenv
load_dotenv()
import os

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY

extracted_data = load_pdf_file("Data/")
text_chunks = text_splitter(extracted_data)
embeddings = download_huggingface_embedding_model()

pc =    Pinecone(api_key= PINECONE_API_KEY)
index_name= "medicalbot"
pc.create_index(
    name=index_name,
    dimension=384, # Replace with your model dimensions
    metric="cosine", # Replace with your model metric
    spec=ServerlessSpec(
        cloud="aws",
        region="us-east-1"
    ) 
)


docsearch = PineconeVectorStore.from_documents(documents=text_chunks,
                                               embedding=embeddings,
                                               index_name=index_name)


