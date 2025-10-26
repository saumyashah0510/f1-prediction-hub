from sqlalchemy import Column,Integer,String,Float,Date
from sqlalchemy.orm import relationship
from app.models.database import Base

class Driver(Base):

    