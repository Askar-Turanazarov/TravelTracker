#!/bin/bash

BASE="http://localhost:4000/api/v1"

echo "=== Тестирование посещённых стран и городов ==="

# 1. Логинимся и извлекаем access_token
echo -e "\n1. Логин..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}')

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "Ошибка получения токена. Ответ сервера: $LOGIN_RESPONSE"
  exit 1
fi
echo "Токен получен: ${ACCESS_TOKEN:0:20}..."

# 2. Добавляем страну (Узбекистан)
echo -e "\n2. Добавление страны (UZ)..."
COUNTRY_RESPONSE=$(curl -s -X POST "$BASE/visited-countries" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"country_code":"UZ"}')
echo "Ответ: $COUNTRY_RESPONSE"

COUNTRY_ID=$(echo "$COUNTRY_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
if [ -z "$COUNTRY_ID" ]; then
  echo "Не удалось добавить страну (возможно, уже добавлена). Пробуем получить список..."
  # Если уже добавлена, извлечём id из списка
  LIST=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" "$BASE/visited-countries")
  COUNTRY_ID=$(echo "$LIST" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
fi
echo "ID страны: $COUNTRY_ID"

# 3. Добавляем город (Ташкент, city_id=1)
echo -e "\n3. Добавление города (city_id=1)..."
CITY_RESPONSE=$(curl -s -X POST "$BASE/visited-cities" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"city_id":1, "visit_date":"2025-05-15", "note":"Первая поездка"}')
echo "Ответ: $CITY_RESPONSE"

CITY_ID=$(echo "$CITY_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
if [ -z "$CITY_ID" ]; then
  echo "Не удалось добавить город (возможно, уже добавлен). Пробуем получить список..."
  LIST=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" "$BASE/visited-cities")
  CITY_ID=$(echo "$LIST" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
fi
echo "ID города: $CITY_ID"

# 4. Обновление заметки
if [ -n "$CITY_ID" ]; then
  echo -e "\n4. Обновление заметки города $CITY_ID..."
  UPDATE_RESPONSE=$(curl -s -X PATCH "$BASE/visited-cities/$CITY_ID" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"note":"Обновлённая заметка"}')
  echo "Ответ: $UPDATE_RESPONSE"
fi

# 5. Удаление города
if [ -n "$CITY_ID" ]; then
  echo -e "\n5. Удаление города $CITY_ID..."
  DELETE_CITY_RESPONSE=$(curl -s -X DELETE "$BASE/visited-cities/$CITY_ID" \
    -H "Authorization: Bearer $ACCESS_TOKEN")
  echo "Ответ: $DELETE_CITY_RESPONSE"
fi

# 6. Удаление страны
if [ -n "$COUNTRY_ID" ]; then
  echo -e "\n6. Удаление страны $COUNTRY_ID..."
  DELETE_COUNTRY_RESPONSE=$(curl -s -X DELETE "$BASE/visited-countries/$COUNTRY_ID" \
    -H "Authorization: Bearer $ACCESS_TOKEN")
  echo "Ответ: $DELETE_COUNTRY_RESPONSE"
fi

echo -e "\n=== Тестирование завершено ==="