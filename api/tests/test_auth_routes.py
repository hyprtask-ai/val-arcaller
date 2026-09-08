from types import SimpleNamespace

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

import api.routes.auth as auth_routes
from api.routes.auth import router
from api.services.auth import depends as auth_depends
from api.services.auth.depends import get_user
from api.utils.auth import hash_password, verify_password


def _make_test_app() -> FastAPI:
    app = FastAPI()
    app.include_router(router)
    return app


def test_stack_mode_hides_email_password_auth_routes(monkeypatch):
    monkeypatch.setattr(auth_depends, "AUTH_PROVIDER", "stack")
    client = TestClient(_make_test_app())

    signup_response = client.post(
        "/auth/signup",
        json={
            "email": "user@example.com",
            "password": "password123",
            "name": "User",
        },
    )
    login_response = client.post(
        "/auth/login",
        json={
            "email": "user@example.com",
            "password": "password123",
        },
    )

    assert signup_response.status_code == 404
    assert signup_response.json() == {"detail": "Not found"}
    assert login_response.status_code == 404
    assert login_response.json() == {"detail": "Not found"}


def test_signup_disabled_returns_403(monkeypatch):
    monkeypatch.setattr(auth_routes, "ENABLE_SIGNUP", False)
    client = TestClient(_make_test_app())

    response = client.post(
        "/auth/signup",
        json={
            "email": "user@example.com",
            "password": "password123",
            "name": "User",
        },
    )

    assert response.status_code == 403
    assert response.json() == {"detail": "Signup is disabled"}


def test_stack_mode_keeps_current_user_route_available(monkeypatch):
    monkeypatch.setattr(auth_depends, "AUTH_PROVIDER", "stack")
    app = _make_test_app()
    app.dependency_overrides[get_user] = lambda: SimpleNamespace(
        id=7,
        email="user@example.com",
        selected_organization_id=42,
        provider_id="stack-user-1",
    )
    client = TestClient(app)

    response = client.get("/auth/me")

    assert response.status_code == 200
    assert response.json() == {
        "id": 7,
        "email": "user@example.com",
        "name": None,
        "organization_id": 42,
        "provider_id": "stack-user-1",
    }


@pytest.mark.asyncio
async def test_change_password_updates_hash(test_client_factory, db_session):
    user = await db_session.create_user_with_email(
        email="user@example.com",
        password_hash=hash_password("old-password"),
    )

    async with test_client_factory(user) as client:
        response = await client.post(
            "/auth/change-password",
            json={
                "current_password": "old-password",
                "new_password": "new-password-1",
            },
        )

    assert response.status_code == 200
    assert response.json() == {"ok": True}

    refreshed = await db_session.get_user_by_id(user.id)
    assert refreshed is not None
    assert verify_password("new-password-1", refreshed.password_hash)
    assert not verify_password("old-password", refreshed.password_hash)


@pytest.mark.asyncio
async def test_change_password_rejects_wrong_current_password(
    test_client_factory, db_session
):
    user = await db_session.create_user_with_email(
        email="user@example.com",
        password_hash=hash_password("old-password"),
    )

    async with test_client_factory(user) as client:
        response = await client.post(
            "/auth/change-password",
            json={
                "current_password": "wrong-password",
                "new_password": "new-password-1",
            },
        )

    assert response.status_code == 401
    assert response.json() == {"detail": "Current password is incorrect"}


def test_stack_mode_hides_change_password_route(monkeypatch):
    monkeypatch.setattr(auth_depends, "AUTH_PROVIDER", "stack")
    client = TestClient(_make_test_app())

    response = client.post(
        "/auth/change-password",
        json={
            "current_password": "old-password",
            "new_password": "new-password-1",
        },
    )

    assert response.status_code == 404
    assert response.json() == {"detail": "Not found"}
