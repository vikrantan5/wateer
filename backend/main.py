# from fastapi import FastAPI, Depends, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from sqlmodel import Session, select
# from database import create_db_and_tables, get_session
# from models import User, LoginRequest
# from auth import create_access_token, get_current_user
# import hashlib

# app = FastAPI()

# # ---------- CORS ----------
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ---------- STARTUP ----------
# @app.on_event("startup")
# def on_startup():
#     create_db_and_tables()

# # ---------- HOME ----------
# @app.get("/")
# def home():
#     return {"message": "Backend is running successfully"}

# # ---------- SIGNUP ----------
# @app.post("/signup")
# def signup(user: User, session: Session = Depends(get_session)):
#     existing_user = session.exec(
#         select(User).where(User.email == user.email)
#     ).first()

#     if existing_user:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     user.password = hashlib.sha256(user.password.encode()).hexdigest()

#     session.add(user)
#     session.commit()
#     session.refresh(user)

#     return {"message": "User registered successfully"}

# # ---------- LOGIN ----------
# @app.post("/login")
# def login(data: LoginRequest, session: Session = Depends(get_session)):
#     hashed_password = hashlib.sha256(data.password.encode()).hexdigest()

#     user = session.exec(
#         select(User).where(User.email == data.email)
#     ).first()

#     if not user or user.password != hashed_password:
#         raise HTTPException(status_code=401, detail="Invalid credentials")

#     token = create_access_token({"user_id": user.id})

#     return {"accessToken": token}

# # ---------- PROFILE (PROTECTED) ----------
# @app.get("/profile")
# def profile(
#     current_user: dict = Depends(get_current_user),
#     session: Session = Depends(get_session)
# ):
#     user_id = current_user.get("user_id")
#     user = session.get(User, user_id)

#     return {
#         "id": user.id,
#         "name": user.name,
#         "email": user.email
#     }






from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from database import create_db_and_tables, get_session
from models import User, Report
from auth import create_access_token, get_current_user
from pydantic import BaseModel
import hashlib
import requests
import urllib3

# Disable SSL warnings (CPCB SSL issue)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = FastAPI()

# ---------- CORS MIDDLEWARE ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- STARTUP ----------
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# ---------- HOME ----------
@app.get("/")
def home():
    return {"message": "Backend is running successfully"}

# ---------- LOGIN SCHEMA ----------
class LoginRequest(BaseModel):
    email: str
    password: str

# ---------- SIGNUP ----------
@app.post("/signup")
def signup(user: User, session: Session = Depends(get_session)):
    existing_user = session.exec(
        select(User).where(User.email == user.email)
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user.password = hashlib.sha256(user.password.encode()).hexdigest()
    session.add(user)
    session.commit()
    session.refresh(user)

    return {"message": "User registered successfully"}

# ---------- LOGIN ----------
@app.post("/login")
def login(data: LoginRequest, session: Session = Depends(get_session)):
    hashed_password = hashlib.sha256(data.password.encode()).hexdigest()

    user = session.exec(
        select(User).where(User.email == data.email)
    ).first()

    if not user or user.password != hashed_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"user_id": user.id})
    return {"accessToken": token}

# ---------- PROFILE (PROTECTED) ----------
@app.post("/profile")
def profile(
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    user = session.get(User, current_user["user_id"])
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email
    }

# ---------- REPORTS ----------
@app.post("/reports")
def create_report(
    report: Report,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    session.add(report)
    session.commit()
    session.refresh(report)
    return report

@app.get("/reports")
def get_reports(session: Session = Depends(get_session)):
    return session.exec(select(Report)).all()

@app.put("/reports/{report_id}")
def update_report_status(
    report_id: int,
    status: str,
    session: Session = Depends(get_session)
):
    report = session.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = status
    session.add(report)
    session.commit()
    session.refresh(report)
    return report

# ---------- CPCB STATIONS PROXY ----------
@app.get("/stations")
def get_cpcb_stations():
    """
    Backend proxy for CPCB stations API.
    Frontend should call THIS endpoint.
    """
    url = "https://rtwqmsdb1.cpcb.gov.in/data/internet/stations/stations.json"

    try:
        response = requests.get(url, timeout=15, verify=False)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print("Error fetching CPCB data:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch CPCB data")
