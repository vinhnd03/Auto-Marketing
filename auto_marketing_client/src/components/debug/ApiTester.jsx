import React, { useState } from "react";
import { getAllCampaigns } from "../../service/campaign_service";

const ApiTester = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testApi = async () => {
    setTesting(true);
    setResult(null);
    setError(null);

    try {
      console.log("🧪 Testing API connection...");
      const data = await getAllCampaigns();
      setResult(data);
      console.log("✅ API test successful:", data);
    } catch (err) {
      setError(err);
      console.error("❌ API test failed:", err);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md">
      <h3 className="font-bold text-gray-900 mb-2">🔧 API Debug Tool</h3>

      <button
        onClick={testApi}
        disabled={testing}
        className={`w-full px-4 py-2 rounded-lg font-medium ${
          testing
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {testing ? "🔄 Testing..." : "🧪 Test API Connection"}
      </button>

      {result && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-900">✅ Success!</h4>
          <p className="text-green-700 text-sm">
            Loaded {result.length} campaigns
          </p>
          <details className="mt-2">
            <summary className="text-xs text-green-600 cursor-pointer">
              View Data
            </summary>
            <pre className="text-xs bg-green-100 p-2 mt-1 rounded overflow-auto max-h-32">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-900">❌ Error!</h4>
          <p className="text-red-700 text-sm">{error.message}</p>
          <details className="mt-2">
            <summary className="text-xs text-red-600 cursor-pointer">
              View Details
            </summary>
            <pre className="text-xs bg-red-100 p-2 mt-1 rounded overflow-auto max-h-32">
              {JSON.stringify(
                {
                  message: error.message,
                  code: error.code,
                  status: error.response?.status,
                  statusText: error.response?.statusText,
                  data: error.response?.data,
                },
                null,
                2
              )}
            </pre>
          </details>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        API: <code>http://localhost:8080/api/v1/campaigns</code>
      </div>
    </div>
  );
};

export default ApiTester;
