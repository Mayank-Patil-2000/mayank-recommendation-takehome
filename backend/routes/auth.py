from fastapi import APIRouter, HTTPException
from database.mongo import users_collection
from pydantic import BaseModel

router = APIRouter()

class AuthData(BaseModel):
    email: str
    password: str

@router.post("/api/register")
def register(data: AuthData):  # remove 'async'
    existing_user = users_collection.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    users_collection.insert_one({
        "email": data.email,
        "password": data.password,
        "browsing_history": []
    })
    return {"msg": "Registered successfully"}

@router.post("/api/login")
def login(data: AuthData):
    print(f"Trying login with {data.email=} {data.password=}")
    user = users_collection.find_one({"email": data.email})
    print("DB returned:", user)

    if not user or user["password"] != data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"msg": "Login successful"}
