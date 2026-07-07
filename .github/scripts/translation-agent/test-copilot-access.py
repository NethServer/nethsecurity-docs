#!/usr/bin/env python3
"""
Test script to verify GitHub Copilot API access
"""

import os
import sys
import requests

def test_copilot_access():
    """Test access to GitHub Models API"""
    
    github_token = os.getenv('GITHUB_TOKEN')
    if not github_token:
        print("❌ GITHUB_TOKEN not found")
        return False
    
    headers = {
        "Authorization": f"Bearer {github_token}",
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json"
    }
    
    # Simple test payload
    payload = {
        "messages": [
            {
                "role": "user", 
                "content": "Hello, can you help me translate a simple phrase from English to Italian: 'Hello World'"
            }
        ],
        "model": "openai/gpt-4o",
        "temperature": 0
    }
    
    try:
        response = requests.post(
            "https://models.github.ai/inference/chat/completions",
            headers=headers,
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            translation = result["choices"][0]["message"]["content"].strip()
            print("✅ GitHub Models API access successful!")
            print(f"📝 Test translation: {translation}")
            return True
        else:
            print(f"❌ GitHub Models API error: {response.status_code}")
            print(f"📄 Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing GitHub Models API: {e}")
        return False

if __name__ == "__main__":
    success = test_copilot_access()
    sys.exit(0 if success else 1)