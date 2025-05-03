import openai
import json
from config import config
from hashlib import sha256
    

class LLMService:
    """
    Service to handle interactions with the LLM API
    """
    _cache = {}  # Simple in-memory cache

    def __init__(self):
        """
        Initialize the LLM service with configuration
        """
        openai.api_key = config['OPENAI_API_KEY']
        self.model_name = config['MODEL_NAME']
        self.max_tokens = config['MAX_TOKENS']
        self.temperature = config['TEMPERATURE']
    
    @staticmethod
    def matches_preferences(product, preferences):
        category_match = not preferences.get("categories") or \
            product.get("category", "").lower() in [c.lower() for c in preferences["categories"]]

        brand_match = not preferences.get("brands") or \
            product.get("brand", "").lower() in [b.lower() for b in preferences["brands"]]

        price = float(product.get("price", 0))
        price_range = preferences.get("priceRange", "all").lower()

        price_match = True
        if price_range == "0-50":
            price_match = price <= 50
        elif price_range == "50-100":
            price_match = 50 < price <= 100
        elif price_range == "100-200":
            price_match = 100 < price <= 200
        elif price_range == "200+":
            price_match = price > 200

        return category_match and brand_match and price_match


    def generate_recommendations(self, user_preferences, browsing_history, all_products):
        """
        Generate personalized product recommendations based on user preferences and browsing history
        
        Parameters:
        - user_preferences (dict): User's stated preferences
        - browsing_history (list): List of product IDs the user has viewed
        - all_products (list): Full product catalog
        
        Returns:
        - dict: Recommended products with explanations
        """
        # TODO: Implement LLM-based recommendation logic
        # This is where your prompt engineering expertise will be evaluated
        
        """
    Generate personalized product recommendations based on user preferences and browsing history
    """
        #Generate a unique cache key from preferences and browsing history
        cache_key_input = json.dumps({
            "preferences": user_preferences,
            "history": browsing_history
        }, sort_keys=True)
        cache_key = sha256(cache_key_input.encode()).hexdigest()

        # Check if response is already cached
        if cache_key in self._cache:
            print(f"Cache hit for key: {cache_key}")
            return self._cache[cache_key]

        # Get browsed products details
        browsed_products = []
        for product_id in browsing_history:
            for product in all_products:
                if product["id"] == product_id:
                    browsed_products.append(product)
                    break
        
        # Filter products based on strict preference match
        filtered_products = [p for p in all_products if self.matches_preferences(p, user_preferences)]

        print(f"Final catalog sent to LLM: {len(filtered_products)} items")
        print(f"Catalog sent: {filtered_products}")

        # Create a prompt for the LLM
        # IMPLEMENT YOUR PROMPT ENGINEERING HERE
        prompt = self._create_recommendation_prompt(user_preferences, browsed_products, filtered_products)
        
        # Call the LLM API
        try:
            response = openai.ChatCompletion.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": "You are a helpful eCommerce product recommendation assistant."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )
            
            # Parse the LLM response to extract recommendations
            # IMPLEMENT YOUR RESPONSE PARSING LOGIC HERE
            recommendations = self._parse_recommendation_response(response.choices[0].message.content, all_products)
            
            self._cache[cache_key] = recommendations

            return recommendations
            
        except Exception as e:
            # Handle any errors from the LLM API
            print(f"Error calling LLM API: {str(e)}")
            raise Exception(f"Failed to generate recommendations: {str(e)}")
    
    def _create_recommendation_prompt(self, user_preferences, browsed_products, all_products):
        """
        Create a prompt for the LLM to generate recommendations

        This is where you should implement your prompt engineering strategy.

        Parameters:
        - user_preferences (dict): User's stated preferences
        - browsed_products (list): Products the user has viewed
        - all_products (list): Full product catalog

        Returns:
        - str: Prompt for the LLM
        """
        # TODO: Implement your prompt engineering strategy
        # THIS FUNCTION MUST BE IMPLEMENTED BY THE CANDIDATE

        prompt = "You are a smart and helpful expert shopping assistant. Your task is to recommend **5 new products** (not previously viewed) from the provided catalog that align with the user's **explicit preferences** (such as price range, brands, and categories) and **implicit interests** inferred from their browsing history. \n\n   Analyze the patterns in viewed products, such as category, price trends, and style. Then choose 5 products that best match their profile.\n\n"

        prompt+= "You will now be provided with User Prefernces, Browsing History, and Product Catalog. Adhere to the User Preferences strictly and prioritize it the highest. In case any of the fields are not complete, use whatever data is provided to recommend products."
        # Add user preferences to the prompt
        prompt += "User Preferences:\n"
        for key, value in user_preferences.items():
            prompt += f"- {key}: {value}\n"

        # Add browsing history to the prompt
        prompt += "\nBrowsing History:\n"
        for product in browsed_products:
            prompt += f"- {product['name']} (Category: {product['category']}, Price: ${product['price']})\n"

        # Add product catalog to the prompt (can filter or truncate in real use to avoid token overflow)
        prompt += "\nProduct Catalog:\n"
        for product in all_products:
            prompt += f"- ID: {product['id']}, Name: {product['name']}, Category: {product['category']}, Price: ${product['price']}, Description: {product['description']}\n"

        # Add instructions for the response format
        prompt += (
            "\nPlease recommend 5 products and match them to the user's stated preferences "
            "and inferred interests from browsing history. If less than 5 products are provided in the catalog, provide as many recommendations as the number of products in the catalog. For each recommended product, provide:\n"
            "- 'product_id': the product's ID\n"
            "- 'product_name': the name of the product"
            "- 'explanation': 1–2 sentences explaining the recommendation\n"
            "- 'score': a confidence score from 1 to 10 which represents how accurate the recommendation is according to the user's preferences and browsing history.\n"
            "\nIMPORTANT:\n"
            "- The 'product_id' must be from the Product Catalog.\n"
            "- The 'product_name' must match the 'product_id'"
            "- The 'explanation' must describe the actual product listed in the catalog.\n"
            "- Do NOT invent books or content that aren't listed.\n"
            "- If a matching product does not exist in the catalog, do NOT include it in the recommendations.\n"
            "- Each explanation must describe the **same product** whose ID is listed — never copy descriptions from other products or categories.\n"
            "- If the provided catalog contains less than 5 items, just provide those items which are in the product catalog. DO NOT provide any items outside of the product catalog that you are provided with.\n"
        )

        # Add response format instructions
        prompt += "Ensure:\n- Recommendations must be relevant.\n- Each explanation must justify how the product fits the user's needs.\n"
        prompt += "\nFormat your response as a JSON array with up to 5 objects. Include both the product_id and product_name. Example:\n"
        prompt += ("[\n "
            "'product_id': '123'"
            "'product_name': 'Wireless Earbuds Pro'"
            "'explanation': 'This product is from your preferred brand, falls within your price range ($50–100), and is similar to the Bluetooth speaker you viewed.'"
            "'score': 9\n  ...\n]")
        prompt += "\nIMPORTANT: Each explanation must directly describe why the recommended product was selected. Each recommendation must make logical sense. Make sure you verify that each of the recommended products is sensible for the user. Do not copy text from unrelated items or mix up product categories. If the explanation does not match the product ID, that recommendation must be discarded.\n"

        return prompt

    
    def _parse_recommendation_response(self, llm_response, all_products):
        """
        Parse the LLM response to extract product recommendations

        Parameters:
        - llm_response (str): Raw response from the LLM
        - all_products (list): Full product catalog to match IDs with full product info

        Returns:
        - dict: Structured recommendations
        """
        try:
            import json
            import re
            print(llm_response)
            # Try to extract the first JSON array found in the response
            json_match = re.search(r'\[\s*{.*?}\s*]', llm_response, re.DOTALL)
            if not json_match:
                return {
                    "recommendations": [],
                    "error": "No valid JSON array found in LLM response"
                }

            json_str = json_match.group(0)

            # Clean up common issues like trailing commas
            json_str = re.sub(r',\s*}', '}', json_str)
            json_str = re.sub(r',\s*]', ']', json_str)
            json_str = re.sub(r'"score"\s*:\s*"(\d+)"', r'"score": \1', json_str)
            json_str = re.sub(r'"score"\s*:\s*(\d+)"', r'"score": \1', json_str)

            rec_data = json.loads(json_str)
            if not isinstance(rec_data, list):
                return {
                    "recommendations": [],
                    "error": "Parsed JSON is not a list"
                }

            seen_ids = set()
            recommendations = []

            for idx, rec in enumerate(rec_data):
                if not isinstance(rec, dict):
                    continue

                product_id = rec.get('product_id')
                explanation = rec.get('explanation', '').strip()
                score = rec.get('score', 5)

                # Validate fields
                if not product_id or not isinstance(product_id, str):
                    continue
                if not explanation:
                    explanation = "No explanation provided."
                if not isinstance(score, (int, float)) or not (1 <= score <= 10):
                    score = 5

                if product_id in seen_ids:
                    continue
                seen_ids.add(product_id)

                # Match product
                product_name = rec.get('product_name', '').strip()

                product_details = next(
                    (p for p in all_products if p['id'] == product_id and p['name'].strip().lower() == product_name.lower()),
                    None
                )
                if not product_details:
                    continue


                recommendations.append({
                    "product": product_details,
                    "explanation": explanation,
                    "confidence_score": score
                })

            return {
                "recommendations": recommendations,
                "count": len(recommendations)
            }

        except Exception as e:
            print(f"Error parsing LLM response: {str(e)}")
            return {
                "recommendations": [],
                "error": f"Failed to parse recommendations: {str(e)}"
            }
