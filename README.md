to save all urls and name


$env:PGCLIENTENCODING = "utf-8"
psql -U hansdah -d hub -h localhost -p 5432 -c "\copy (SELECT DISTINCT ON (photo_url) photo_url, photo_name FROM api_photo ORDER BY photo_url, id DESC) TO 'distinct_urls.csv' WITH CSV HEADER"
