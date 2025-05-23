
## Walkthrough Link - https://youtu.be/WwbUOHW1B6c

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
   OPENAI_API_KEY="your_openai_api_key_here"
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

2. Start the development server:
   ```
   npm start
   ```

##  Backend Implementation

1. My primary contribution lies in building a reliable and intelligent recommendation pipeline within LLMService. 
2. I developed a strict matches_preferences filtering function to ensure that only products matching the user's selected price range, categories, and brands are passed to the LLM. This dramatically reduces noise and guides the model toward high-quality suggestions.
3. The prompt I designed reflects both explicit user preferences and implicit interests derived from browsing history. It includes detailed instructions to avoid hallucinations, limit results to the provided product catalog, and return structured JSON objects. 
4. To validate the model's response, I enhanced _parse_recommendation_response with comprehensive checks, ensuring each recommendation contains a valid product_id, product_name, explanation, and score, while discarding duplicates or mismatches.
5. I added Robust error handling throughout the backend to capture and surface OpenAI API issues, malformed JSON, or invalid entries without crashing the pipeline, improving overall reliability and debuggability.


## Frontend Architecture 

On the frontend, I transformed the boilerplate into a polished, modular interface with the following key improvements:

1. Authentication System: Built secure login and registration flows with persistent sessions using localStorage. The login state is preserved across page refreshes, and the UI conditionally renders the dashboard or authentication modals based on user status.

2. Dynamic Auth Toggle: Implemented a seamless switch between login and registration in a unified modal, enhancing the user onboarding experience.

3. Interactive Catalog:
   1. Dynamic search, sorting, and brand filtering.
   2. Viewed products are visually highlighted using the /add-viewed API route.

4. Enhanced Browsing History:
   1. Implemented Tooltip-based hover previews to give context-rich browsing without clutter.
   2. Option to clear history.

5. Recommendations UI: Made sure the product cards with explanations generated by the LLM are Clearly structured.

6. Improved Styling & UX: Styled the entire app with CSS-in-JS principles. I made the Components responsive, with soft color palettes, hover effects, and subtle transitions for better usability.

## Challenges I Faced

1. LLM Hallucinations and Product Validation:

   1. One of the biggest challenges was controlling the behavior of gpt4, which often hallucinated product recommendations.
   2. To resolve this, I implemented a strict matches_preferences() filter that pruned the catalog based on the user’s selected categories, brands, and price range.
   3. I also engineered a very explicit prompt instructing the LLM to only recommend items from the provided catalog. On top of that, I enforced a second layer of validation in the _parse_recommendation_response() method to match both product_id and product_name exactly against entries from products.json. This greatly improved result consistency.

2. Malformed JSON Output from LLM

   1. At times, the LLM returned JSON arrays with syntax issues, missing commas, trailing characters, or incorrectly quoted values.
   2. I addressed this by using regex (re.search(r'\[\s*{.*?}\s*]', ..., re.DOTALL)) to isolate the JSON block from the raw response, then cleaned it using additional regex transformations (removing trailing commas).
   3. I also wrapped the parsing logic in a try/except block to ensure the application wouldn't break and instead return meaningful fallback error messages.

3. Session State Loss on Page Refresh

   1. Initially, the user’s session was lost after a page refresh because userEmail was stored only in React state.
   2. To persist the login session, I stored userEmail in localStorage during login, initialized the app’s state using useState(() => localStorage.getItem("userEmail")), and ensured that logout would clear this value. This preserved the session across refreshes.

4. State Coordination Across Components

   1. Managing shared state between components like Catalog, BrowsingHistory, and Recommendations was tricky.
