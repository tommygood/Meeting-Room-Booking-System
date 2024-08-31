# 後端如何新增 API
1. 到 `index.js` 新增 route path
2. 若需存取資料庫資料，到 `model/` 新增 js file
3. 在 `api/` 新增 api 的 js file
4. 若需驗證權限，利用 `utilities/jwt.js` 的 `verifyJwtToken()` 驗證 jwt token
5. 利用 `res.json` 回傳資料
# 後端如何新增要 route 的頁面
1. 到 `page/main.js` 新增 route path
2. 若需驗證權限，利用 `utilities/jwt.js` 的 `verifyJwtToken()` 驗證 jwt token
3. 參考 `page/main.js` 裡面的 function 去使用 `res.sendFile()`

# 前端如何呼叫後端 API
1. 在 `templates/xxx.html` 去 ref 對應的 `templates/js/xxx.js`
2. 在 `templates/xxx.html` ref axios cdn（參考 `templates/ManagerTextedit.html`）
3. 在 `templates/js/xxx.js` 利用 axios 去 call API（參考 `templates/js/ManagerTextedit.js` 的 `getChinesename()`）
