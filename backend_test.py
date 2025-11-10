import requests
import sys
import json
from datetime import datetime

class SoReLAPITester:
    def __init__(self, base_url="https://solana-trust.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_wallet = "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"  # Known working wallet from context

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response preview: {str(response_data)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error text: {response.text[:200]}")
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout after {timeout}s")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_analyze_wallet(self):
        """Test wallet analysis endpoint"""
        success, response = self.run_test(
            "Analyze Wallet",
            "POST",
            "wallets/analyze",
            200,
            data={"wallet_address": self.test_wallet},
            timeout=60  # Longer timeout for blockchain calls
        )
        
        if success and response:
            # Validate response structure
            required_fields = ['wallet_address', 'reputation_score', 'metrics', 'last_analyzed']
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing required field: {field}")
                    return False, {}
            
            # Validate metrics structure
            metrics = response.get('metrics', {})
            metric_fields = ['transaction_count', 'total_volume', 'contract_interactions', 
                           'wallet_age_days', 'activity_frequency', 'unique_programs']
            for field in metric_fields:
                if field not in metrics:
                    print(f"❌ Missing metric field: {field}")
                    return False, {}
            
            print(f"   Wallet: {response['wallet_address']}")
            print(f"   Score: {response['reputation_score']}")
            print(f"   Transactions: {metrics['transaction_count']}")
            
        return success, response

    def test_get_wallet(self):
        """Test get wallet endpoint"""
        return self.run_test(
            "Get Wallet Details",
            "GET",
            f"wallets/{self.test_wallet}",
            200
        )

    def test_leaderboard(self):
        """Test leaderboard endpoint"""
        success, response = self.run_test(
            "Get Leaderboard",
            "GET",
            "wallets/leaderboard/top?limit=10",
            200
        )
        
        if success and response:
            if isinstance(response, list):
                print(f"   Found {len(response)} wallets in leaderboard")
                if len(response) > 0:
                    top_wallet = response[0]
                    print(f"   Top wallet score: {top_wallet.get('reputation_score', 'N/A')}")
            else:
                print(f"❌ Expected list response, got: {type(response)}")
                return False, {}
                
        return success, response

    def test_analytics_stats(self):
        """Test analytics stats endpoint"""
        success, response = self.run_test(
            "Analytics Stats",
            "GET",
            "analytics/stats",
            200
        )
        
        if success and response:
            required_fields = ['total_wallets_analyzed', 'average_reputation', 
                             'total_transactions', 'active_wallets_24h']
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing stats field: {field}")
                    return False, {}
            
            print(f"   Total wallets: {response['total_wallets_analyzed']}")
            print(f"   Avg reputation: {response['average_reputation']}")
            print(f"   Total transactions: {response['total_transactions']}")
            print(f"   Active 24h: {response['active_wallets_24h']}")
                
        return success, response

    def test_analytics_trends(self):
        """Test analytics trends endpoint"""
        success, response = self.run_test(
            "Analytics Trends",
            "GET",
            "analytics/trends?days=7",
            200
        )
        
        if success and response:
            if isinstance(response, list):
                print(f"   Found {len(response)} trend data points")
                if len(response) > 0:
                    sample = response[0]
                    print(f"   Sample trend: {sample}")
            else:
                print(f"❌ Expected list response, got: {type(response)}")
                return False, {}
                
        return success, response

    def test_invalid_wallet(self):
        """Test with invalid wallet address"""
        success, response = self.run_test(
            "Invalid Wallet Address",
            "POST",
            "wallets/analyze",
            500,  # Expecting error for invalid address
            data={"wallet_address": "invalid_address_123"}
        )
        return True, {}  # We expect this to fail, so success is when it properly returns error

    def test_missing_wallet(self):
        """Test get wallet that doesn't exist"""
        success, response = self.run_test(
            "Missing Wallet",
            "GET",
            "wallets/nonexistent_wallet_address_12345",
            404
        )
        return True, {}  # We expect 404, so success is when it properly returns 404

def main():
    print("🚀 Starting SoReL API Testing...")
    print("=" * 60)
    
    tester = SoReLAPITester()
    
    # Test sequence
    tests = [
        tester.test_root_endpoint,
        tester.test_analytics_stats,
        tester.test_analytics_trends,
        tester.test_analyze_wallet,  # This creates data for other tests
        tester.test_get_wallet,
        tester.test_leaderboard,
        tester.test_invalid_wallet,
        tester.test_missing_wallet,
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
            tester.tests_run += 1
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())