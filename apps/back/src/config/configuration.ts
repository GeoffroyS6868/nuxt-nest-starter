import {
  getCookieDomain,
  getDatabasePassword,
  getFrontUrl,
  getGoogleClientId,
  getGoogleClientSecret,
  getGoogleRedirectUri,
  getJwtToken,
} from "src/common/envirronement/secrets";

export default () => ({
  databasePassword: getDatabasePassword(),
  jwt_token: getJwtToken(),
  google_client_secret: getGoogleClientSecret(),
  google_client_id: getGoogleClientId(),
  google_redirect_uri: getGoogleRedirectUri(),
  front_url: getFrontUrl(),
  cookie_domain: getCookieDomain(),
  production: process.env.NODE_ENV === "production",
});
