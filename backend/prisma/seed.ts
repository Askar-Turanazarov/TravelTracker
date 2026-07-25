import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ------------------ Страны (193) ------------------
const countriesData = [
  { code: 'AF', name_en: 'Afghanistan', name_ru: 'Афганистан', region: 'Asia', centroid_lat: 33.9391, centroid_lng: 67.7099 },
  { code: 'AL', name_en: 'Albania', name_ru: 'Албания', region: 'Europe', centroid_lat: 41.1533, centroid_lng: 20.1683 },
  { code: 'DZ', name_en: 'Algeria', name_ru: 'Алжир', region: 'Africa', centroid_lat: 28.0339, centroid_lng: 1.6596 },
  { code: 'AD', name_en: 'Andorra', name_ru: 'Андорра', region: 'Europe', centroid_lat: 42.5063, centroid_lng: 1.5218 },
  { code: 'AO', name_en: 'Angola', name_ru: 'Ангола', region: 'Africa', centroid_lat: -11.2027, centroid_lng: 17.8739 },
  { code: 'AG', name_en: 'Antigua and Barbuda', name_ru: 'Антигуа и Барбуда', region: 'North America', centroid_lat: 17.0608, centroid_lng: -61.7964 },
  { code: 'AR', name_en: 'Argentina', name_ru: 'Аргентина', region: 'South America', centroid_lat: -38.4161, centroid_lng: -63.6167 },
  { code: 'AM', name_en: 'Armenia', name_ru: 'Армения', region: 'Asia', centroid_lat: 40.0691, centroid_lng: 45.0382 },
  { code: 'AU', name_en: 'Australia', name_ru: 'Австралия', region: 'Oceania', centroid_lat: -25.2744, centroid_lng: 133.7751 },
  { code: 'AT', name_en: 'Austria', name_ru: 'Австрия', region: 'Europe', centroid_lat: 47.5162, centroid_lng: 14.5501 },
  { code: 'AZ', name_en: 'Azerbaijan', name_ru: 'Азербайджан', region: 'Asia', centroid_lat: 40.1431, centroid_lng: 47.5769 },
  { code: 'BS', name_en: 'Bahamas', name_ru: 'Багамы', region: 'North America', centroid_lat: 25.0343, centroid_lng: -77.3963 },
  { code: 'BH', name_en: 'Bahrain', name_ru: 'Бахрейн', region: 'Asia', centroid_lat: 26.0667, centroid_lng: 50.5577 },
  { code: 'BD', name_en: 'Bangladesh', name_ru: 'Бангладеш', region: 'Asia', centroid_lat: 23.685, centroid_lng: 90.3563 },
  { code: 'BB', name_en: 'Barbados', name_ru: 'Барбадос', region: 'North America', centroid_lat: 13.1939, centroid_lng: -59.5432 },
  { code: 'BY', name_en: 'Belarus', name_ru: 'Беларусь', region: 'Europe', centroid_lat: 53.7098, centroid_lng: 27.9534 },
  { code: 'BE', name_en: 'Belgium', name_ru: 'Бельгия', region: 'Europe', centroid_lat: 50.5039, centroid_lng: 4.4699 },
  { code: 'BZ', name_en: 'Belize', name_ru: 'Белиз', region: 'North America', centroid_lat: 17.1899, centroid_lng: -88.4976 },
  { code: 'BJ', name_en: 'Benin', name_ru: 'Бенин', region: 'Africa', centroid_lat: 9.3077, centroid_lng: 2.3158 },
  { code: 'BT', name_en: 'Bhutan', name_ru: 'Бутан', region: 'Asia', centroid_lat: 27.5142, centroid_lng: 90.4336 },
  { code: 'BO', name_en: 'Bolivia', name_ru: 'Боливия', region: 'South America', centroid_lat: -16.2902, centroid_lng: -63.5887 },
  { code: 'BA', name_en: 'Bosnia and Herzegovina', name_ru: 'Босния и Герцеговина', region: 'Europe', centroid_lat: 43.9159, centroid_lng: 17.6791 },
  { code: 'BW', name_en: 'Botswana', name_ru: 'Ботсвана', region: 'Africa', centroid_lat: -22.3285, centroid_lng: 24.6849 },
  { code: 'BR', name_en: 'Brazil', name_ru: 'Бразилия', region: 'South America', centroid_lat: -14.2350, centroid_lng: -51.9253 },
  { code: 'BN', name_en: 'Brunei', name_ru: 'Бруней', region: 'Asia', centroid_lat: 4.5353, centroid_lng: 114.7277 },
  { code: 'BG', name_en: 'Bulgaria', name_ru: 'Болгария', region: 'Europe', centroid_lat: 42.7339, centroid_lng: 25.4858 },
  { code: 'BF', name_en: 'Burkina Faso', name_ru: 'Буркина-Фасо', region: 'Africa', centroid_lat: 12.2383, centroid_lng: -1.5616 },
  { code: 'BI', name_en: 'Burundi', name_ru: 'Бурунди', region: 'Africa', centroid_lat: -3.3731, centroid_lng: 29.9189 },
  { code: 'CV', name_en: 'Cabo Verde', name_ru: 'Кабо-Верде', region: 'Africa', centroid_lat: 16.5388, centroid_lng: -23.0418 },
  { code: 'KH', name_en: 'Cambodia', name_ru: 'Камбоджа', region: 'Asia', centroid_lat: 12.5657, centroid_lng: 104.9910 },
  { code: 'CM', name_en: 'Cameroon', name_ru: 'Камерун', region: 'Africa', centroid_lat: 7.3697, centroid_lng: 12.3547 },
  { code: 'CA', name_en: 'Canada', name_ru: 'Канада', region: 'North America', centroid_lat: 56.1304, centroid_lng: -106.3468 },
  { code: 'CF', name_en: 'Central African Republic', name_ru: 'ЦАР', region: 'Africa', centroid_lat: 6.6111, centroid_lng: 20.9394 },
  { code: 'TD', name_en: 'Chad', name_ru: 'Чад', region: 'Africa', centroid_lat: 15.4542, centroid_lng: 18.7322 },
  { code: 'CL', name_en: 'Chile', name_ru: 'Чили', region: 'South America', centroid_lat: -35.6751, centroid_lng: -71.5430 },
  { code: 'CN', name_en: 'China', name_ru: 'Китай', region: 'Asia', centroid_lat: 35.8617, centroid_lng: 104.1954 },
  { code: 'CO', name_en: 'Colombia', name_ru: 'Колумбия', region: 'South America', centroid_lat: 4.5709, centroid_lng: -74.2973 },
  { code: 'KM', name_en: 'Comoros', name_ru: 'Коморы', region: 'Africa', centroid_lat: -11.6455, centroid_lng: 43.3333 },
  { code: 'CG', name_en: 'Congo', name_ru: 'Конго', region: 'Africa', centroid_lat: -0.2280, centroid_lng: 15.8277 },
  { code: 'CR', name_en: 'Costa Rica', name_ru: 'Коста-Рика', region: 'North America', centroid_lat: 9.7489, centroid_lng: -83.7534 },
  { code: 'CI', name_en: "Cote d'Ivoire", name_ru: 'Кот-д\'Ивуар', region: 'Africa', centroid_lat: 7.5400, centroid_lng: -5.5471 },
  { code: 'HR', name_en: 'Croatia', name_ru: 'Хорватия', region: 'Europe', centroid_lat: 45.1000, centroid_lng: 15.2000 },
  { code: 'CU', name_en: 'Cuba', name_ru: 'Куба', region: 'North America', centroid_lat: 21.5218, centroid_lng: -77.7812 },
  { code: 'CY', name_en: 'Cyprus', name_ru: 'Кипр', region: 'Asia', centroid_lat: 35.1264, centroid_lng: 33.4299 },
  { code: 'CZ', name_en: 'Czech Republic', name_ru: 'Чехия', region: 'Europe', centroid_lat: 49.8175, centroid_lng: 15.4730 },
  { code: 'KP', name_en: 'North Korea', name_ru: 'Северная Корея', region: 'Asia', centroid_lat: 40.3399, centroid_lng: 127.5101 },
  { code: 'CD', name_en: 'Democratic Republic of the Congo', name_ru: 'Демократическая Республика Конго', region: 'Africa', centroid_lat: -4.0383, centroid_lng: 21.7587 },
  { code: 'DK', name_en: 'Denmark', name_ru: 'Дания', region: 'Europe', centroid_lat: 56.2639, centroid_lng: 9.5018 },
  { code: 'DJ', name_en: 'Djibouti', name_ru: 'Джибути', region: 'Africa', centroid_lat: 11.8251, centroid_lng: 42.5903 },
  { code: 'DM', name_en: 'Dominica', name_ru: 'Доминика', region: 'North America', centroid_lat: 15.4140, centroid_lng: -61.3710 },
  { code: 'DO', name_en: 'Dominican Republic', name_ru: 'Доминиканская Республика', region: 'North America', centroid_lat: 18.7357, centroid_lng: -70.1627 },
  { code: 'EC', name_en: 'Ecuador', name_ru: 'Эквадор', region: 'South America', centroid_lat: -1.8312, centroid_lng: -78.1834 },
  { code: 'EG', name_en: 'Egypt', name_ru: 'Египет', region: 'Africa', centroid_lat: 26.8206, centroid_lng: 30.8025 },
  { code: 'SV', name_en: 'El Salvador', name_ru: 'Сальвадор', region: 'North America', centroid_lat: 13.7942, centroid_lng: -88.8965 },
  { code: 'GQ', name_en: 'Equatorial Guinea', name_ru: 'Экваториальная Гвинея', region: 'Africa', centroid_lat: 1.6508, centroid_lng: 10.2679 },
  { code: 'ER', name_en: 'Eritrea', name_ru: 'Эритрея', region: 'Africa', centroid_lat: 15.1794, centroid_lng: 39.7823 },
  { code: 'EE', name_en: 'Estonia', name_ru: 'Эстония', region: 'Europe', centroid_lat: 58.5953, centroid_lng: 25.0136 },
  { code: 'SZ', name_en: 'Eswatini', name_ru: 'Эсватини', region: 'Africa', centroid_lat: -26.5225, centroid_lng: 31.4659 },
  { code: 'ET', name_en: 'Ethiopia', name_ru: 'Эфиопия', region: 'Africa', centroid_lat: 9.1450, centroid_lng: 40.4897 },
  { code: 'FJ', name_en: 'Fiji', name_ru: 'Фиджи', region: 'Oceania', centroid_lat: -17.7134, centroid_lng: 178.0650 },
  { code: 'FI', name_en: 'Finland', name_ru: 'Финляндия', region: 'Europe', centroid_lat: 61.9241, centroid_lng: 25.7482 },
  { code: 'FR', name_en: 'France', name_ru: 'Франция', region: 'Europe', centroid_lat: 46.6034, centroid_lng: 1.8883 },
  { code: 'GA', name_en: 'Gabon', name_ru: 'Габон', region: 'Africa', centroid_lat: -0.8037, centroid_lng: 11.6094 },
  { code: 'GM', name_en: 'Gambia', name_ru: 'Гамбия', region: 'Africa', centroid_lat: 13.4432, centroid_lng: -15.3101 },
  { code: 'GE', name_en: 'Georgia', name_ru: 'Грузия', region: 'Asia', centroid_lat: 42.3154, centroid_lng: 43.3569 },
  { code: 'DE', name_en: 'Germany', name_ru: 'Германия', region: 'Europe', centroid_lat: 51.1657, centroid_lng: 10.4515 },
  { code: 'GH', name_en: 'Ghana', name_ru: 'Гана', region: 'Africa', centroid_lat: 7.9465, centroid_lng: -1.0232 },
  { code: 'GR', name_en: 'Greece', name_ru: 'Греция', region: 'Europe', centroid_lat: 39.0742, centroid_lng: 21.8243 },
  { code: 'GD', name_en: 'Grenada', name_ru: 'Гренада', region: 'North America', centroid_lat: 12.1165, centroid_lng: -61.6790 },
  { code: 'GT', name_en: 'Guatemala', name_ru: 'Гватемала', region: 'North America', centroid_lat: 15.7835, centroid_lng: -90.2308 },
  { code: 'GN', name_en: 'Guinea', name_ru: 'Гвинея', region: 'Africa', centroid_lat: 9.9456, centroid_lng: -9.6966 },
  { code: 'GW', name_en: 'Guinea-Bissau', name_ru: 'Гвинея-Бисау', region: 'Africa', centroid_lat: 11.8037, centroid_lng: -15.1804 },
  { code: 'GY', name_en: 'Guyana', name_ru: 'Гайана', region: 'South America', centroid_lat: 4.8604, centroid_lng: -58.9302 },
  { code: 'HT', name_en: 'Haiti', name_ru: 'Гаити', region: 'North America', centroid_lat: 18.9712, centroid_lng: -72.2852 },
  { code: 'HN', name_en: 'Honduras', name_ru: 'Гондурас', region: 'North America', centroid_lat: 15.2000, centroid_lng: -86.2419 },
  { code: 'HU', name_en: 'Hungary', name_ru: 'Венгрия', region: 'Europe', centroid_lat: 47.1625, centroid_lng: 19.5033 },
  { code: 'IS', name_en: 'Iceland', name_ru: 'Исландия', region: 'Europe', centroid_lat: 64.9631, centroid_lng: -19.0208 },
  { code: 'IN', name_en: 'India', name_ru: 'Индия', region: 'Asia', centroid_lat: 20.5937, centroid_lng: 78.9629 },
  { code: 'ID', name_en: 'Indonesia', name_ru: 'Индонезия', region: 'Asia', centroid_lat: -0.7893, centroid_lng: 113.9213 },
  { code: 'IR', name_en: 'Iran', name_ru: 'Иран', region: 'Asia', centroid_lat: 32.4279, centroid_lng: 53.6880 },
  { code: 'IQ', name_en: 'Iraq', name_ru: 'Ирак', region: 'Asia', centroid_lat: 33.2232, centroid_lng: 43.6793 },
  { code: 'IE', name_en: 'Ireland', name_ru: 'Ирландия', region: 'Europe', centroid_lat: 53.4129, centroid_lng: -8.2439 },
  { code: 'IL', name_en: 'Israel', name_ru: 'Израиль', region: 'Asia', centroid_lat: 31.0461, centroid_lng: 34.8516 },
  { code: 'IT', name_en: 'Italy', name_ru: 'Италия', region: 'Europe', centroid_lat: 41.8719, centroid_lng: 12.5674 },
  { code: 'JM', name_en: 'Jamaica', name_ru: 'Ямайка', region: 'North America', centroid_lat: 18.1096, centroid_lng: -77.2975 },
  { code: 'JP', name_en: 'Japan', name_ru: 'Япония', region: 'Asia', centroid_lat: 36.2048, centroid_lng: 138.2529 },
  { code: 'JO', name_en: 'Jordan', name_ru: 'Иордания', region: 'Asia', centroid_lat: 30.5852, centroid_lng: 36.2384 },
  { code: 'KZ', name_en: 'Kazakhstan', name_ru: 'Казахстан', region: 'Asia', centroid_lat: 48.0196, centroid_lng: 66.9237 },
  { code: 'KE', name_en: 'Kenya', name_ru: 'Кения', region: 'Africa', centroid_lat: -0.0236, centroid_lng: 37.9062 },
  { code: 'KI', name_en: 'Kiribati', name_ru: 'Кирибати', region: 'Oceania', centroid_lat: -3.3704, centroid_lng: -168.7340 },
  { code: 'KW', name_en: 'Kuwait', name_ru: 'Кувейт', region: 'Asia', centroid_lat: 29.3117, centroid_lng: 47.4818 },
  { code: 'KG', name_en: 'Kyrgyzstan', name_ru: 'Киргизия', region: 'Asia', centroid_lat: 41.2044, centroid_lng: 74.7661 },
  { code: 'LA', name_en: 'Laos', name_ru: 'Лаос', region: 'Asia', centroid_lat: 19.8563, centroid_lng: 102.4955 },
  { code: 'LV', name_en: 'Latvia', name_ru: 'Латвия', region: 'Europe', centroid_lat: 56.8796, centroid_lng: 24.6032 },
  { code: 'LB', name_en: 'Lebanon', name_ru: 'Ливан', region: 'Asia', centroid_lat: 33.8547, centroid_lng: 35.8623 },
  { code: 'LS', name_en: 'Lesotho', name_ru: 'Лесото', region: 'Africa', centroid_lat: -29.6099, centroid_lng: 28.2336 },
  { code: 'LR', name_en: 'Liberia', name_ru: 'Либерия', region: 'Africa', centroid_lat: 6.4281, centroid_lng: -9.4295 },
  { code: 'LY', name_en: 'Libya', name_ru: 'Ливия', region: 'Africa', centroid_lat: 26.3351, centroid_lng: 17.2283 },
  { code: 'LI', name_en: 'Liechtenstein', name_ru: 'Лихтенштейн', region: 'Europe', centroid_lat: 47.1660, centroid_lng: 9.5554 },
  { code: 'LT', name_en: 'Lithuania', name_ru: 'Литва', region: 'Europe', centroid_lat: 55.1694, centroid_lng: 23.8813 },
  { code: 'LU', name_en: 'Luxembourg', name_ru: 'Люксембург', region: 'Europe', centroid_lat: 49.8153, centroid_lng: 6.1296 },
  { code: 'MG', name_en: 'Madagascar', name_ru: 'Мадагаскар', region: 'Africa', centroid_lat: -18.7669, centroid_lng: 46.8691 },
  { code: 'MW', name_en: 'Malawi', name_ru: 'Малави', region: 'Africa', centroid_lat: -13.2543, centroid_lng: 34.3015 },
  { code: 'MY', name_en: 'Malaysia', name_ru: 'Малайзия', region: 'Asia', centroid_lat: 4.2105, centroid_lng: 101.9758 },
  { code: 'MV', name_en: 'Maldives', name_ru: 'Мальдивы', region: 'Asia', centroid_lat: 3.2028, centroid_lng: 73.2207 },
  { code: 'ML', name_en: 'Mali', name_ru: 'Мали', region: 'Africa', centroid_lat: 17.5707, centroid_lng: -3.9962 },
  { code: 'MT', name_en: 'Malta', name_ru: 'Мальта', region: 'Europe', centroid_lat: 35.9375, centroid_lng: 14.3754 },
  { code: 'MH', name_en: 'Marshall Islands', name_ru: 'Маршалловы Острова', region: 'Oceania', centroid_lat: 7.1315, centroid_lng: 171.1845 },
  { code: 'MR', name_en: 'Mauritania', name_ru: 'Мавритания', region: 'Africa', centroid_lat: 21.0079, centroid_lng: -10.9408 },
  { code: 'MU', name_en: 'Mauritius', name_ru: 'Маврикий', region: 'Africa', centroid_lat: -20.3484, centroid_lng: 57.5522 },
  { code: 'MX', name_en: 'Mexico', name_ru: 'Мексика', region: 'North America', centroid_lat: 23.6345, centroid_lng: -102.5528 },
  { code: 'FM', name_en: 'Micronesia', name_ru: 'Микронезия', region: 'Oceania', centroid_lat: 7.4256, centroid_lng: 150.5508 },
  { code: 'MD', name_en: 'Moldova', name_ru: 'Молдова', region: 'Europe', centroid_lat: 47.4116, centroid_lng: 28.3699 },
  { code: 'MC', name_en: 'Monaco', name_ru: 'Монако', region: 'Europe', centroid_lat: 43.7384, centroid_lng: 7.4246 },
  { code: 'MN', name_en: 'Mongolia', name_ru: 'Монголия', region: 'Asia', centroid_lat: 46.8625, centroid_lng: 103.8467 },
  { code: 'ME', name_en: 'Montenegro', name_ru: 'Черногория', region: 'Europe', centroid_lat: 42.7087, centroid_lng: 19.3744 },
  { code: 'MA', name_en: 'Morocco', name_ru: 'Марокко', region: 'Africa', centroid_lat: 31.7917, centroid_lng: -7.0926 },
  { code: 'MZ', name_en: 'Mozambique', name_ru: 'Мозамбик', region: 'Africa', centroid_lat: -18.6657, centroid_lng: 35.5296 },
  { code: 'MM', name_en: 'Myanmar', name_ru: 'Мьянма', region: 'Asia', centroid_lat: 21.9162, centroid_lng: 95.9560 },
  { code: 'NA', name_en: 'Namibia', name_ru: 'Намибия', region: 'Africa', centroid_lat: -22.9576, centroid_lng: 18.4904 },
  { code: 'NR', name_en: 'Nauru', name_ru: 'Науру', region: 'Oceania', centroid_lat: -0.5228, centroid_lng: 166.9315 },
  { code: 'NP', name_en: 'Nepal', name_ru: 'Непал', region: 'Asia', centroid_lat: 28.3949, centroid_lng: 84.1240 },
  { code: 'NL', name_en: 'Netherlands', name_ru: 'Нидерланды', region: 'Europe', centroid_lat: 52.1326, centroid_lng: 5.2913 },
  { code: 'NZ', name_en: 'New Zealand', name_ru: 'Новая Зеландия', region: 'Oceania', centroid_lat: -40.9006, centroid_lng: 174.8860 },
  { code: 'NI', name_en: 'Nicaragua', name_ru: 'Никарагуа', region: 'North America', centroid_lat: 12.8654, centroid_lng: -85.2072 },
  { code: 'NE', name_en: 'Niger', name_ru: 'Нигер', region: 'Africa', centroid_lat: 17.6078, centroid_lng: 8.0817 },
  { code: 'NG', name_en: 'Nigeria', name_ru: 'Нигерия', region: 'Africa', centroid_lat: 9.0820, centroid_lng: 8.6753 },
  { code: 'MK', name_en: 'North Macedonia', name_ru: 'Северная Македония', region: 'Europe', centroid_lat: 41.6086, centroid_lng: 21.7453 },
  { code: 'NO', name_en: 'Norway', name_ru: 'Норвегия', region: 'Europe', centroid_lat: 60.4720, centroid_lng: 8.4689 },
  { code: 'OM', name_en: 'Oman', name_ru: 'Оман', region: 'Asia', centroid_lat: 21.4735, centroid_lng: 55.9754 },
  { code: 'PK', name_en: 'Pakistan', name_ru: 'Пакистан', region: 'Asia', centroid_lat: 30.3753, centroid_lng: 69.3451 },
  { code: 'PW', name_en: 'Palau', name_ru: 'Палау', region: 'Oceania', centroid_lat: 7.5149, centroid_lng: 134.5825 },
  { code: 'PA', name_en: 'Panama', name_ru: 'Панама', region: 'North America', centroid_lat: 8.5380, centroid_lng: -80.7821 },
  { code: 'PG', name_en: 'Papua New Guinea', name_ru: 'Папуа-Новая Гвинея', region: 'Oceania', centroid_lat: -6.3150, centroid_lng: 143.9555 },
  { code: 'PY', name_en: 'Paraguay', name_ru: 'Парагвай', region: 'South America', centroid_lat: -23.4425, centroid_lng: -58.4438 },
  { code: 'PE', name_en: 'Peru', name_ru: 'Перу', region: 'South America', centroid_lat: -9.1899, centroid_lng: -75.0152 },
  { code: 'PH', name_en: 'Philippines', name_ru: 'Филиппины', region: 'Asia', centroid_lat: 12.8797, centroid_lng: 121.7740 },
  { code: 'PL', name_en: 'Poland', name_ru: 'Польша', region: 'Europe', centroid_lat: 51.9194, centroid_lng: 19.1451 },
  { code: 'PT', name_en: 'Portugal', name_ru: 'Португалия', region: 'Europe', centroid_lat: 39.3999, centroid_lng: -8.2245 },
  { code: 'QA', name_en: 'Qatar', name_ru: 'Катар', region: 'Asia', centroid_lat: 25.3548, centroid_lng: 51.1839 },
  { code: 'RO', name_en: 'Romania', name_ru: 'Румыния', region: 'Europe', centroid_lat: 45.9432, centroid_lng: 24.9668 },
  { code: 'RU', name_en: 'Russia', name_ru: 'Россия', region: 'Europe', centroid_lat: 61.5240, centroid_lng: 105.3188 },
  { code: 'RW', name_en: 'Rwanda', name_ru: 'Руанда', region: 'Africa', centroid_lat: -1.9403, centroid_lng: 29.8739 },
  { code: 'KN', name_en: 'Saint Kitts and Nevis', name_ru: 'Сент-Китс и Невис', region: 'North America', centroid_lat: 17.3578, centroid_lng: -62.7830 },
  { code: 'LC', name_en: 'Saint Lucia', name_ru: 'Сент-Люсия', region: 'North America', centroid_lat: 13.9094, centroid_lng: -60.9789 },
  { code: 'VC', name_en: 'Saint Vincent and the Grenadines', name_ru: 'Сент-Винсент и Гренадины', region: 'North America', centroid_lat: 12.9843, centroid_lng: -61.2872 },
  { code: 'WS', name_en: 'Samoa', name_ru: 'Самоа', region: 'Oceania', centroid_lat: -13.7590, centroid_lng: -172.1046 },
  { code: 'SM', name_en: 'San Marino', name_ru: 'Сан-Марино', region: 'Europe', centroid_lat: 43.9424, centroid_lng: 12.4578 },
  { code: 'ST', name_en: 'Sao Tome and Principe', name_ru: 'Сан-Томе и Принсипи', region: 'Africa', centroid_lat: 0.1864, centroid_lng: 6.6131 },
  { code: 'SA', name_en: 'Saudi Arabia', name_ru: 'Саудовская Аравия', region: 'Asia', centroid_lat: 23.8859, centroid_lng: 45.0792 },
  { code: 'SN', name_en: 'Senegal', name_ru: 'Сенегал', region: 'Africa', centroid_lat: 14.4974, centroid_lng: -14.4524 },
  { code: 'RS', name_en: 'Serbia', name_ru: 'Сербия', region: 'Europe', centroid_lat: 44.0165, centroid_lng: 21.0059 },
  { code: 'SC', name_en: 'Seychelles', name_ru: 'Сейшелы', region: 'Africa', centroid_lat: -4.6796, centroid_lng: 55.4920 },
  { code: 'SL', name_en: 'Sierra Leone', name_ru: 'Сьерра-Леоне', region: 'Africa', centroid_lat: 8.4606, centroid_lng: -11.7799 },
  { code: 'SG', name_en: 'Singapore', name_ru: 'Сингапур', region: 'Asia', centroid_lat: 1.3521, centroid_lng: 103.8198 },
  { code: 'SK', name_en: 'Slovakia', name_ru: 'Словакия', region: 'Europe', centroid_lat: 48.6690, centroid_lng: 19.6990 },
  { code: 'SI', name_en: 'Slovenia', name_ru: 'Словения', region: 'Europe', centroid_lat: 46.1512, centroid_lng: 14.9955 },
  { code: 'SB', name_en: 'Solomon Islands', name_ru: 'Соломоновы Острова', region: 'Oceania', centroid_lat: -9.6457, centroid_lng: 160.1562 },
  { code: 'SO', name_en: 'Somalia', name_ru: 'Сомали', region: 'Africa', centroid_lat: 5.1521, centroid_lng: 46.1996 },
  { code: 'ZA', name_en: 'South Africa', name_ru: 'ЮАР', region: 'Africa', centroid_lat: -30.5595, centroid_lng: 22.9375 },
  { code: 'KR', name_en: 'South Korea', name_ru: 'Южная Корея', region: 'Asia', centroid_lat: 35.9078, centroid_lng: 127.7669 },
  { code: 'SS', name_en: 'South Sudan', name_ru: 'Южный Судан', region: 'Africa', centroid_lat: 6.8770, centroid_lng: 31.3070 },
  { code: 'ES', name_en: 'Spain', name_ru: 'Испания', region: 'Europe', centroid_lat: 40.4637, centroid_lng: -3.7492 },
  { code: 'LK', name_en: 'Sri Lanka', name_ru: 'Шри-Ланка', region: 'Asia', centroid_lat: 7.8731, centroid_lng: 80.7718 },
  { code: 'SD', name_en: 'Sudan', name_ru: 'Судан', region: 'Africa', centroid_lat: 12.8628, centroid_lng: 30.2176 },
  { code: 'SR', name_en: 'Suriname', name_ru: 'Суринам', region: 'South America', centroid_lat: 3.9193, centroid_lng: -56.0278 },
  { code: 'SE', name_en: 'Sweden', name_ru: 'Швеция', region: 'Europe', centroid_lat: 60.1282, centroid_lng: 18.6435 },
  { code: 'CH', name_en: 'Switzerland', name_ru: 'Швейцария', region: 'Europe', centroid_lat: 46.8182, centroid_lng: 8.2275 },
  { code: 'SY', name_en: 'Syria', name_ru: 'Сирия', region: 'Asia', centroid_lat: 34.8021, centroid_lng: 38.9968 },
  { code: 'TJ', name_en: 'Tajikistan', name_ru: 'Таджикистан', region: 'Asia', centroid_lat: 38.8610, centroid_lng: 71.2761 },
  { code: 'TZ', name_en: 'Tanzania', name_ru: 'Танзания', region: 'Africa', centroid_lat: -6.3690, centroid_lng: 34.8888 },
  { code: 'TH', name_en: 'Thailand', name_ru: 'Таиланд', region: 'Asia', centroid_lat: 15.8700, centroid_lng: 100.9925 },
  { code: 'TL', name_en: 'Timor-Leste', name_ru: 'Восточный Тимор', region: 'Asia', centroid_lat: -8.8742, centroid_lng: 125.7275 },
  { code: 'TG', name_en: 'Togo', name_ru: 'Того', region: 'Africa', centroid_lat: 8.6195, centroid_lng: 0.8248 },
  { code: 'TO', name_en: 'Tonga', name_ru: 'Тонга', region: 'Oceania', centroid_lat: -21.1790, centroid_lng: -175.1982 },
  { code: 'TT', name_en: 'Trinidad and Tobago', name_ru: 'Тринидад и Тобаго', region: 'North America', centroid_lat: 10.6918, centroid_lng: -61.2225 },
  { code: 'TN', name_en: 'Tunisia', name_ru: 'Тунис', region: 'Africa', centroid_lat: 33.8869, centroid_lng: 9.5375 },
  { code: 'TR', name_en: 'Turkey', name_ru: 'Турция', region: 'Asia', centroid_lat: 38.9637, centroid_lng: 35.2433 },
  { code: 'TM', name_en: 'Turkmenistan', name_ru: 'Туркменистан', region: 'Asia', centroid_lat: 38.9697, centroid_lng: 59.5563 },
  { code: 'TV', name_en: 'Tuvalu', name_ru: 'Тувалу', region: 'Oceania', centroid_lat: -7.1095, centroid_lng: 177.6493 },
  { code: 'UG', name_en: 'Uganda', name_ru: 'Уганда', region: 'Africa', centroid_lat: 1.3733, centroid_lng: 32.2903 },
  { code: 'UA', name_en: 'Ukraine', name_ru: 'Украина', region: 'Europe', centroid_lat: 48.3794, centroid_lng: 31.1656 },
  { code: 'AE', name_en: 'United Arab Emirates', name_ru: 'ОАЭ', region: 'Asia', centroid_lat: 23.4241, centroid_lng: 53.8478 },
  { code: 'GB', name_en: 'United Kingdom', name_ru: 'Великобритания', region: 'Europe', centroid_lat: 55.3781, centroid_lng: -3.4360 },
  { code: 'US', name_en: 'United States', name_ru: 'США', region: 'North America', centroid_lat: 37.0902, centroid_lng: -95.7129 },
  { code: 'UY', name_en: 'Uruguay', name_ru: 'Уругвай', region: 'South America', centroid_lat: -32.5228, centroid_lng: -55.7658 },
  { code: 'UZ', name_en: 'Uzbekistan', name_ru: 'Узбекистан', region: 'Asia', centroid_lat: 41.3775, centroid_lng: 64.5853 },
  { code: 'VU', name_en: 'Vanuatu', name_ru: 'Вануату', region: 'Oceania', centroid_lat: -15.3767, centroid_lng: 166.9592 },
  { code: 'VE', name_en: 'Venezuela', name_ru: 'Венесуэла', region: 'South America', centroid_lat: 6.4238, centroid_lng: -66.5897 },
  { code: 'VN', name_en: 'Vietnam', name_ru: 'Вьетнам', region: 'Asia', centroid_lat: 14.0583, centroid_lng: 108.2772 },
  { code: 'YE', name_en: 'Yemen', name_ru: 'Йемен', region: 'Asia', centroid_lat: 15.5527, centroid_lng: 48.5164 },
  { code: 'ZM', name_en: 'Zambia', name_ru: 'Замбия', region: 'Africa', centroid_lat: -13.1339, centroid_lng: 27.8493 },
  { code: 'ZW', name_en: 'Zimbabwe', name_ru: 'Зимбабве', region: 'Africa', centroid_lat: -19.0154, centroid_lng: 29.1549 },
]

// ------------------ Города (255) ------------------
const citiesData = [
  // Узбекистан
  { country_code: 'UZ', name: 'Tashkent',        latitude: 41.2995, longitude: 69.2401, population: 2570000 },
  { country_code: 'UZ', name: 'Samarkand',        latitude: 39.6542, longitude: 66.9598, population: 504000 },
  { country_code: 'UZ', name: 'Bukhara',          latitude: 39.7747, longitude: 64.4286, population: 280000 },
  { country_code: 'UZ', name: 'Namangan',         latitude: 40.9983, longitude: 71.6726, population: 475000 },
  { country_code: 'UZ', name: 'Andijan',          latitude: 40.7833, longitude: 72.3500, population: 416000 },
  { country_code: 'UZ', name: 'Fergana',          latitude: 40.3842, longitude: 71.7843, population: 264000 },
  { country_code: 'UZ', name: 'Qarshi',           latitude: 38.8605, longitude: 65.7891, population: 244000 },
  { country_code: 'UZ', name: 'Urgench',          latitude: 41.5500, longitude: 60.6333, population: 175000 },
  { country_code: 'UZ', name: 'Jizzakh',          latitude: 40.1158, longitude: 67.8422, population: 152000 },
  // Казахстан
  { country_code: 'KZ', name: 'Almaty',           latitude: 43.2220, longitude: 76.8512, population: 1850000 },
  { country_code: 'KZ', name: 'Nur-Sultan',       latitude: 51.1694, longitude: 71.4491, population: 1130000 },
  { country_code: 'KZ', name: 'Shymkent',         latitude: 42.3000, longitude: 69.6000, population: 1012000 },
  { country_code: 'KZ', name: 'Karaganda',        latitude: 49.8000, longitude: 73.1000, population: 501000 },
  // Россия
  { country_code: 'RU', name: 'Moscow',           latitude: 55.7558, longitude: 37.6173, population: 12400000 },
  { country_code: 'RU', name: 'Saint Petersburg', latitude: 59.9343, longitude: 30.3351, population: 5400000 },
  { country_code: 'RU', name: 'Novosibirsk',      latitude: 55.0084, longitude: 82.9357, population: 1620000 },
  { country_code: 'RU', name: 'Yekaterinburg',    latitude: 56.8389, longitude: 60.6057, population: 1490000 },
  { country_code: 'RU', name: 'Kazan',            latitude: 55.7964, longitude: 49.1089, population: 1250000 },
  { country_code: 'RU', name: 'Nizhny Novgorod',  latitude: 56.3269, longitude: 44.0075, population: 1250000 },
  { country_code: 'RU', name: 'Chelyabinsk',      latitude: 55.1644, longitude: 61.4368, population: 1190000 },
  { country_code: 'RU', name: 'Omsk',             latitude: 54.9885, longitude: 73.3242, population: 1170000 },
  { country_code: 'RU', name: 'Rostov-on-Don',    latitude: 47.2357, longitude: 39.7015, population: 1130000 },
  { country_code: 'RU', name: 'Ufa',              latitude: 54.7388, longitude: 55.9721, population: 1120000 },
  { country_code: 'RU', name: 'Volgograd',        latitude: 48.7080, longitude: 44.5133, population: 1010000 },
  { country_code: 'RU', name: 'Perm',             latitude: 58.0105, longitude: 56.2502, population: 1050000 },
  // Китай
  { country_code: 'CN', name: 'Beijing',          latitude: 39.9042, longitude: 116.4074, population: 21500000 },
  { country_code: 'CN', name: 'Shanghai',         latitude: 31.2304, longitude: 121.4737, population: 24200000 },
  { country_code: 'CN', name: 'Guangzhou',        latitude: 23.1291, longitude: 113.2644, population: 15300000 },
  { country_code: 'CN', name: 'Shenzhen',         latitude: 22.5431, longitude: 114.0579, population: 12500000 },
  { country_code: 'CN', name: 'Chengdu',          latitude: 30.5728, longitude: 104.0668, population: 9000000 },
  { country_code: 'CN', name: 'Wuhan',            latitude: 30.5928, longitude: 114.3055, population: 8500000 },
  { country_code: 'CN', name: 'Tianjin',          latitude: 39.3434, longitude: 117.3616, population: 11000000 },
  { country_code: 'CN', name: 'Hangzhou',         latitude: 30.2741, longitude: 120.1551, population: 7900000 },
  { country_code: 'CN', name: 'Nanjing',          latitude: 32.0603, longitude: 118.7969, population: 8400000 },
  { country_code: 'CN', name: 'Chongqing',        latitude: 29.4316, longitude: 106.9123, population: 8000000 },
  // Индия
  { country_code: 'IN', name: 'Mumbai',           latitude: 19.0760, longitude: 72.8777, population: 20700000 },
  { country_code: 'IN', name: 'Delhi',            latitude: 28.7041, longitude: 77.1025, population: 31000000 },
  { country_code: 'IN', name: 'Bangalore',        latitude: 12.9716, longitude: 77.5946, population: 12400000 },
  { country_code: 'IN', name: 'Hyderabad',        latitude: 17.3850, longitude: 78.4867, population: 9800000 },
  { country_code: 'IN', name: 'Ahmedabad',        latitude: 23.0225, longitude: 72.5714, population: 7400000 },
  { country_code: 'IN', name: 'Chennai',          latitude: 13.0827, longitude: 80.2707, population: 10900000 },
  { country_code: 'IN', name: 'Kolkata',          latitude: 22.5726, longitude: 88.3639, population: 14500000 },
  { country_code: 'IN', name: 'Surat',            latitude: 21.1702, longitude: 72.8311, population: 6400000 },
  { country_code: 'IN', name: 'Pune',             latitude: 18.5204, longitude: 73.8567, population: 6300000 },
  { country_code: 'IN', name: 'Jaipur',           latitude: 26.9124, longitude: 75.7873, population: 3100000 },
  { country_code: 'IN', name: 'Lucknow',          latitude: 26.8467, longitude: 80.9462, population: 2900000 },
  // США
  { country_code: 'US', name: 'New York',         latitude: 40.7128, longitude: -74.0060, population: 8800000 },
  { country_code: 'US', name: 'Los Angeles',      latitude: 34.0522, longitude: -118.2437, population: 4000000 },
  { country_code: 'US', name: 'Chicago',          latitude: 41.8781, longitude: -87.6298, population: 2700000 },
  { country_code: 'US', name: 'Houston',          latitude: 29.7604, longitude: -95.3698, population: 2300000 },
  { country_code: 'US', name: 'Phoenix',          latitude: 33.4484, longitude: -112.0740, population: 1660000 },
  { country_code: 'US', name: 'Philadelphia',     latitude: 39.9526, longitude: -75.1652, population: 1580000 },
  { country_code: 'US', name: 'San Antonio',      latitude: 29.4241, longitude: -98.4936, population: 1540000 },
  { country_code: 'US', name: 'San Diego',        latitude: 32.7157, longitude: -117.1611, population: 1420000 },
  { country_code: 'US', name: 'Dallas',           latitude: 32.7767, longitude: -96.7970, population: 1340000 },
  { country_code: 'US', name: 'Austin',           latitude: 30.2672, longitude: -97.7431, population: 960000 },
  // Бразилия
  { country_code: 'BR', name: 'São Paulo',        latitude: -23.5505, longitude: -46.6333, population: 12300000 },
  { country_code: 'BR', name: 'Rio de Janeiro',   latitude: -22.9068, longitude: -43.1729, population: 6700000 },
  { country_code: 'BR', name: 'Brasília',         latitude: -15.8267, longitude: -47.9218, population: 3000000 },
  { country_code: 'BR', name: 'Salvador',         latitude: -12.9714, longitude: -38.5014, population: 2880000 },
  { country_code: 'BR', name: 'Fortaleza',        latitude: -3.7319, longitude: -38.5267, population: 2600000 },
  { country_code: 'BR', name: 'Belo Horizonte',   latitude: -19.9167, longitude: -43.9345, population: 2500000 },
  { country_code: 'BR', name: 'Manaus',           latitude: -3.1190, longitude: -60.0217, population: 2200000 },
  { country_code: 'BR', name: 'Curitiba',         latitude: -25.4284, longitude: -49.2733, population: 1900000 },
  // Мексика
  { country_code: 'MX', name: 'Mexico City',      latitude: 19.4326, longitude: -99.1332, population: 9000000 },
  { country_code: 'MX', name: 'Guadalajara',      latitude: 20.6597, longitude: -103.3496, population: 1500000 },
  { country_code: 'MX', name: 'Monterrey',        latitude: 25.6866, longitude: -100.3161, population: 1100000 },
  { country_code: 'MX', name: 'Puebla',           latitude: 19.0414, longitude: -98.2063, population: 1500000 },
  { country_code: 'MX', name: 'Tijuana',          latitude: 32.5149, longitude: -117.0382, population: 1920000 },
  // Германия
  { country_code: 'DE', name: 'Berlin',           latitude: 52.5200, longitude: 13.4050, population: 3600000 },
  { country_code: 'DE', name: 'Munich',           latitude: 48.1351, longitude: 11.5820, population: 1470000 },
  { country_code: 'DE', name: 'Hamburg',          latitude: 53.5511, longitude: 9.9937, population: 1840000 },
  { country_code: 'DE', name: 'Cologne',          latitude: 50.9375, longitude: 6.9603, population: 1080000 },
  { country_code: 'DE', name: 'Frankfurt',        latitude: 50.1109, longitude: 8.6821, population: 763000 },
  // Франция
  { country_code: 'FR', name: 'Paris',            latitude: 48.8566, longitude: 2.3522, population: 2200000 },
  { country_code: 'FR', name: 'Marseille',        latitude: 43.2965, longitude: 5.3698, population: 861000 },
  { country_code: 'FR', name: 'Lyon',             latitude: 45.7640, longitude: 4.8357, population: 513000 },
  { country_code: 'FR', name: 'Toulouse',         latitude: 43.6047, longitude: 1.4442, population: 479000 },
  { country_code: 'FR', name: 'Nice',             latitude: 43.7102, longitude: 7.2620, population: 343000 },
  // Великобритания
  { country_code: 'GB', name: 'London',           latitude: 51.5074, longitude: -0.1278, population: 9000000 },
  { country_code: 'GB', name: 'Manchester',       latitude: 53.4830, longitude: -2.2446, population: 553000 },
  { country_code: 'GB', name: 'Birmingham',       latitude: 52.4862, longitude: -1.8904, population: 1140000 },
  { country_code: 'GB', name: 'Leeds',            latitude: 53.8008, longitude: -1.5491, population: 780000 },
  { country_code: 'GB', name: 'Glasgow',          latitude: 55.8642, longitude: -4.2518, population: 633000 },
  // Италия
  { country_code: 'IT', name: 'Rome',             latitude: 41.9028, longitude: 12.4964, population: 2800000 },
  { country_code: 'IT', name: 'Milan',            latitude: 45.4642, longitude: 9.1900, population: 1350000 },
  { country_code: 'IT', name: 'Naples',           latitude: 40.8518, longitude: 14.2681, population: 967000 },
  { country_code: 'IT', name: 'Turin',            latitude: 45.0703, longitude: 7.6869, population: 886000 },
  { country_code: 'IT', name: 'Palermo',          latitude: 38.1157, longitude: 13.3615, population: 676000 },
  // Испания
  { country_code: 'ES', name: 'Madrid',           latitude: 40.4168, longitude: -3.7038, population: 3300000 },
  { country_code: 'ES', name: 'Barcelona',        latitude: 41.3874, longitude: 2.1686, population: 1620000 },
  { country_code: 'ES', name: 'Valencia',         latitude: 39.4699, longitude: -0.3763, population: 791000 },
  { country_code: 'ES', name: 'Seville',          latitude: 37.3891, longitude: -5.9845, population: 688000 },
  { country_code: 'ES', name: 'Zaragoza',         latitude: 41.6488, longitude: -0.8891, population: 674000 },
  // Япония
  { country_code: 'JP', name: 'Tokyo',            latitude: 35.6762, longitude: 139.6503, population: 37400000 },
  { country_code: 'JP', name: 'Osaka',            latitude: 34.6937, longitude: 135.5022, population: 2700000 },
  { country_code: 'JP', name: 'Nagoya',           latitude: 35.1815, longitude: 136.9066, population: 2300000 },
  { country_code: 'JP', name: 'Yokohama',         latitude: 35.4437, longitude: 139.6380, population: 3700000 },
  // Южная Корея
  { country_code: 'KR', name: 'Seoul',            latitude: 37.5665, longitude: 126.9780, population: 9700000 },
  { country_code: 'KR', name: 'Busan',            latitude: 35.1796, longitude: 129.0756, population: 3400000 },
  { country_code: 'KR', name: 'Incheon',          latitude: 37.4563, longitude: 126.7052, population: 2900000 },
  { country_code: 'KR', name: 'Daegu',            latitude: 35.8714, longitude: 128.6014, population: 2440000 },
  // Индонезия
  { country_code: 'ID', name: 'Jakarta',          latitude: -6.2088, longitude: 106.8456, population: 11000000 },
  { country_code: 'ID', name: 'Surabaya',         latitude: -7.2504, longitude: 112.7688, population: 2800000 },
  { country_code: 'ID', name: 'Bandung',          latitude: -6.9175, longitude: 107.6191, population: 2500000 },
  { country_code: 'ID', name: 'Medan',            latitude: 3.5952, longitude: 98.6722, population: 2100000 },
  // Пакистан
  { country_code: 'PK', name: 'Karachi',          latitude: 24.8607, longitude: 67.0011, population: 15700000 },
  { country_code: 'PK', name: 'Lahore',           latitude: 31.5497, longitude: 74.3436, population: 11100000 },
  { country_code: 'PK', name: 'Islamabad',        latitude: 33.6844, longitude: 73.0479, population: 1100000 },
  { country_code: 'PK', name: 'Rawalpindi',       latitude: 33.5973, longitude: 73.0479, population: 2200000 },
  // Бангладеш
  { country_code: 'BD', name: 'Dhaka',            latitude: 23.8103, longitude: 90.4125, population: 22000000 },
  { country_code: 'BD', name: 'Chittagong',       latitude: 22.3569, longitude: 91.7832, population: 8700000 },
  { country_code: 'BD', name: 'Khulna',           latitude: 22.8456, longitude: 89.5403, population: 1500000 },
  // Нигерия
  { country_code: 'NG', name: 'Lagos',            latitude: 6.5244, longitude: 3.3792, population: 14800000 },
  { country_code: 'NG', name: 'Abuja',            latitude: 9.0579, longitude: 7.4951, population: 3500000 },
  { country_code: 'NG', name: 'Kano',             latitude: 12.0022, longitude: 8.5920, population: 4100000 },
  // Египет
  { country_code: 'EG', name: 'Cairo',            latitude: 30.0444, longitude: 31.2357, population: 9500000 },
  { country_code: 'EG', name: 'Alexandria',       latitude: 31.2001, longitude: 29.9187, population: 5000000 },
  { country_code: 'EG', name: 'Giza',             latitude: 30.0131, longitude: 31.2089, population: 3800000 },
  // ЮАР
  { country_code: 'ZA', name: 'Johannesburg',     latitude: -26.2041, longitude: 28.0473, population: 5500000 },
  { country_code: 'ZA', name: 'Cape Town',        latitude: -33.9249, longitude: 18.4241, population: 4300000 },
  { country_code: 'ZA', name: 'Durban',           latitude: -29.8587, longitude: 31.0218, population: 3800000 },
  // Кения
  { country_code: 'KE', name: 'Nairobi',          latitude: -1.2921, longitude: 36.8219, population: 4700000 },
  { country_code: 'KE', name: 'Mombasa',          latitude: -4.0435, longitude: 39.6682, population: 1200000 },
  // Эфиопия
  { country_code: 'ET', name: 'Addis Ababa',      latitude: 9.0320, longitude: 38.7469, population: 3400000 },
  // Австралия
  { country_code: 'AU', name: 'Sydney',           latitude: -33.8688, longitude: 151.2093, population: 5300000 },
  { country_code: 'AU', name: 'Melbourne',        latitude: -37.8136, longitude: 144.9631, population: 5000000 },
  { country_code: 'AU', name: 'Brisbane',         latitude: -27.4698, longitude: 153.0251, population: 2500000 },
  { country_code: 'AU', name: 'Perth',            latitude: -31.9505, longitude: 115.8605, population: 2100000 },
  // Новая Зеландия
  { country_code: 'NZ', name: 'Auckland',         latitude: -36.8485, longitude: 174.7633, population: 1650000 },
  { country_code: 'NZ', name: 'Wellington',       latitude: -41.2865, longitude: 174.7762, population: 418000 },
  // Турция
  { country_code: 'TR', name: 'Istanbul',         latitude: 41.0082, longitude: 28.9784, population: 15500000 },
  { country_code: 'TR', name: 'Ankara',           latitude: 39.9334, longitude: 32.8597, population: 5500000 },
  { country_code: 'TR', name: 'Izmir',            latitude: 38.4237, longitude: 27.1428, population: 3000000 },
  { country_code: 'TR', name: 'Bursa',            latitude: 40.1885, longitude: 29.0610, population: 2900000 },
  // Украина
  { country_code: 'UA', name: 'Kyiv',             latitude: 50.4501, longitude: 30.5234, population: 2900000 },
  { country_code: 'UA', name: 'Kharkiv',          latitude: 50.0041, longitude: 36.2319, population: 1400000 },
  { country_code: 'UA', name: 'Odesa',            latitude: 46.4825, longitude: 30.7233, population: 1010000 },
  // Польша
  { country_code: 'PL', name: 'Warsaw',           latitude: 52.2297, longitude: 21.0122, population: 1790000 },
  { country_code: 'PL', name: 'Krakow',           latitude: 50.0647, longitude: 19.9450, population: 779000 },
  // Нидерланды
  { country_code: 'NL', name: 'Amsterdam',        latitude: 52.3676, longitude: 4.9041, population: 872000 },
  { country_code: 'NL', name: 'Rotterdam',        latitude: 51.9244, longitude: 4.4777, population: 651000 },
  // Канада
  { country_code: 'CA', name: 'Toronto',          latitude: 43.6532, longitude: -79.3832, population: 2930000 },
  { country_code: 'CA', name: 'Vancouver',        latitude: 49.2827, longitude: -123.1207, population: 675000 },
  { country_code: 'CA', name: 'Montreal',         latitude: 45.5017, longitude: -73.5673, population: 1780000 },
  { country_code: 'CA', name: 'Calgary',          latitude: 51.0447, longitude: -114.0719, population: 1300000 },
  // Аргентина
  { country_code: 'AR', name: 'Buenos Aires',     latitude: -34.6037, longitude: -58.3816, population: 3070000 },
  { country_code: 'AR', name: 'Córdoba',          latitude: -31.4201, longitude: -64.1888, population: 1400000 },
  { country_code: 'AR', name: 'Rosario',          latitude: -32.9468, longitude: -60.6393, population: 1300000 },
  // Чили
  { country_code: 'CL', name: 'Santiago',         latitude: -33.4489, longitude: -70.6693, population: 6000000 },
  // Колумбия
  { country_code: 'CO', name: 'Bogotá',           latitude: 4.7110, longitude: -74.0721, population: 8000000 },
  { country_code: 'CO', name: 'Medellín',         latitude: 6.2476, longitude: -75.5658, population: 2500000 },
  // Перу
  { country_code: 'PE', name: 'Lima',             latitude: -12.0464, longitude: -77.0428, population: 10000000 },
  // Венесуэла
  { country_code: 'VE', name: 'Caracas',          latitude: 10.4806, longitude: -66.9036, population: 2100000 },
  // Саудовская Аравия
  { country_code: 'SA', name: 'Riyadh',           latitude: 24.7136, longitude: 46.6753, population: 7200000 },
  { country_code: 'SA', name: 'Jeddah',           latitude: 21.4858, longitude: 39.1925, population: 4600000 },
  // Иран
  { country_code: 'IR', name: 'Tehran',           latitude: 35.6892, longitude: 51.3890, population: 8700000 },
  { country_code: 'IR', name: 'Mashhad',          latitude: 36.2605, longitude: 59.6168, population: 3000000 },
  // Таиланд
  { country_code: 'TH', name: 'Bangkok',          latitude: 13.7563, longitude: 100.5018, population: 10500000 },
  // Вьетнам
  { country_code: 'VN', name: 'Ho Chi Minh City', latitude: 10.8231, longitude: 106.6297, population: 9000000 },
  { country_code: 'VN', name: 'Hanoi',            latitude: 21.0278, longitude: 105.8342, population: 8000000 },
  // Филиппины
  { country_code: 'PH', name: 'Manila',           latitude: 14.5995, longitude: 120.9842, population: 1780000 },
  { country_code: 'PH', name: 'Quezon City',      latitude: 14.6760, longitude: 121.0437, population: 2900000 },
  // Малайзия
  { country_code: 'MY', name: 'Kuala Lumpur',     latitude: 3.1390, longitude: 101.6869, population: 1760000 },
  // Сингапур
  { country_code: 'SG', name: 'Singapore',        latitude: 1.3521, longitude: 103.8198, population: 5600000 },
  // ОАЭ
  { country_code: 'AE', name: 'Dubai',            latitude: 25.2048, longitude: 55.2708, population: 3330000 },
  { country_code: 'AE', name: 'Abu Dhabi',        latitude: 24.4539, longitude: 54.3773, population: 1450000 },
  // Катар
  { country_code: 'QA', name: 'Doha',             latitude: 25.2854, longitude: 51.5310, population: 2400000 },
  // Швейцария
  { country_code: 'CH', name: 'Zurich',           latitude: 47.3769, longitude: 8.5417, population: 415000 },
  // Швеция
  { country_code: 'SE', name: 'Stockholm',        latitude: 59.3293, longitude: 18.0686, population: 975000 },
  // Норвегия
  { country_code: 'NO', name: 'Oslo',             latitude: 59.9139, longitude: 10.7522, population: 693000 },
  // Финляндия
  { country_code: 'FI', name: 'Helsinki',         latitude: 60.1699, longitude: 24.9384, population: 656000 },
  // Греция
  { country_code: 'GR', name: 'Athens',           latitude: 37.9838, longitude: 23.7275, population: 665000 },
  // Португалия
  { country_code: 'PT', name: 'Lisbon',           latitude: 38.7223, longitude: -9.1393, population: 505000 },
  // Ирландия
  { country_code: 'IE', name: 'Dublin',           latitude: 53.3498, longitude: -6.2603, population: 553000 },
  // Марокко
  { country_code: 'MA', name: 'Casablanca',       latitude: 33.5731, longitude: -7.5898, population: 3700000 },
  // Алжир
  { country_code: 'DZ', name: 'Algiers',          latitude: 36.7538, longitude: 3.0588, population: 2600000 },
  // Тунис
  { country_code: 'TN', name: 'Tunis',            latitude: 36.8065, longitude: 10.1815, population: 2700000 },
  // Гана
  { country_code: 'GH', name: 'Accra',            latitude: 5.6037, longitude: -0.1870, population: 2300000 },
  // Кот-д'Ивуар
  { country_code: 'CI', name: 'Abidjan',          latitude: 5.3600, longitude: -4.0083, population: 4700000 },
  // Сенегал
  { country_code: 'SN', name: 'Dakar',            latitude: 14.7167, longitude: -17.4677, population: 3100000 },
  // Камерун
  { country_code: 'CM', name: 'Douala',           latitude: 4.0511, longitude: 9.7679, population: 2800000 },
  { country_code: 'CM', name: 'Yaoundé',          latitude: 3.8480, longitude: 11.5021, population: 2800000 },
  // Танзания
  { country_code: 'TZ', name: 'Dar es Salaam',    latitude: -6.7924, longitude: 39.2083, population: 5400000 },
  // Уганда
  { country_code: 'UG', name: 'Kampala',          latitude: 0.3476, longitude: 32.5825, population: 1500000 },
  // Руанда
  { country_code: 'RW', name: 'Kigali',           latitude: -1.9441, longitude: 30.0619, population: 1100000 },
  // Боливия
  { country_code: 'BO', name: 'La Paz',           latitude: -16.4897, longitude: -68.1193, population: 1800000 },
  { country_code: 'BO', name: 'Santa Cruz',       latitude: -17.7833, longitude: -63.1821, population: 1600000 },
  // Парагвай
  { country_code: 'PY', name: 'Asunción',         latitude: -25.2637, longitude: -57.5759, population: 2300000 },
  // Уругвай
  { country_code: 'UY', name: 'Montevideo',       latitude: -34.9011, longitude: -56.1645, population: 1300000 },
  // Эквадор
  { country_code: 'EC', name: 'Quito',            latitude: -0.1807, longitude: -78.4678, population: 1800000 },
  { country_code: 'EC', name: 'Guayaquil',        latitude: -2.1700, longitude: -79.9224, population: 2700000 },
  // Доминиканская Республика
  { country_code: 'DO', name: 'Santo Domingo',    latitude: 18.4861, longitude: -69.9312, population: 3200000 },
  // Куба
  { country_code: 'CU', name: 'Havana',           latitude: 23.1136, longitude: -82.3666, population: 2100000 },
  // Гватемала
  { country_code: 'GT', name: 'Guatemala City',   latitude: 14.6349, longitude: -90.5069, population: 2900000 },
  // Гондурас
  { country_code: 'HN', name: 'Tegucigalpa',      latitude: 14.0650, longitude: -87.1715, population: 1500000 },
  // Коста-Рика
  { country_code: 'CR', name: 'San José',         latitude: 9.9281, longitude: -84.0907, population: 340000 },
  // Панама
  { country_code: 'PA', name: 'Panama City',      latitude: 8.9824, longitude: -79.5199, population: 1800000 },
  // Ямайка
  { country_code: 'JM', name: 'Kingston',         latitude: 17.9714, longitude: -76.7922, population: 670000 },
  // Гаити
  { country_code: 'HT', name: 'Port-au-Prince',   latitude: 18.5944, longitude: -72.3074, population: 2800000 },
]

// ------------------ Очистка и вставка ------------------
async function main() {
  console.log('Seeding database...')

  await prisma.$executeRawUnsafe('TRUNCATE TABLE visited_cities, visited_countries, refresh_tokens, users, cities_reference, countries_reference RESTART IDENTITY CASCADE')

  for (const country of countriesData) {
    await prisma.countryReference.create({ data: country })
  }
  console.log(`Inserted ${countriesData.length} countries`)

  for (const city of citiesData) {
    await prisma.cityReference.create({ data: city })
  }
  console.log(`Inserted ${citiesData.length} cities`)

  console.log('Seeding completed.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })