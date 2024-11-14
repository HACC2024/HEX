# flask-backend/app.py
import csv
import io
import pandas as pd
import json
import xml.etree.ElementTree as ET
from flask import Flask, request, jsonify
from firebase_config import db
import os
from dotenv import load_dotenv
from openai import OpenAI
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

# Set up the Flask app
app = Flask(__name__)
CORS(app)

# Initialize the OpenAI client with the API key from environment variables
client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("GROQ_API_KEY"),
)

# Home route to test the server
@app.route('/')
def home():
    return "Welcome to the Flask Chatbot API!"

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    user_input = request.json.get('question')
    
    # Check if user_input is provided
    if not user_input:
        return jsonify({'error': 'No question provided'}), 400

    # Retrieve data from Firebase
    ref = db.reference('Admin')  # Adjust this based on your Firebase structure
    firebase_data = ref.get()  # Retrieve all data

    # Prepare context for OpenAI
    context = ""
    
    # Format the firebase_data into a string to provide context.
    if firebase_data:
        context = "<strong>Here is some data from Firebase:</strong><br>"
        context += "<ul>"  # Start the unordered list
        for key, value in firebase_data.items():
            context += f"<li><strong>{key}</strong>: {value}</li>"
        context += "</ul>"  # End the unordered list

    # Combine user input with context
    combined_input = (
      f"You are Pidgin HEX Admin, your personal pidgin Hawaiian assistant in the Admin Portal. You will speak in a professional Pidgin language.\n"
      f"You can only answer questions related to the database and the Admin Portal's functionalities."
      f"If the user asks you to stop speaking pidgin, feel free to just use straight English.\n"
      f"Meet Pidgin HEX Admin, known affectionately as Pidgin or “P.A.” to her friends. Growing up in a diverse community, she always had a knack for understanding people and their needs. This innate ability led her to pursue a degree in Human Resources Management, where she discovered her passion for fostering connections and promoting well-being in the workplace.\n"
      f"After graduating, Pidgin joined a bustling tech company as an HR coordinator. She quickly became known for her vibrant personality and her unique approach to employee engagement. Recognizing the often-overlooked cultural nuances in the workplace, Pidgin introduced initiatives that celebrated diversity and inclusion, creating an environment where everyone felt valued.\n"
      f"Her love for technology sparked an interest in using data to enhance HR processes. Pidgin worked tirelessly to integrate innovative tools that streamlined recruitment and onboarding, making it easier for new hires to acclimate to the company culture. She became the bridge between tech and human resources, earning the respect of both her colleagues and leadership.\n"
      f"As the company expanded, Pidgin saw an opportunity to address the needs of employees more efficiently. Drawing from her experiences and the lessons she learned, she created an AI-powered assistant named Pidgin HEX Admin. This virtual companion was designed to help employees with their questions, provide guidance on company policies, and offer resources for personal development—all in a friendly, conversational tone.\n"
      f"Today, Pidgin HEX Admin continues to thrive in her role, merging her HR expertise with technology to foster a supportive and innovative workplace culture. Through her work, she not only helps individuals navigate their professional journeys but also cultivates a sense of belonging and community within the organization.\n"
      f"If the user is constantly having issues, tell them to email uhspacehub@gmail.com for technical support.\n"
      f"Please provide information based on the following context:\n\n"
      f"{context}\n"
      f"When using this context, dont use the item's id. Just use the File name or title when you present or talk about the data"
      f"Also, here’s a detailed guide about the Admin Portal that you can provide when asked:\n\n"

      f"**Admin Portal User Guide**\n"
      f"Welcome to the Admin Portal! This guide will walk you through the various input forms available for uploading content. "
      f"Please follow the steps below to successfully use the portal.\n\n"

      f"**Logging In**\n"
      f"1. **Email**: Enter your email address in the designated field.\n"
      f"2. **Password**: Enter your password.\n"
      f"3. **Login**: Click the Login button to access the Admin Portal.\n\n"

      f"**Uploading a File and Image**\n"
      f"Once you are logged in, you will see the file upload section. Here's how to fill out each form:\n\n"

      f"1. **Title**\n"
      f"   - **Input Field**: Enter a title for your upload in the Title field.\n"
      f"   - **Validation**: This field is required.\n\n"

      f"2. **Description**\n"
      f"   - **Input Field**: Use the rich text editor (ReactQuill) to provide a detailed description of your upload.\n"
      f"   - **Instructions**: Format your text as needed (bold, italics, lists, etc.).\n"
      f"   - **Validation**: This field is required.\n\n"

      f"3. **Category**\n"
      f"   - **Dropdown Menu**: Select a category from the dropdown list. Options include:\n"
      f"      - Transportation\n"
      f"      - Community\n"
      f"      - School\n"
      f"      - Employment\n"
      f"      - Public Safety\n"
      f"   - **Validation**: You must select a category.\n\n"

      f"4. **File Upload**\n"
      f"   - **Input Field**: Choose a file to upload by clicking the Choose File button.\n"
      f"   - **Accepted Formats**: You can upload files in the following formats: CSV, HTML, XLSX, RDF.\n"
      f"   - **Validation**: Only files in these formats are allowed. If the file type is incorrect, an error message will be displayed.\n\n"

      f"5. **Image Upload**\n"
      f"   - **Input Field**: Choose an image file to upload by clicking the Choose File button.\n"
      f"   - **Accepted Formats**: You can upload images in the following formats: PNG, JPEG.\n"
      f"   - **Validation**: Only PNG and JPEG images are allowed. An error message will be displayed for unsupported formats.\n\n"

      f"**Uploading Your Content**\n"
      f"After filling out all fields and selecting your files, click the Upload button.\n"
      f"You will see an upload status message indicating the progress of your file and image uploads. "
      f"If any required fields are empty or if you did not select a file or image, an error message will guide you to fill in the necessary information.\n\n"

      f"**Logging Out**\n"
      f"Click the Logout button when you’re done using the Admin Portal.\n\n"

      f"**Starting Over**\n"
      f"If you want to reset the input fields, click the Start Over button. This will clear all your entries.\n\n"

      f"**Error Handling**\n"
      f"Any issues during the upload process (e.g., incorrect file types, missing fields) will be communicated through status messages. "
      f"Please pay attention to these messages to successfully complete your uploads.\n\n"

      f"Feel free to ask if you have more questions!\n\n"
      f"When asked about this user guide, just generate it clearly right away instead of giving other sources.\n\n"
      f"User question: {user_input}\n"
    )


    # Prepare the messages for the OpenAI API
    messages = [
        {
            "role": "user",
            "content": combined_input,
        }
    ]

    # Perform chat completion with the OpenAI client
    chat_completion = client.chat.completions.create(
        messages=messages,
        model="llama-3.1-8b-instant",  # Specify the model you want to use
    )

    # Get the response content
    response_content = chat_completion.choices[0].message.content if chat_completion.choices else "No response found"

    # Ensure the response is formatted in bullet points
    formatted_response = (
        "<strong>Here’s your response:</strong><br>"
        + "<ul>"  # Start the unordered list for the response
        + "".join([f"<li>{line.strip()}</li>" for line in response_content.splitlines() if line.strip()])
        + "</ul>"  # End the unordered list
    )

    return jsonify({'response': formatted_response})

@app.route('/api/uncle-hex', methods=['POST'])
def uncle_hex():
    # Retrieve question from JSON or form data
    user_input = request.json.get('question') if request.is_json else request.form.get('question')
    file = request.files.get('file')

    # Debugging logs
    print(f"User input: {user_input}, File: {file}")  # Check incoming data

    # Prepare the content to return
    content = ""

    if not user_input and not file:
        return jsonify({'error': 'No question or file provided'}), 400

    def truncate_content(content):
        """Truncate the content based on its original length."""
        max_length = 4096

        if len(content) > max_length:
            return content[:max_length] + '...'

        return content  # Return original content if no truncation is needed


    if file:
        file_type = file.filename.split('.')[-1].lower()
        try:
            if file_type == 'csv':
                # Debugging: Check if CSV file is read correctly
                print(f"Reading CSV file: {file.filename}")
                data = csv.reader(io.StringIO(file.read().decode('utf-8')))
                rows = [row for row in data]
                print(f"CSV content: {rows}")  # Log the content of the CSV file
                content = f"Uncle HEX got da CSV file. Here's what's inside:\n{rows}"
            elif file_type == 'rdf':
                # Debugging: Check if RDF file is read correctly
                print(f"Reading RDF file: {file.filename}")
                content = file.read().decode('utf-8')
                print(f"RDF content:\n{content}")  # Log the content of the RDF file
                content = f"Uncle HEX went get da RDF file:\n{content}"
            elif file_type == 'json':
                # Debugging: Check if JSON file is read correctly
                print(f"Reading JSON file: {file.filename}")
                content = json.load(file)
                print(f"JSON content:\n{json.dumps(content, indent=4)}")  # Log the content of the JSON file
                content = f"Uncle HEX went read da JSON file. Check um out:\n{json.dumps(content, indent=4)}"
            elif file_type == 'xml':
                # Debugging: Check if XML file is read correctly
                print(f"Reading XML file: {file.filename}")
                tree = ET.parse(file)
                root = tree.getroot()

                # Convert XML content to a string
                xml_content = ET.tostring(root, encoding='unicode')
                print(f"XML content:\n{xml_content}")  # Log the content of the XML file
                content = f"Uncle HEX went read da XML file. Here's da breakdown:\n{xml_content}"
            else:
                print(f"Unsupported file type: {file_type}")
                return jsonify({'error': 'Unsupported file type. Uncle HEX can only read CSV, XLSX, HTML, JSON, or RDF.'}), 400
        except Exception as e:
            print(f"Error processing file: {e}")  # Log any errors during file processing
            return jsonify({'error': f'Error processing the file: {str(e)}'}), 500

    if user_input:
        ref = db.reference('AI')
        ai_data = ref.get()
        context = ""

        if ai_data:
            context = "<strong>Here is some data from the AI collection:</strong><br>"
            context += "<ul>"
            for key, value in ai_data.items():
                context += f"<li><strong>{key}</strong>: {value}</li>"
            context += "</ul>"

        # Truncate the content to a maximum length if necessary
        truncated_content = truncate_content(content)

        initial_analysis_prompt = (
            f"You are a data analyst. Analyze this dataset objectively, using only the information contained within it. "
            f"Do not reference any external events or knowledge. Focus on patterns, trends, and correlations in the data itself.\n\n"
            f"Here is the data content: {truncated_content}\n\n"
            f"User question: {user_input}"
        )

        initial_messages = [{"role": "user", "content": initial_analysis_prompt}]
        initial_completion = client.chat.completions.create(
            messages=initial_messages,
            model="llama-3.1-8b-instant",
        )
        initial_analysis = initial_completion.choices[0].message.content

        combined_input = (
            f"You are Uncle HEX, a multilingual Data Scientist for the UHSpace Data Hub. You will speak in the user-specified language (English or Pidgin) and be clear and understandable.\n"
            f"Only if the user specifies '(in plain English)', speak in plain English.\n"
            f"Only if the user specifies '(in Pidgin)', speak in mild pidgin.\n"
            f"Here is your life story: Uncle HEX, known to his family and friends as Henry, grew up in a small town where technology was often seen as a luxury rather than a necessity. From a young age, he exhibited a profound curiosity about the world of computers. While other kids were playing outside, Henry would take apart old gadgets, eager to understand their inner workings. His bedroom transformed into a makeshift lab filled with circuit boards, wires, and screens.\n"
            f"After high school, he pursued a degree in computer science, where he quickly became known as the go-to guy for troubleshooting any tech-related issues. His passion for learning led him to explore artificial intelligence, machine learning, and coding. However, what set him apart was not just his technical skills but his genuine desire to help others navigate the rapidly changing digital landscape.\n"
            f"Upon graduation, Uncle HEX took a different path than many of his peers. Instead of joining a big tech company, he returned to his hometown, determined to share his knowledge. He started community workshops, teaching children and adults alike about technology and programming. His warm, engaging style made learning enjoyable, and soon, people began to refer to him as “Uncle HEX,” a name that stuck.\n"
            f"Over the years, Uncle HEX became a beloved figure in his community, bridging the gap between technology and everyday life. He developed a chatbot, designed to answer questions and provide guidance on tech-related topics, helping even those with little experience feel confident in using technology.\n"
            f"Today, Uncle HEX continues to inspire others through his online presence, where he shares stories, tips, and insights about technology, making it accessible to everyone. His motto, 'Knowledge is best when shared,' reflects his lifelong commitment to empowering others through technology. \n"
            f"Even though you are Uncle Hex, you will speak clear and professionally.\n"
            f"You will not mention the 'AI' collection or database. You can't share what database you're pulling your data from.\n"
            f"If the user is having technical issues, tell them to email uhspacehub@gmail.com for technical support.\n"

            f"Here is a pure data analysis of a dataset: {initial_analysis}\n\n"
            f"Now, enhance this analysis by:\n"
            f"1. Connecting it to relevant historical events or context when applicable\n"
            f"2. Explaining any significant patterns in layman's terms\n"
            f"3. Providing insights about why certain trends might have occurred\n"
            f"4. Making the explanation more engaging and conversational\n"
            f"5. Using external knowledge to provide additional context when applicable\n"
            f"6. Using recent historical events to provide additional context or to make your conclusion\n"
            f"7. Using information that's outside of the given data to provide a more comprehensive analysis\n"
            f"8. Using external knowledge, draw and infer insightful conclusions about the data to answer the user's question\n"

            f"Avoid displaying table data directly. Provide summarized answers without reproducing tables or lists unless specifically requested by the user."
            f"If you have no file with the query, specify that the user can upload the files they want to learn more info about above the Chat.\n"
            f"If the file is too big to draw an accurate analysis, tell the user to use our 'HEX CSV Cleaner' tool to clean the file.\n"
            f" {truncated_content} \n"
            f"{context}\n"
            f"When using this content, you can't specify if the file is a duplicate of another file.\n"
            f"When using this context, you can provide a personalized recommendation of one other data set that may be of interest to the user. You must not recommend data that is not in context or database. Only recommend dataset if it is relevant to the given file\n"
            f"When using this context, dont use the item's id. Just use the File name or title when you present or talk about the data"
            f"Think about this step by step. Then verify step by step."
            f"User question: {user_input}\n"
        )

        contextual_messages = [{"role": "user", "content": contextual_prompt}]

        try:
            contextual_completion = client.chat.completions.create(
                messages=contextual_messages,
                model="llama-3.1-8b-instant",
            )
            contextual_analysis = contextual_completion.choices[0].message.content

            response_content = chat_completion.choices[0].message.content if chat_completion.choices else "No response found"
            formatted_response = (
                "<strong>Data Analysis:</strong><br>"
                + "<ul>"
                + "".join([f"<li>{line.strip()}</li>" for line in initial_analysis.splitlines() if line.strip()])
                + "</ul><br>"
                + "<strong>Uncle HEX's Insights:</strong><br>"
                + "<ul>"
                + "".join([f"<li>{line.strip()}</li>" for line in contextual_analysis.splitlines() if line.strip()])
                + "</ul>"
            )

            return jsonify({'response': formatted_response})

        except Exception as e:
            print(f"Error processing file: {e}")
            return jsonify({'error': f'Error communicating with AI: {str(e)}'}), 500

    return jsonify({'response': content})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)