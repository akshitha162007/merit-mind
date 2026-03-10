import requests
import json

BASE_URL = "http://localhost:8000"

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
except Exception as e:
    print(f"Error: {e}")

print("\n" + "=" * 50)
print("Test Complete!")
