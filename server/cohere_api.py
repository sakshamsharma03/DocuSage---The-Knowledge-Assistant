import cohere
import os

api_key = os.getenv('COHERE_API_KEY')
co = cohere.Client(api_key)

def read_file(filename):
    try:
        with open(filename, 'r') as file:
            content = file.read()
        return content
    except FileNotFoundError:
        print(f"{filename} not found in the current directory.")
        return None

# filename1 = 'pr_summary.txt'
filename1 = 'dts.txt'
file_content1 = read_file(filename1)

documents = [
    { "title": "PR Data", "text": file_content1}
]

# query = input("Enter your query: ")
chat_history = []
max_turns = 10

for _ in range(max_turns):
    query = input("Enter your query: ")

    response = co.chat(
        model="command-r-plus",
        message=query,
        documents=documents,
        chat_history=chat_history
        # connectors=[{"id":"web-search"}]
    ) 

    # Extracting text and citations from the response
    response_text = response.text
    citations = response.citations
    chat_history = response.chat_history 

    print(response_text)