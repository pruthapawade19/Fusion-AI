import google.generativeai as genai
from dotenv import load_dotenv
import os


load_dotenv()

genai.configure(api_key=os.getenv('API_KEY'))


myfile = genai.upload_file("data/ts.jpeg")
print(f"{myfile=}")

model = genai.GenerativeModel("gemini-1.5-flash")
result = model.generate_content(
    [myfile, "\n\n", "Can you summarize the given text in this photo? if you can't find any text, please ignore this message."],
)
print(f"{result.text=}")