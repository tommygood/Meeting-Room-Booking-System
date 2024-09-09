# pages

介紹各頁面之使用功能

## 使用者首頁(userlobby)
- `parseJwt (token)`：藉由cookie抓取該User的identifier

- 會議月曆：點選事件後顯示該事件的詳細資訊

- 我的會議：`handleDatesSet()`顯示使用者所發起的會議，點選可選擇編輯或刪除會議
- 會議申請：`reservationPost()`申請人、申請單位、信箱由系統從portal抓取，剩下由使用者自行填寫，在以下狀況申請不會送出
    - 有欄位為空格

    - 未勾選「我已詳閱會議室使用規則」

    - 開始時間晚於結束時間

    - 預約時間為現在以前的時間

    - 預約日期超出三個月後(管理員不受此限)

    - 預約時間已有會議存在

- 使用者/管理者按鈕：`getPrivilege()`抓取使用者的管理權限，若為「管理員」則顯示按鈕，點選跳轉至管理者頁面

## 管理者頁面

### 權限管理(ManagerPrivilege)
- 點選表格上方欄位標題可進行自動排序(user.status若為-1則不會顯示)

- 權限修改：可以修改用戶的權限與狀態，也可刪除該用戶

```
管理權限(privilege_level)： true = 管理者  false = 一般使用者

管理狀態(status)：   '1' = 有效  '0' = 無效  '-1' = 刪除 
```

- 新增違規：選擇該使用者距今三個月內所預約的會議，新增原因跟備註後上傳
    
    - 違規原因選項：

        - 未關閉設備

        - 未復原場地

        - 超時使用會議室

        - 預約後未使用場地
        
        - 其他

- 查詢違規：顯示該使用者的所有違規

---

### 會議管理(ManagerConference)
- 點選會議可進行

    - 編輯會議：可調整該事件的會議名稱、分機號碼、會議時間 ( 若調整的時間已有會議存在，則無法進行編輯 )

    - 刪除會議
---
### 看板管理(ManagerBoard)
- 顯示七天內的看板表格

---
### 使用規則(ManagerTextedit)
---
### 登入紀錄(ManagerLog)
- 顯示所有使用者的操作紀錄、包含使用者的名字、單位、IP、操作內容、操作時間