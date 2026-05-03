import os
import glob
import re

workspace = r"c:\Users\PARTH\Downloads\FullStack_E-Commerce_Website_using_Java-main\FullStack_E-Commerce_Website_using_Java-main"

# 1. Update Frontend
frontend_dir = os.path.join(workspace, "Frontend")
frontend_files = glob.glob(os.path.join(frontend_dir, "src", "**", "*.jsx"), recursive=True)

for file_path in frontend_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    original = content
    if "axios.jsx" in file_path or "axios.js" in file_path:
        content = content.replace('"http://localhost:8081/api"', 'import.meta.env.VITE_API_URL || "http://localhost:8081/api"')
    else:
        # replace `http://localhost:8081/api with `${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}
        content = content.replace('`http://localhost:8081/api', '`${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}')
        # replace "http://localhost:8081/api..." with `${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}...`
        content = re.sub(r'"http://localhost:8081/api([^"]*)"', r'`${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}\1`', content)
        
    if content != original:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {file_path}")

# 2. Update Backend application.properties
props_file = os.path.join(workspace, "Backend", "src", "main", "resources", "application.properties")
if os.path.exists(props_file):
    with open(props_file, "r", encoding="utf-8") as f:
        props = f.read()
    
    props = props.replace("server.port=8081", "server.port=${PORT:8081}")
    props = props.replace("spring.datasource.url=jdbc:h2:file:./data/ecommerce;AUTO_SERVER=TRUE", "spring.datasource.url=${DB_URL:jdbc:h2:file:./data/ecommerce;AUTO_SERVER=TRUE}")
    props = props.replace("spring.datasource.username=sa", "spring.datasource.username=${DB_USERNAME:sa}")
    props = props.replace("spring.datasource.password=project1", "spring.datasource.password=${DB_PASSWORD:project1}")
    props = props.replace("spring.datasource.driverClassName=org.h2.Driver", "spring.datasource.driverClassName=${DB_DRIVER:org.h2.Driver}")
    props = props.replace("spring.jpa.database-platform=org.hibernate.dialect.H2Dialect", "spring.jpa.database-platform=${DB_DIALECT:org.hibernate.dialect.H2Dialect}")
    
    with open(props_file, "w", encoding="utf-8") as f:
        f.write(props)
    print("Updated application.properties")

# 3. Update Backend CorsConfig
cors_file = os.path.join(workspace, "Backend", "src", "main", "Java", "com", "cart", "ecom_proj", "CorsConfig.java")
# sometimes 'Java' is 'java'
if not os.path.exists(cors_file):
    cors_file = os.path.join(workspace, "Backend", "src", "main", "java", "com", "cart", "ecom_proj", "CorsConfig.java")

if os.path.exists(cors_file):
    with open(cors_file, "r", encoding="utf-8") as f:
        cors = f.read()
    
    # replace hardcoded allowedOrigins with an environment variable configuration
    if "allowedOrigins(" in cors:
        replacement = """allowedOrigins(
                            "http://localhost:5173",
                            "http://localhost:3000",
                            "http://localhost:8080",
                            System.getenv("FRONTEND_URL") != null ? System.getenv("FRONTEND_URL") : "http://localhost:5173"
                        )"""
        cors = re.sub(r'allowedOrigins\([^)]+\)', replacement, cors)
        with open(cors_file, "w", encoding="utf-8") as f:
            f.write(cors)
        print("Updated CorsConfig.java")
