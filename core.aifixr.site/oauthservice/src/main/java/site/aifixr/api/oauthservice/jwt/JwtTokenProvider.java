package site.aifixr.api.oauthservice.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenProvider {

	private final JwtProperties jwtProperties;
	private SecretKey secretKey;

	public JwtTokenProvider(JwtProperties jwtProperties) {
		this.jwtProperties = jwtProperties;
		this.secretKey = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
	}

	/**
	 * JWT 토큰 생성
	 */
	public String generateToken(String subject, Map<String, Object> claims) {
		Date now = new Date();
		Date expiryDate = new Date(now.getTime() + jwtProperties.getExpiration());

		// Claims에 subject 포함
		Map<String, Object> finalClaims = claims != null ? new HashMap<>(claims) : new HashMap<>();
		finalClaims.put("sub", subject);

		return Jwts.builder()
				.subject(subject)
				.claims(finalClaims)
				.issuedAt(now)
				.expiration(expiryDate)
				.signWith(secretKey)
				.compact();
	}

	/**
	 * Refresh Token 생성
	 */
	public String generateRefreshToken(String subject) {
		Date now = new Date();
		Date expiryDate = new Date(now.getTime() + jwtProperties.getRefreshExpiration());

		return Jwts.builder()
				.subject(subject)
				.issuedAt(now)
				.expiration(expiryDate)
				.signWith(secretKey)
				.compact();
	}

	/**
	 * JWT 토큰에서 사용자 ID 추출
	 */
	public String getUserIdFromToken(String token) {
		Claims claims = getClaimsFromToken(token);
		return claims.getSubject();
	}

	/**
	 * JWT 토큰에서 Claims 추출
	 */
	public Claims getClaimsFromToken(String token) {
		return Jwts.parser()
				.verifyWith(secretKey)
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}

	/**
	 * JWT 토큰 유효성 검증
	 */
	public boolean validateToken(String token) {
		try {
			Jwts.parser()
					.verifyWith(secretKey)
					.build()
					.parseSignedClaims(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
}

