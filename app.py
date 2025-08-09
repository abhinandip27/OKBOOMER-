import streamlit as st
import google.generativeai as genai
import os

# --- Configuration & Setup ---

# Get API key from Streamlit secrets.
# You must set your API key as a Streamlit secret named 'GOOGLE_API_KEY'.
# Navigate to "Settings > Secrets" in your Streamlit app's menu.
try:
    api_key = st.secrets["GOOGLE_API_KEY"]
    genai.configure(api_key=api_key)
except KeyError:
    st.error("API key not found. Please set 'GOOGLE_API_KEY' in Streamlit secrets.")
    st.stop()

# Initialize the Gemini model.
# Using 'gemini-1.5-flash' for fast and efficient text generation.
try:
    model = genai.GenerativeModel(model_name="gemini-1.5-flash")
except Exception as e:
    st.error(f"Error initializing the model: {e}")
    st.stop()

# --- Streamlit UI ---

st.title("Gen Z Translator ✨")
st.markdown("Enter a normal sentence, and I'll translate it into modern Gen Z slang. ")
st.markdown("Try phrases like, 'That party last night was really fun' or 'I am very excited for the concert.'")

# Input text area for user input
user_input = st.text_area(
    "Your sentence:",
    placeholder="Enter your sentence here...",
    height=100
)

# Button to trigger the translation
if st.button("Translate", use_container_width=True):
    if user_input:
        # Construct the prompt for the LLM
        prompt = (
            "Translate the following text into modern Gen Z internet slang. "
            "Use abbreviations, short forms, and a casual tone. The output should be a single, short sentence. "
            "Do not add any extra explanations or phrases like 'Here is the translated text'. "
            "Only provide the translated sentence.\n\n"
            f"Original text: '{user_input}'\n"
            "Translated text: "
        )

        try:
            # Call the generative model
            response = model.generate_content(prompt)
            translated_text = response.text.strip()
            
            # Display the translated text
            st.markdown("---")
            st.subheader("Translation:")
            st.info(translated_text)
        except Exception as e:
            st.error(f"An error occurred during translation: {e}")
    else:
        st.warning("Please enter some text to translate.")