"""Device management router - Raspberry Pi, Jetson, and other IoT devices."""
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel

from app.database import get_db
from app.models.device import Device, DeviceMetric, DeviceLog
from app.models.user import User
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/devices", tags=["devices"])


# Schemas
class DeviceCreate(BaseModel):
    """Schema for creating a new device."""

    device_id: str
    name: str
    device_type: str
    ip_address: Optional[str] = None
    hostname: Optional[str] = None
    mac_address: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None


class DeviceUpdate(BaseModel):
    """Schema for updating device info."""

    name: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None


class DeviceHeartbeat(BaseModel):
    """Schema for device heartbeat/status update."""

    ip_address: Optional[str] = None
    hostname: Optional[str] = None
    os_version: Optional[str] = None
    kernel_version: Optional[str] = None
    uptime_seconds: Optional[int] = None
    cpu_model: Optional[str] = None
    cpu_cores: Optional[int] = None
    ram_total_mb: Optional[int] = None
    disk_total_gb: Optional[int] = None
    cpu_usage_percent: Optional[float] = None
    ram_usage_percent: Optional[float] = None
    disk_usage_percent: Optional[float] = None
    temperature_celsius: Optional[float] = None
    services: Optional[List[str]] = None
    capabilities: Optional[List[str]] = None


class DeviceResponse(BaseModel):
    """Schema for device response."""

    id: int
    device_id: str
    name: str
    device_type: str
    ip_address: Optional[str]
    hostname: Optional[str]
    is_online: bool
    status: str
    last_seen: Optional[datetime]
    cpu_usage_percent: Optional[float]
    ram_usage_percent: Optional[float]
    disk_usage_percent: Optional[float]
    temperature_celsius: Optional[float]
    uptime_seconds: Optional[int]
    services: List[str]
    capabilities: List[str]
    location: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class DeviceStats(BaseModel):
    """Overall device statistics."""

    total_devices: int
    online_devices: int
    offline_devices: int
    total_cpu_usage: float
    total_ram_usage: float
    average_temperature: float


# Routes

@router.get("/", response_model=List[DeviceResponse])
async def list_devices(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all devices for the current user."""
    result = await db.execute(
        select(Device)
        .filter(Device.owner_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .order_by(Device.created_at.desc())
    )
    devices = result.scalars().all()

    return devices


@router.get("/stats", response_model=DeviceStats)
async def get_device_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get overall device statistics."""
    # Get counts
    total_result = await db.execute(
        select(func.count(Device.id)).filter(Device.owner_id == current_user.id)
    )
    total_devices = total_result.scalar() or 0

    online_result = await db.execute(
        select(func.count(Device.id)).filter(
            Device.owner_id == current_user.id, Device.is_online == True
        )
    )
    online_devices = online_result.scalar() or 0

    # Get average metrics for online devices
    metrics_result = await db.execute(
        select(
            func.avg(Device.cpu_usage_percent),
            func.avg(Device.ram_usage_percent),
            func.avg(Device.temperature_celsius),
        ).filter(Device.owner_id == current_user.id, Device.is_online == True)
    )
    metrics = metrics_result.first()

    return DeviceStats(
        total_devices=total_devices,
        online_devices=online_devices,
        offline_devices=total_devices - online_devices,
        total_cpu_usage=round(metrics[0] or 0.0, 2),
        total_ram_usage=round(metrics[1] or 0.0, 2),
        average_temperature=round(metrics[2] or 0.0, 2),
    )


@router.get("/{device_id}", response_model=DeviceResponse)
async def get_device(
    device_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get device by ID."""
    result = await db.execute(
        select(Device).filter(
            Device.device_id == device_id, Device.owner_id == current_user.id
        )
    )
    device = result.scalar_one_or_none()

    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    return device


@router.post("/", response_model=DeviceResponse, status_code=status.HTTP_201_CREATED)
async def create_device(
    device_data: DeviceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Register a new device."""
    # Check if device already exists
    existing = await db.execute(
        select(Device).filter(Device.device_id == device_data.device_id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=400, detail="Device with this ID already exists"
        )

    device = Device(
        device_id=device_data.device_id,
        name=device_data.name,
        device_type=device_data.device_type,
        ip_address=device_data.ip_address,
        hostname=device_data.hostname,
        mac_address=device_data.mac_address,
        location=device_data.location,
        description=device_data.description,
        owner_id=current_user.id,
        is_online=False,
        status="offline",
        services=[],
        capabilities=[],
    )

    db.add(device)
    await db.commit()
    await db.refresh(device)

    return device


@router.put("/{device_id}", response_model=DeviceResponse)
async def update_device(
    device_id: str,
    device_data: DeviceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update device information."""
    result = await db.execute(
        select(Device).filter(
            Device.device_id == device_id, Device.owner_id == current_user.id
        )
    )
    device = result.scalar_one_or_none()

    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    # Update fields
    if device_data.name is not None:
        device.name = device_data.name
    if device_data.location is not None:
        device.location = device_data.location
    if device_data.description is not None:
        device.description = device_data.description

    device.updated_at = datetime.utcnow()

    await db.commit()
    await db.refresh(device)

    return device


@router.post("/{device_id}/heartbeat", response_model=DeviceResponse)
async def device_heartbeat(
    device_id: str,
    heartbeat_data: DeviceHeartbeat,
    db: AsyncSession = Depends(get_db),
):
    """Receive device heartbeat and update status (public endpoint for devices)."""
    result = await db.execute(
        select(Device).filter(Device.device_id == device_id)
    )
    device = result.scalar_one_or_none()

    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    # Update device status
    device.is_online = True
    device.status = "online"
    device.last_seen = datetime.utcnow()

    # Update system info if provided
    if heartbeat_data.ip_address:
        device.ip_address = heartbeat_data.ip_address
    if heartbeat_data.hostname:
        device.hostname = heartbeat_data.hostname
    if heartbeat_data.os_version:
        device.os_version = heartbeat_data.os_version
    if heartbeat_data.kernel_version:
        device.kernel_version = heartbeat_data.kernel_version
    if heartbeat_data.uptime_seconds is not None:
        device.uptime_seconds = heartbeat_data.uptime_seconds

    # Update hardware info
    if heartbeat_data.cpu_model:
        device.cpu_model = heartbeat_data.cpu_model
    if heartbeat_data.cpu_cores:
        device.cpu_cores = heartbeat_data.cpu_cores
    if heartbeat_data.ram_total_mb:
        device.ram_total_mb = heartbeat_data.ram_total_mb
    if heartbeat_data.disk_total_gb:
        device.disk_total_gb = heartbeat_data.disk_total_gb

    # Update current metrics
    if heartbeat_data.cpu_usage_percent is not None:
        device.cpu_usage_percent = heartbeat_data.cpu_usage_percent
    if heartbeat_data.ram_usage_percent is not None:
        device.ram_usage_percent = heartbeat_data.ram_usage_percent
    if heartbeat_data.disk_usage_percent is not None:
        device.disk_usage_percent = heartbeat_data.disk_usage_percent
    if heartbeat_data.temperature_celsius is not None:
        device.temperature_celsius = heartbeat_data.temperature_celsius

    # Update services and capabilities
    if heartbeat_data.services is not None:
        device.services = heartbeat_data.services
    if heartbeat_data.capabilities is not None:
        device.capabilities = heartbeat_data.capabilities

    # Save metric snapshot
    metric = DeviceMetric(
        device_id=device.id,
        timestamp=datetime.utcnow(),
        cpu_usage=heartbeat_data.cpu_usage_percent,
        ram_usage=heartbeat_data.ram_usage_percent,
        disk_usage=heartbeat_data.disk_usage_percent,
        temperature=heartbeat_data.temperature_celsius,
    )
    db.add(metric)

    await db.commit()
    await db.refresh(device)

    return device


@router.delete("/{device_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_device(
    device_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a device."""
    result = await db.execute(
        select(Device).filter(
            Device.device_id == device_id, Device.owner_id == current_user.id
        )
    )
    device = result.scalar_one_or_none()

    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    await db.delete(device)
    await db.commit()

    return None
