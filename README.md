## Backend
## Setup Instructions

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with your OpenAI API key:
   ```
   OPENAI_API_KEY="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"
   MODEL_NAME=gpt-4
   MAX_TOKENS=1000
   TEMPERATURE=0.7
   DATA_PATH=data/products.json
   MONGO_URI=mongodb+srv://mmpatil:PgKETkzdgBa6jB8N@recommendation-takehome.n6zbeey.mongodb.net/
   DB_NAME=recommendation_db
   ```

5. Run the application:
   ```
   uvicorn app:app --host 0.0.0.0 --port 5000 --reload
   ```

## Frontend
## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

1. Start the development server:
   ```
   npm start
   ```

