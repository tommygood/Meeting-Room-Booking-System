# Meeting-Room-Booking-System
## Intro
- 一個會議室預約系統
- 將此系統拆分成 Backend API & Frontend Site
### Backend API
- build on Express.JS & MySQL
- 提供前端需要的資料，處理資料的儲存
- <a href='https://github.com/tommygood/Meeting-Room-Booking-System/blob/main/doc/api.md'>API doc</a>
### Frontend Site
- build on Vue.js
## Features
### 串接 NCU OAuth
- 提供利用 NCU Portal 實作第三方登入機制，讓學校職員可以利用學校帳號登入此系統

  <details>
    <summary>流程圖</summary>

    ![image](https://github.com/user-attachments/assets/f62dd386-0089-4614-8aef-a58b838188a3)
  </details>
### 當特定 event 發生，使用 NCU SMTP Mail Server 寄信
- 預約成功
- 取消預約
### 文字編輯器
- 基於 Quill 開發
- 用於動態更新使用規則
### 看板播放
- 提供頁面（`/board/demo`）以在廣告機輪流播放<b>即時</b>的 當日/當前/下一個 的會議

  <details>
    <summary>畫面</summary>

    ![image](https://github.com/user-attachments/assets/550b8c25-db00-4fed-b7d0-9d9fbc52ba68)
  </details>
## Prerequisite
- Node v20 up
## Usage
### Frontend Site
- `cd src\MRBS-frontend`
- `npm install`
- `npm run build`
### Backend API
- `cd src\api`
- `mysql < model\schemal.sql`
- `npm install`
- `node index.js`
## Test
- <a href='https://github.com/tommygood/Meeting-Room-Booking-System/blob/main/doc/test.md'>doc</a>
### Frontend Unit Test
- build on vitest.
- usage : `cd src\MRBS-frontend && npm install && npm run test:unit`
### Backend Unit Test
- build on mocha.
- `cd src\api && npm run test`
### E2E Test
- build on cypress.
- `cd src\MRBS-frontend && npm install && npm run test:e2e`
## Workflow
- <a href='https://github.com/tommygood/Meeting-Room-Booking-System/blob/main/doc/workflow.md'>doc</a>
