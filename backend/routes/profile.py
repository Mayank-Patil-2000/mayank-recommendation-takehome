from fastapi import APIRouter, HTTPException, Query
from database.mongo import users_collection

router = APIRouter()

@router.get("/api/profile/{email}")
def get_profile(email: str):
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "browsing_history": user.get("browsing_history", [])
    }

@router.post("/api/profile/{email}/add-viewed")
def add_browsing(email: str, product_id: str = Query(...)):
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    history = user.get("browsing_history", [])
    if product_id not in history:
        history.append(product_id)
        users_collection.update_one({"email": email}, {"$set": {"browsing_history": history}})
    return {"msg": "Product added to browsing history"}
