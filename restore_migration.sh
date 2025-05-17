# 마이그레이션 레코드 복원 스크립트 생성
echo "" > restore_records.sql

# 현재 시간을 기준으로 timestamp 생성
current_time=$(date +%s000)

# 마이그레이션 파일들을 순서대로 처리
count=0
for file in $(ls -v ./migrations/*.sql); do
  filename=$(basename "$file" .sql)
  timestamp=$((current_time + count*1000))  # 각 레코드마다 1초씩 증가
  echo "INSERT INTO __drizzle_migrations (id, hash, created_at) VALUES ('$filename', 'placeholder', $timestamp);" >> restore_records.sql
  count=$((count + 1))
done

# SQLite에 실행
sqlite3 your-database.db < restore_records.sql
