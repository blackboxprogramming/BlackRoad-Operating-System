"""Blockchain tests"""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_wallet(client: AsyncClient, auth_headers):
    """Test getting user wallet"""
    response = await client.get("/api/blockchain/wallet", headers=auth_headers)
    assert response.status_code == 200

    data = response.json()
    assert "address" in data
    assert "balance" in data
    assert data["balance"] == 100.0  # Starting balance


@pytest.mark.asyncio
async def test_get_balance(client: AsyncClient, auth_headers):
    """Test getting wallet balance"""
    response = await client.get("/api/blockchain/balance", headers=auth_headers)
    assert response.status_code == 200

    data = response.json()
    assert "address" in data
    assert "balance" in data


@pytest.mark.asyncio
async def test_blockchain_stats(client: AsyncClient):
    """Test getting blockchain stats"""
    response = await client.get("/api/blockchain/stats")
    assert response.status_code == 200

    data = response.json()
    assert "latest_block_index" in data
    assert "total_blocks" in data
    assert "difficulty" in data


@pytest.mark.asyncio
async def test_mine_block(client: AsyncClient, auth_headers):
    """Test mining a block"""
    response = await client.post("/api/blockchain/mine", headers=auth_headers)
    assert response.status_code == 200

    data = response.json()
    assert "index" in data
    assert "hash" in data
    assert "reward" in data
    assert data["reward"] == 50.0  # Mining reward
