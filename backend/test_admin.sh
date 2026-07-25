#!/bin/bash

BASE="http://localhost:4000/api/v1"

echo "=== Тестирование админ-панели и удаления аккаунта ==="

# ---------- 1. Проверка наличия админа ----------
# Используем тестового пользователя test@example.com (если он уже админ)
echo -e "\n1. Попытка входа под test@example.com..."
LOGIN_RESP=$(curl -s -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}')

ACCESS_TOKEN=$(echo "$LOGIN_RESP" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
USER_ROLE=$(echo "$LOGIN_RESP" | grep -o '"role":"[^"]*' | cut -d'"' -f4)

if [ "$USER_ROLE" != "admin" ]; then
  echo "Пользователь test@example.com имеет роль '$USER_ROLE', а не 'admin'."
  echo "Пожалуйста, откройте Prisma Studio (npx prisma studio),"
  echo "найдите пользователя test@example.com и измените роль на 'admin'."
  echo "После этого запустите скрипт повторно."
  exit 1
fi
echo "Администратор найден. Токен получен."

# ---------- 2. Список пользователей (админ) ----------
echo -e "\n2. Получение списка пользователей (страница 1, лимит 3)..."
USERS=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" "$BASE/admin/users?page=1&limit=3")
echo "Ответ:"
echo "$USERS" | python3 -m json.tool 2>/dev/null || echo "$USERS"

# ---------- 3. Удаление аккаунта ----------
echo -e "\n3. Тестирование удаления аккаунта..."

# 3.1 Создаём временного пользователя
TEMP_EMAIL="temp_delete_$(date +%s)@test.com"
echo "   Регистрируем временного пользователя $TEMP_EMAIL..."
REG_RESP=$(curl -s -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEMP_EMAIL\",\"password\":\"Del12345\",\"display_name\":\"Temp\"}")

TEMP_ACCESS=$(echo "$REG_RESP" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
if [ -z "$TEMP_ACCESS" ]; then
  echo "   Ошибка регистрации временного пользователя: $REG_RESP"
  exit 1
fi
echo "   Временный пользователь создан."

# 3.2 Удаляем его
echo "   Удаляем аккаунт временного пользователя..."
DEL_RESP=$(curl -s -X DELETE "$BASE/users/me" \
  -H "Authorization: Bearer $TEMP_ACCESS" \
  -H "Content-Type: application/json" \
  -d '{"password":"Del12345"}')
echo "   Ответ на удаление (должен быть пустым 204): '$DEL_RESP'"

# 3.3 Проверяем, что вход невозможен
echo "   Проверяем, что повторный вход невозможен..."
LOGIN_FAIL=$(curl -s -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEMP_EMAIL\",\"password\":\"Del12345\"}")
echo "   Ответ на попытку входа: $LOGIN_FAIL"
if echo "$LOGIN_FAIL" | grep -q '"code":"INVALID_CREDENTIALS"'; then
  echo "   ✓ Удаление подтверждено – вход невозможен."
else
  echo "   ✗ Возможна ошибка: удаление не сработало."
fi

echo -e "\n=== Тестирование завершено ==="