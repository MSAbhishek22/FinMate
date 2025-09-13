from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    firebase_uid = Column(String(128), unique=True, nullable=False)
    email = Column(String(255), nullable=False)
    display_name = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with expenses
    expenses = relationship("Expense", back_populates="user", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            'id': self.id,
            'firebase_uid': self.firebase_uid,
            'email': self.email,
            'display_name': self.display_name,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Expense(Base):
    __tablename__ = 'expenses'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String(100), nullable=False)
    note = Column(Text)
    date = Column(DateTime, nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with user
    user = relationship("User", back_populates="expenses")
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'amount': self.amount,
            'category': self.category,
            'note': self.note,
            'date': self.date.isoformat() if self.date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @classmethod
    def from_dict(cls, data, user_id):
        return cls(
            user_id=user_id,
            amount=float(data.get('amount', 0)),
            category=data.get('category', ''),
            note=data.get('note', ''),
            date=datetime.fromisoformat(data.get('date', datetime.now().isoformat()))
        )

class UserStats(Base):
    __tablename__ = 'user_stats'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    total_expenses = Column(Integer, default=0)
    total_amount = Column(Float, default=0.0)
    streak_days = Column(Integer, default=0)
    last_activity = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'total_expenses': self.total_expenses,
            'total_amount': self.total_amount,
            'streak_days': self.streak_days,
            'last_activity': self.last_activity.isoformat() if self.last_activity else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
