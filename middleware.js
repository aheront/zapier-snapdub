// The key goes on every request as a Bearer token.
const addApiKey = (request, z, bundle) => {
  if (bundle.authData.apiKey) {
    request.headers = request.headers || {};
    request.headers.Authorization = `Bearer ${bundle.authData.apiKey}`;
  }
  return request;
};

// SnapDub answers errors as {"error": "..."} in plain words - show that sentence, not a status code.
// 401 is a bad or revoked key, so Zapier asks the person to reconnect.
const handleErrors = (response, z) => {
  if (response.status >= 400) {
    let message = `SnapDub answered ${response.status}`;
    try {
      message = JSON.parse(response.content).error || message;
    } catch (e) {
      // not JSON - keep the status
    }
    if (response.status === 401) throw new z.errors.RefreshAuthError(message);
    throw new z.errors.Error(message, response.status === 402 ? 'PaymentRequired' : 'ApiError', response.status);
  }
  return response;
};

module.exports = { befores: [addApiKey], afters: [handleErrors] };
