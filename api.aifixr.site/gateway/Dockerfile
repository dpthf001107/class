# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
RUN apk add --no-cache bash
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./
COPY gateway gateway
RUN chmod +x ./gradlew
# Retry Gradle build up to 3 times in case of network issues
RUN for i in 1 2 3; do ./gradlew :gateway:bootJar --no-daemon && break || sleep 5; done

# Runtime stage
FROM eclipse-temurin:21-jdk-alpine
VOLUME /tmp
COPY --from=build /app/gateway/build/libs/gateway-*.jar gateway.jar
ENTRYPOINT ["java", "-jar", "/gateway.jar"]
