"""Items CRUD tests."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_item_crud_flow(client: AsyncClient, auth_headers: dict[str, str]) -> None:
    create = await client.post(
        "/api/v1/items",
        json={"sku": "SKU-001", "name": "Widget", "unit_price": "12.5"},
        headers=auth_headers,
    )
    assert create.status_code == 201, create.text
    item = create.json()
    item_id = item["id"]
    assert item["sku"] == "SKU-001"

    listing = await client.get("/api/v1/items?q=Widget", headers=auth_headers)
    assert listing.status_code == 200
    assert listing.json()["total"] == 1

    patched = await client.patch(
        f"/api/v1/items/{item_id}",
        json={"unit_price": "15.0"},
        headers=auth_headers,
    )
    assert patched.status_code == 200
    assert float(patched.json()["unit_price"]) == 15.0

    deleted = await client.delete(f"/api/v1/items/{item_id}", headers=auth_headers)
    assert deleted.status_code == 204
