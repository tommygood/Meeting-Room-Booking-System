# API 說明
- all API of this system are RESTful API.
- 下方會介紹所有 API，以及如何使用 python 存取（需先設定 cookies）

    ```
    >>> import requests
    >>> cookies = {'token' : '<token>'}
    ```
## 介紹
- GET `/api/login/sso`
    - 串接 NCU OAuth，並將 OAuth 回傳的 identifier 用 jwt sign 後放到 user cookie

- GET `/api/info/chinesename`
    - 驗證 cookie，並回傳 user 的中文名字
    ```
    >>> r = requests.get('http://localhost:3000/api/info/chinesename', cookies=cookies)
    >>> r.text
    '{"data":"王冠權"}'
    ```

- GET `/api/log?offset=<offset>&num=<record_num>`
    - get log by offset and records number
    ```=
    >>> r = requests.get('http://localhost:3000/api/log?offset=0&num=2', cookies=cookies)
    >>> r.text
    '{"data":[{"log_id":2,"identifier":"admin","datetime":"2024-09-04T02:16:21.000Z","IP":"127.0.0.1","operation_id":0},{"log_id":3,"identifier":"admin","datetime":"2024-09-04T02:17:53.000Z","IP":"127.0.0.1","operation_id":0}]}'
    ```

- POST `/api/reservation`
    - insert a reservation record into db
    ```
    >>> data = {'room_id' : 1, 'name' : '測試預約1', 'start_time' : '2024-09-04 15:30:00', 'end_time' : '2024-09-08 16:30:00', 'show' : True, 'ext' : '0912345678'}
    >>> r = requests.post('http://localhost:3000/api/reservation', cookies=cookies, json=data)
    >>> r.text
    '{"suc":true}'
    ```

- GET `/api/reservation?start_time=<start_time>&end_time=<end_time>`
    - get reservaions which are between `start_time` and `end_time`
    ```
    >>> r = requests.get('http://localhost:3000/api/reservation?start_time=2024-09-03&end_time=2024-09-04', cookies=cookies)
    >>> r.text
    ```
    
- GET `/api/reservation/show`
    - get reservations which `show` are true
    ```
    >>> r = requests.get('http://localhost:3000/api/reservation/show', cookies=cookies)
    >>> r.text
    '{"data":{"reserve_id":1,"identifier":"admin","room_id":1,"name":"測試預約1","start_time":"2024-09-04T07:30:00.000Z","end_time":"2024-09-08T08:30:00.000Z","show":1,"ext":"0912345678"}}'
    ```

- PUT `/api/reservation`
    - update reservation by `reserve_id`
    - if the privilege level of user is greater than 1, then update all reservation records is allowed
    - otherwise it would be only can update the own reservation.
    ```
    >>> data = {'reserve_id' : 121, 'room_id' : 1, 'name' : '會議', 'start_time' : '2020-06-01 08:00:00', 'end_time' : '2020-06-01 12:00:00', 'show' : 1, 'ext' : '0922222123'}
    >>> r = requests.put('http://localhost:3000/api/reservation', cookies=cookies, json=data)
    >>> r.text
    '{"suc":true}'
    ```

- DELETE `/api/reservation`
    - delete reservation by `reserve_id`
    ```
    >>> data = {'reserve_id' : 1}
    >>> r = requests.delete('http://localhost:3000/api/reservation', cookies=cookies, json=data)
    >>> r.text
    '{"suc":true}'
    ```

- POST `/api/room`
    - insert a room by name & status
    ```
    >>> data = {'name' : '會議室1', 'status' : True}
    >>> r = requests.post('http://localhost:3000/api/room', json=data, cookies=cookies)
    >>> r.text
    '{"suc":true}'
    ```

- GET `/api/room`
    - get all rooms info
    ```
    >>> r = requests.get('http://localhost:3000/api/room', cookies=cookies)
    >>> r.text
    '{"data":{"room_id":1,"room_name":"會議室1","room_status":1}}'
    ```

- GET `/api/user`
    - get all users info and violation record count
    ```
    >>> r = requests.get('http://localhost:3000/api/user', cookies=cookies)
    >>> r.text
    >>> r.text
    '{"data":[{"identifier":"113423005","chinesename":"王冠權","email":null,"mobilePhone":null,"unit":null,"status":null,"privilege_level":null,"violation_count":0},{"identifier":"admin","chinesename":"管理員","email":"tommy50508@gmail.com","mobilePhone":"0912345678","unit":"NCU-IM","status":1,"privilege_level":5,"violation_count":0}]}'
    ```

- GET `/api/user/privilege`
    - get user privilege
    ```
    >>> r = requests.get('http://localhost:3000/api/user/privilege', cookies=cookies)
    >>> r.text
    '{"data":1}'
    ```

- PUT `/api/user/privilege`
    - update user privilege level by identifier
    ```
    >>> data = {'identifier' : 'admin', 'privileges' : 5}
    >>> r = requests.put('http://localhost:3000/api/user/privilege', cookies=cookies, json=data)
    >>> r.text
    '{"suc":true}'
    ```

- PUT `/api/user/status`
  - update user status by identifier
  ```
  >>> data = {'identifier' : 'admin', 'status' : 2}
  >>> r = requests.put('http://localhost:3000/api/user/status', cookies=cookies, json=data)
  >>> r.text
  '{"suc":true}'
  ```

- POST `/api/violation`
    - insert a violation record by reservation id
    ```
    >>> data = {'reserve_id' : 1, 'reason' : 'test', 'remark' : 'test'}
    >>> r = requests.post('http://localhost:3000/api/violation', cookies=cookies, json=data)
    >>> r.text
    '{"suc":true}'
    ```

- GET `/api/violation`
    - get all violation records
    ```
    >>> r = requests.get('http://localhost:3000/api/violation', cookies=cookies)
    >>> r.text
    '{"data":[{"violation_id":1,"identifier":"admin","datetime":"2024-09-04T15:07:44.000Z","reason":"test","remark":"badbad"}]}'
    ```

- DELETE `/api/violation`
    - delete violation by `violation_id`
    ```
    >>> data = {'violation_id' : 1}
    >>> r = requests.delete('http://localhost:3000/api/violation', cookies=cookies, json=data)
    >>> r.text
    '{"suc":true}'
    ```