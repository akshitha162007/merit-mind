import requests
import json

BASE_URL = "http://localhost:8080"

print("Testing MeritMind Backend Connection...")
print("=" * 50)

# Test 1: Health Check
print("\n1. Testing Health Endpoint...")
try:
    response = requests.get(f"{BASE_URL}/api/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")

# Test 2: Register User
print("\n2. Testing Register Endpoint...")
try:
    data = {
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "password123",
        "role": "recruiter"
    }
    response = requests.post(f"{BASE_URL}/api/auth/register", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    register_data = response.json()
    # use login to get token
    login_resp = requests.post(f"{BASE_URL}/api/auth/login", json={"email": data["email"], "password": data["password"]})
    token = login_resp.json().get("token")
    print("Logged in, token:", token)
    # create a candidate and job via helper endpoints so we have real IDs
    cand_resp = requests.post(f"{BASE_URL}/api/candidates", json={"name": "Alice", "email": "alice@example.com"}, headers={"Authorization": f"Bearer {token}"})
    cand_id = cand_resp.json().get("id")
    print("Created candidate", cand_resp.status_code, cand_resp.json())
    job_resp = requests.post(f"{BASE_URL}/api/jobdescriptions", json={"title": "Data Analyst"}, headers={"Authorization": f"Bearer {token}"})
    job_id = job_resp.json().get("id")
    print("Created job", job_resp.status_code, job_resp.json())

    # test fairness endpoint with header
    fair_resp = requests.post(f"{BASE_URL}/api/fairness/check", json={"candidate_id": cand_id}, headers={"Authorization": f"Bearer {token}"})
    print("Fairness status", fair_resp.status_code, fair_resp.text)
    # test skill evaluation similarly
    skill_resp = requests.post(f"{BASE_URL}/api/skills/evaluate", json={"candidate_id": cand_id, "job_id": job_id}, headers={"Authorization": f"Bearer {token}"})
    print("Skill status", skill_resp.status_code, skill_resp.text)
except Exception as e:
    print(f"Error: {e}")

print("\n" + "=" * 50)
print("Test Complete!")
