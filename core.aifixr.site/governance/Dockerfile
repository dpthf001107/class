# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
RUN apk add --no-cache bash
COPY api.aifixr.site/gradlew .
COPY api.aifixr.site/gradle gradle
COPY core.aifixr.site/build.gradle core.aifixr.site/settings.gradle ./
COPY core.aifixr.site/governance governance
RUN chmod +x ./gradlew
# Retry Gradle build up to 3 times in case of network issues
RUN for i in 1 2 3; do ./gradlew :governance:bootJar --no-daemon && break || sleep 5; done

# Runtime stage
FROM eclipse-temurin:21-jdk-alpine
VOLUME /tmp
RUN apk update && apk add --no-cache curl
COPY --from=build /app/governance/build/libs/governance-*.jar governance-service.jar
ENTRYPOINT ["java", "-jar", "/governance-service.jar"]

