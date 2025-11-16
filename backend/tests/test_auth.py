"""Authentication tests"""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_user(client: AsyncClient):
    """Test user registration"""
    user_data = {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "password123",
        "full_name": "New User"
    }

    response = await client.post("/api/auth/register", json=user_data)
    assert response.status_code == 201

    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@example.com"
    assert "wallet_address" in data
    assert data["balance"] == 100.0  # Starting bonus


@pytest.mark.asyncio
async def test_register_duplicate_user(client: AsyncClient, test_user):
    """Test registering duplicate user"""
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    }

    response = await client.post("/api/auth/register", json=user_data)
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_login(client: AsyncClient, test_user):
    """Test user login"""
    login_data = {
        "username": "testuser",
        "password": "testpassword123"
    }

    response = await client.post("/api/auth/login", data=login_data)
    assert response.status_code == 200

    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_invalid_credentials(client: AsyncClient, test_user):
    """Test login with invalid credentials"""
    login_data = {
        "username": "testuser",
        "password": "wrongpassword"
    }

    response = await client.post("/api/auth/login", data=login_data)
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_current_user(client: AsyncClient, auth_headers):
    """Test getting current user info"""
    response = await client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200

    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"


@pytest.mark.asyncio
async def test_get_current_user_unauthorized(client: AsyncClient):
    """Test getting current user without token"""
    response = await client.get("/api/auth/me")
    assert response.status_code == 401
