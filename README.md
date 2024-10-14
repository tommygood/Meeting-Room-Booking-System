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
- 提供頁面以在廣告機輪流播放 當日/當前/下一個 的會議
## Prerequisite
- Node v20 up
## Usage
### Backend API
- `mysql < schemal.sql`
- `npm install`
- `node index.js`
### Frontend Site
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
## Contribution
- 歡迎 PR，可以先看一下<a href="https://github.com/tommygood/Meeting-Room-Booking-System/blob/main/doc/contribution.md">教學</a>
