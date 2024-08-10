# Meeting-Room-Booking-System
## Intro
- 一個會議室預約系統
- 將此系統拆分成 Backend API & Frontend Site
### Backend API
- based on Express.JS & MySQL
- 提供前端需要的資料，處理資料的儲存
- Current APIs
  - GET `/api/login/sso` : 串接 NCU OAuth，並將 request 和取得的 `access_token` 一起 redirect to a url（目前暫時會回傳到 `/example`，其有範例的 html 展示如何使用 API）
  - GET `/api/info/accoutType` : 利用 request header 的 `access_token` field，送查詢資料的 request to `https://portal.ncu.edu.tw/apis/oauth/v1/info`，以回傳此 `access_token` 所屬帳號的帳號類型
### Frontend Site
## Features
- 提供利用 NCU Portal 實作第三方登入機制，讓學校職員可以利用學校帳號登入此系統
## Prerequisite
## Usage
### Backend API
- `npm install`
- `node index.js`
### Frontend Site
## Demo
- send a request to `/api/login/sso`
  - ![image](https://github.com/user-attachments/assets/ecfd905d-faa3-4970-8a5d-9c767b109d7a)
- redirect to NCU Portal
  - ![image](https://github.com/user-attachments/assets/9d00645a-6a7f-46a4-8886-a58c0444d00d)
- login with NCU account & pwd
  - ![image](https://github.com/user-attachments/assets/ef15fd9c-a06a-4bc9-80b0-448e518b815f)
- redirect to `/example`
  - ![image](https://github.com/user-attachments/assets/4f448821-734d-4d9e-80f9-af8f2556f43a)
