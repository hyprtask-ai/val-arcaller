from unittest.mock import AsyncMock

import pytest

from api.routes.main import health


@pytest.mark.asyncio
async def test_health_returns_product_brand(monkeypatch):
    monkeypatch.setattr("api.constants.PRODUCT_NAME", "Acme")
    monkeypatch.setattr("api.constants.PRODUCT_FULL_NAME", "Acme Voice Platform")
    monkeypatch.setattr(
        "api.utils.common.get_backend_endpoints",
        AsyncMock(return_value=("http://localhost:8000", "http://localhost:8000")),
    )

    result = await health()

    assert result.product_name == "Acme"
    assert result.product_full_name == "Acme Voice Platform"
