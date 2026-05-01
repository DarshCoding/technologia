"""Projects CRUD tests."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_project_crud_flow(client: AsyncClient, auth_headers: dict[str, str]) -> None:
    create = await client.post(
        "/api/v1/projects",
        json={"code": "PRJ-001", "name": "Pilot", "customer": "Acme"},
        headers=auth_headers,
    )
    assert create.status_code == 201, create.text
    project = create.json()
    project_id = project["id"]

    listing = await client.get("/api/v1/projects", headers=auth_headers)
    assert listing.status_code == 200
    assert listing.json()["total"] == 1

    detail = await client.get(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert detail.status_code == 200
    assert detail.json()["code"] == "PRJ-001"

    patched = await client.patch(
        f"/api/v1/projects/{project_id}",
        json={"status": "active"},
        headers=auth_headers,
    )
    assert patched.status_code == 200
    assert patched.json()["status"] == "active"

    deleted = await client.delete(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert deleted.status_code == 204


@pytest.mark.asyncio
async def test_project_code_must_be_unique(
    client: AsyncClient, auth_headers: dict[str, str]
) -> None:
    payload = {"code": "PRJ-DUP", "name": "Dup"}
    first = await client.post("/api/v1/projects", json=payload, headers=auth_headers)
    assert first.status_code == 201
    second = await client.post("/api/v1/projects", json=payload, headers=auth_headers)
    assert second.status_code == 409
