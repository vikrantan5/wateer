# # from sqlmodel import SQLModel, Field
# # from typing import Optional

# # class User(SQLModel, table=True):
# #     id: Optional[int] = Field(default=None, primary_key=True)
# #     name: str
# #     email: str
# #     password: str








# from sqlmodel import SQLModel, Field
# from typing import Optional
# from pydantic import BaseModel

# class User(SQLModel, table=True):
#     id: Optional[int] = Field(default=None, primary_key=True)
#     name: str
#     email: str
#     password: str

# class LoginRequest(BaseModel):
#     email: str
#     password: str















from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    password: str

class Report(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    status: str = "pending"



class Alert(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    station_id: str
    parameter: str
    value: float
    threshold: str
    status: str = "ACTIVE"
    created_at: datetime = Field(default_factory=datetime.utcnow)
