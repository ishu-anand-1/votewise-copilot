from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_home():

    response = client.get("/")

    assert response.status_code == 200


def test_fact_check():

    response = client.post(
        "/api/fact-check",
        json={
            "text": "Government giving money for votes"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "result" in data