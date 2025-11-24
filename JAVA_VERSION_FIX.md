# Java Version Compatibility Fix

## Problem
Maven compiler is failing with Java 25 due to incompatibility issues.

## Quick Fix - Use Java 21 (Recommended)

### Option 1: Install Java 21
1. Download Java 21 from: https://adoptium.net/temurin/releases/?version=21
2. Install it
3. Set JAVA_HOME environment variable:
   ```
   JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.x.x
   ```
4. Restart your terminal
5. Verify: `java -version` (should show 21.x.x)

### Option 2: Use Maven with Specific Java Version
If you have multiple Java versions installed:

```bash
set JAVA_HOME=C:\Program Files\Java\jdk-21
mvn spring-boot:run
```

### Option 3: Downgrade Java Version in pom.xml
The pom.xml is already set to Java 21. If you want to use Java 17:

```xml
<properties>
    <java.version>17</java.version>
</properties>
```

## Current Status
- Your system has Java 25 installed
- Maven compiler plugin doesn't fully support Java 25 yet
- Recommended: Use Java 21 LTS (Long Term Support)

## After Installing Java 21

1. **Verify Java version**:
   ```bash
   java -version
   ```

2. **Clean and rebuild**:
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

3. **Application should start successfully**

## Alternative: Run Without Maven
If Maven continues to have issues, you can run the JAR directly:

1. Build once (if it works):
   ```bash
   mvn clean package -DskipTests
   ```

2. Run the JAR:
   ```bash
   java -jar target/delivery-0.0.1-SNAPSHOT.jar
   ```

## Temporary Workaround
For now, to test the application:

1. Use the H2 in-memory database (already configured)
2. The application will work without PostgreSQL for testing
3. All features will work except data persistence between restarts

## Contact
If issues persist, the application code is correct. The issue is purely environmental (Java/Maven setup).
