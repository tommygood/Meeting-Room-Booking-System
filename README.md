# Meeting-Room-Booking-System
## Intro
- 一個會議室預約系統
- 將此系統拆分成 Backend API & Frontend Site
### Backend API
- based on Express.JS & MySQL
- 提供前端需要的資料，處理資料的儲存
- <a href='https://github.com/tommygood/Meeting-Room-Booking-System/blob/main/doc/api.md'>API doc</a>
### Frontend Site
## Features
### 串接 NCU OAuth
- 提供利用 NCU Portal 實作第三方登入機制，讓學校職員可以利用學校帳號登入此系統
- 流程圖
  ![image](https://github.com/user-attachments/assets/f62dd386-0089-4614-8aef-a58b838188a3)
## Prerequisite
## Usage
### Backend API
- `mysql < schemal.sql`
- `npm install`
- `node index.js`
### Frontend Site
## Future Works
1. ~~目前會將 OAuth access token 以 query string 存到使用者的前端頁面，但這是不安全的作法，之後要改為將 access token 存到 session~~
2. 後端 API 的單元測試
## Demo
- send a request to `/api/login/sso`
  - ![image](https://github.com/user-attachments/assets/ecfd905d-faa3-4970-8a5d-9c767b109d7a)
- redirect to NCU Portal
  - ![image](https://github.com/user-attachments/assets/9d00645a-6a7f-46a4-8886-a58c0444d00d)
- NCU Portal show the leave alert message after login with NCU account & pwd
  - ![image](https://github.com/user-attachments/assets/ef15fd9c-a06a-4bc9-80b0-448e518b815f)
- redirect to `/example`
  - ![image](https://github.com/user-attachments/assets/4f448821-734d-4d9e-80f9-af8f2556f43a)
## Workflow
- <a href='https://github.com/tommygood/Meeting-Room-Booking-System/blob/main/doc/workflow.md'>doc</a>
## Contribution
- 歡迎 PR，可以先看一下<a href="https://github.com/tommygood/Meeting-Room-Booking-System/blob/main/doc/contribution.md">教學</a>
