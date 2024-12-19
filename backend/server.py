from flask import Flask, request, jsonify
from PIL import Image
from transformers import pipeline
from flask_cors import CORS
import torch
import io
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json
import PyPDF2

# Load environment variables from .env
load_dotenv()

# Initialize the Flask app
app = Flask(__name__)

# Enable CORS
CORS(app)

# Check if GPU is available, use device 0 (GPU) if available, else use CPU
device = 0 if torch.cuda.is_available() else -1

# Initialize the pipeline for image captioning
pipe = pipeline("image-to-text", model="Salesforce/blip-image-captioning-large", device=device)

# Configure Google Gemini API
genai.configure(api_key=os.getenv('API_KEY'))

# Define an upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Define the /caption route to handle image input and return the caption
@app.route("/caption", methods=["POST"])
def caption_image():
    
    # Check if an image file was uploaded
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    # Get the file from the request
    file = request.files['file']
    
    # Read the image and process it with PIL
    try:
        image = Image.open(io.BytesIO(file.read()))
    except Exception as e:
        return jsonify({"error": f"Invalid image file: {str(e)}"}), 400
    
    # Generate the caption using the pipeline, set max_new_tokens for caption length control
    caption = pipe(image, max_new_tokens=100)
        
    # Return the generated caption
    return jsonify({"caption": caption[0]['generated_text']}), 200


# Define the /summarize_image route for summarizing image content using Gemini
@app.route("/summarize_image", methods=["POST"])
def summarize_image():
    
    # Check if an image file was uploaded
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    # Get the file from the request
    file = request.files['file']
    
    # Save the image file temporarily in the uploads folder
    temp_file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    try:
        file.save(temp_file_path)
    except Exception as e:
        return jsonify({"error": f"Failed to save image file: {str(e)}"}), 500
    
    # Upload the image file to Gemini
    try:
        uploaded_file = genai.upload_file(temp_file_path)
    except Exception as e:
        return jsonify({"error": f"Failed to upload image to Gemini: {str(e)}"}), 500
    
    # Generate content using the Gemini model
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        result = model.generate_content(
            [uploaded_file, "\n\n", "Can you summarize the given text in this photo? If you can't find any text, print There is no text in the image and describe the image."]
        )
    except Exception as e:
        return jsonify({"error": f"Failed to generate summary with Gemini: {str(e)}"}), 500
    
    # Remove the temporary image file
    os.remove(temp_file_path)
    
    # Return the summarized content
    return jsonify({"summary": result.text}), 200


# Route to generate questions based on a topic
@app.route('/generate_question', methods=['POST'])
def generate_question():
    data = request.json
    topic = data.get('topic')
    no_of_questions = data.get('no_of_questions')
    difficulty = data.get('difficulty')

    # Validate input data
    if not topic or not no_of_questions or not difficulty:
        return jsonify({"error": "Missing parameters"}), 400

    model = genai.GenerativeModel("gemini-1.5-flash")

    questions = model.generate_content(f"Generate {no_of_questions} MCQ questions on {topic} with difficulty {difficulty}. Give me json output.  In the following format: \n\n[{{\n    \"qno\": 1,\n    \"question\": \"What is the capital of India?\",\n    \"options\": [\"Mumbai\", \"Delhi\", \"Kolkata\", \"Chennai\"],\n    \"answer\": \"Delhi\"\n}},\n{{\n    \"qno\": 2,\n    \"question\": \"What is the capital of USA?\",\n    \"options\": [\"Washington DC\", \"New York\", \"Los Angeles\", \"Chicago\"],\n    \"answer\": \"Washington DC\"\n}}]")

    str = questions.text
    str = str.replace('```json', '')
    str = str.replace('```', '')
    str = str.strip()
    questions = json.loads(str)

    return jsonify(questions)


# Route to generate questions from a PDF file
@app.route('/generate_question_by_file', methods=['POST'])
def generate_question_by_file():
    # Check if a file is provided and it's a PDF
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']

    if file.filename.split('.')[-1].lower() != 'pdf':
        return jsonify({'error': 'File is not a PDF'}), 400

    topic = request.form.get('topic')
    no_of_questions = request.form.get('no_of_questions')
    difficulty = request.form.get('difficulty')
    
    # Validate inputs
    if not topic or not no_of_questions or not difficulty:
        return jsonify({'error': 'Missing required parameters'}), 400
    
    try:
        no_of_questions = int(no_of_questions)
    except ValueError:
        return jsonify({'error': 'Invalid number of questions'}), 400

    # Save the uploaded file temporarily
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    try:
        file.save(file_path)
    except Exception as e:
        return jsonify({'error': f'Failed to save file: {str(e)}'}), 500

    # Extract text from the PDF file
    try:
        pdf_reader = PyPDF2.PdfReader(file_path)
        pdf_text = ""
        for page in range(len(pdf_reader.pages)):
            pdf_text += pdf_reader.pages[page].extract_text()
    except Exception as e:
        return jsonify({'error': f'Failed to process PDF: {str(e)}'}), 500
    finally:
        os.remove(file_path)  # Clean up the saved file

    if not pdf_text.strip():
        return jsonify({'error': 'Failed to extract text from the PDF'}), 400

    # Configure the Gemini API
    model = genai.GenerativeModel("gemini-1.5-flash")

    # Prompt construction based on the topic and content of the PDF
    prompt = (f"Based on the content of this PDF file and the topic '{topic}', generate {no_of_questions} "
              f"multiple-choice questions of {difficulty} difficulty. Provide a JSON output for the questions. "
              f"Here is the content of the file: {pdf_text[:2000]}...")

    # Generate questions using the AI model
    try:
        questions_response = model.generate_content(prompt)
        questions_str = questions_response.text.replace('```json', '').replace('```', '').strip()
        questions = json.loads(questions_str)
    except json.JSONDecodeError:
        return jsonify({'error': 'Failed to decode questions'}), 500
    except Exception as e:
        print(e)
        return jsonify({'error': f'Failed to generate questions: {str(e)}'}), 500
    print(questions)
    return jsonify(questions)


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
