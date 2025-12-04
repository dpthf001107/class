package site.aifixr.api.oauthservice.google;

import site.aifixr.api.oauthservice.google.dto.GoogleTokenResponse;
import site.aifixr.api.oauthservice.google.dto.GoogleUserInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
public class GoogleAuthService {

	private final RestTemplate restTemplate;

	@Value("${google.client-id}")
	private String clientId;

	@Value("${google.client-secret}")
	private String clientSecret;

	@Value("${google.redirect-uri}")
	private String redirectUri;

	private static final String GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
	private static final String GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
	private static final String GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

	public GoogleAuthService(RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
	}

	/**
	 * 구글 인증 URL 생성
	 */
	public String generateAuthUrl() {
		// State 파라미터 생성 (CSRF 방지)
		String state = UUID.randomUUID().toString();
		try {
			// URL 인코딩 적용
			String encodedRedirectUri = URLEncoder.encode(redirectUri, StandardCharsets.UTF_8.toString());
			String encodedScope = URLEncoder.encode("profile email", StandardCharsets.UTF_8.toString());
			String authUrl = GOOGLE_AUTH_URL +
					"?client_id=" + clientId +
					"&redirect_uri=" + encodedRedirectUri +
					"&response_type=code" +
					"&scope=" + encodedScope +
					"&state=" + state +
					"&access_type=offline" +
					"&prompt=consent";
			return authUrl;
		} catch (Exception e) {
			throw new RuntimeException("구글 인증 URL 생성 실패", e);
		}
	}

	/**
	 * 구글 액세스 토큰 요청
	 */
	public String getAccessToken(String code, String state) {
		System.out.println("   → 구글 토큰 API 호출: " + GOOGLE_TOKEN_URL);
		
		// 요청 헤더 설정
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		// 요청 바디 설정
		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", "authorization_code");
		params.add("client_id", clientId);
		params.add("client_secret", clientSecret);
		params.add("code", code);
		params.add("redirect_uri", redirectUri);

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

		try {
			// 구글 토큰 API 호출
			ResponseEntity<GoogleTokenResponse> response = restTemplate.exchange(
					GOOGLE_TOKEN_URL,
					HttpMethod.POST,
					request,
					GoogleTokenResponse.class
			);

			GoogleTokenResponse tokenResponse = response.getBody();
			if (tokenResponse != null && tokenResponse.getAccessToken() != null) {
				System.out.println("   → 액세스 토큰 획득 성공 (길이: " + tokenResponse.getAccessToken().length() + "자)");
				if (tokenResponse.getRefreshToken() != null) {
					System.out.println("   → 리프레시 토큰도 획득됨");
				}
				return tokenResponse.getAccessToken();
			} else {
				System.out.println("   ❌ 액세스 토큰이 응답에 없습니다.");
				throw new RuntimeException("구글 액세스 토큰 발급 실패");
			}
		} catch (Exception e) {
			System.out.println("   ❌ 구글 액세스 토큰 요청 실패: " + e.getMessage());
			throw new RuntimeException("구글 액세스 토큰 요청 실패", e);
		}
	}

	/**
	 * 구글 사용자 정보 조회
	 */
	public GoogleUserInfo getUserInfo(String accessToken) {
		System.out.println("   → 구글 사용자 정보 API 호출: " + GOOGLE_USER_INFO_URL);
		
		// 요청 헤더 설정
		HttpHeaders headers = new HttpHeaders();
		headers.setBearerAuth(accessToken);

		HttpEntity<String> request = new HttpEntity<>(headers);

		try {
			// 구글 사용자 정보 API 호출
			ResponseEntity<GoogleUserInfo> response = restTemplate.exchange(
					GOOGLE_USER_INFO_URL,
					HttpMethod.GET,
					request,
					GoogleUserInfo.class
			);

			GoogleUserInfo userInfo = response.getBody();
			if (userInfo != null && userInfo.getId() != null) {
				System.out.println("   → 사용자 정보 조회 성공");
				System.out.println("      - ID: " + userInfo.getId());
				System.out.println("      - Email: " + userInfo.getEmail());
				System.out.println("      - Name: " + userInfo.getName());
				if (userInfo.getPicture() != null) {
					System.out.println("      - Picture: " + userInfo.getPicture());
				}
				return userInfo;
			} else {
				System.out.println("   ❌ 사용자 정보가 응답에 없습니다.");
				throw new RuntimeException("구글 사용자 정보 조회 실패");
			}
		} catch (Exception e) {
			System.out.println("   ❌ 구글 사용자 정보 조회 실패: " + e.getMessage());
			throw new RuntimeException("구글 사용자 정보 조회 실패", e);
		}
	}
}

