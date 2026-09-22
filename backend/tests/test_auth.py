import pytest

def test_register_and_login(client):
    # Test Registration
    reg_res = client.post("/api/auth/register", json={
        "email": "test.engineer@university.edu",
        "password": "SecurePassword123!",
        "name": "Jordan Smith",
        "target_role": "Software Developer"
    })
    assert reg_res.status_code == 201
    data = reg_res.json()
    assert "access_token" in data
    assert data["email"] == "test.engineer@university.edu"

    # Test Duplicate Registration Protection
    dup_res = client.post("/api/auth/register", json={
        "email": "test.engineer@university.edu",
        "password": "AnotherPassword123!"
    })
    assert dup_res.status_code == 400

    # Test Login
    login_res = client.post("/api/auth/login", json={
        "email": "test.engineer@university.edu",
        "password": "SecurePassword123!"
    })
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data

    # Test Invalid Login
    fail_res = client.post("/api/auth/login", json={
        "email": "test.engineer@university.edu",
        "password": "WrongPassword!"
    })
    assert fail_res.status_code == 401

def test_demo_login(client):
    res = client.post("/api/auth/demo-login")
    assert res.status_code == 200
    data = res.json()
    assert data["is_demo"] is True
    assert "access_token" in data

def test_protected_route_without_token(client):
    res = client.get("/api/dashboard")
    assert res.status_code == 401
