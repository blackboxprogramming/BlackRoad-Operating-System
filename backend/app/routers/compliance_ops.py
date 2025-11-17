"""Compliance and operations visibility routes"""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.auth import get_current_active_user
from app.database import get_db
from app.models.compliance_event import ComplianceEvent
from app.models.user import User

router = APIRouter(prefix="/api/compliance", tags=["Compliance"])


class ComplianceEventResponse(BaseModel):
    id: int
    actor: str
    action: str
    resource: str
    severity: str
    metadata: dict | None = None
    timestamp: str | None = None

    class Config:
        from_attributes = True


@router.get("/events", response_model=List[ComplianceEventResponse])
async def list_events(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(select(ComplianceEvent).order_by(ComplianceEvent.timestamp.desc()))
    return result.scalars().all()
