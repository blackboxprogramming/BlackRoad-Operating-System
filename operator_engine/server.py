"""Operator Engine HTTP Server (Optional)"""
from fastapi import FastAPI, HTTPException
from typing import List, Dict, Any
import uvicorn

from operator_engine.config import settings
from operator_engine.jobs import Job, job_registry
from operator_engine.scheduler import scheduler

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="BlackRoad Operator Engine - Job scheduling and workflow orchestration",
)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": settings.APP_VERSION}


@app.get("/jobs", response_model=List[Dict[str, Any]])
async def list_jobs():
    """List all jobs in the registry"""
    jobs = job_registry.list_jobs()
    return [job.to_dict() for job in jobs]


@app.get("/jobs/{job_id}")
async def get_job(job_id: str):
    """Get a specific job by ID"""
    job = job_registry.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job.to_dict()


@app.post("/jobs/{job_id}/execute")
async def execute_job(job_id: str):
    """Execute a job immediately"""
    job = await scheduler.execute_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job.to_dict()


@app.get("/scheduler/status")
async def get_scheduler_status():
    """Get scheduler status"""
    return scheduler.get_status()


if __name__ == "__main__":
    uvicorn.run(
        "operator_engine.server:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
    )
