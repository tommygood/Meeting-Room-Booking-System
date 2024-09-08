# Workflow
## 概念
- 目前送一個 pr 到 main branch 會觸發以下的 workflow
  1. execute test script.
  2. build an image and push to docker hub.
  3. deploy image on ncu vm.
![image](https://github.com/user-attachments/assets/53fbee9a-5e92-4651-a6e5-495cbc8e589e)

## 種類
1. <a href='https://github.com/tommygood/Meeting-Room-Booking-System/blob/update_api/.github/workflows/no_vpn_pipeline.yaml'>有 ssh vpn 的版本</a>：因為 ncu vm 有設白名單 ip，現在用這個。
2. <a href='https://github.com/tommygood/Meeting-Room-Booking-System/blob/update_api/.github/workflows/no_vpn_pipeline.yaml'>沒有 ssh vpn 的版本</a>：可從任意 ip 直接連上該 vm
## Settings
- image registry
  - It's currently restored in <a href='https://hub.docker.com/repository/docker/tommygood/ncu-mrbs/'>my docker hub account</a>.
  - Update the `DOCKER_PASSWORD`, `DOCKER_USERNAME`, `IMAGE_NAME`, `REGISTRY` in <a href='https://github.com/tommygood/Meeting-Room-Booking-System/settings/secrets/actions'>secrets & variables</a> when the location of image registry is needed to change.
- deploy container on which host
    - It's temporarily deploy on 140.115.197.23. 
    - Update the `SSH_USER`, `SSH_PORT`, `SSH_PRIVATE_KEY` and `WORK_DIR` in <a href='https://github.com/tommygood/Meeting-Room-Booking-System/settings/secrets/actions'>secrets</a> when switch to new host.
    - Make sure new host have a <a href='https://github.com/tommygood/Meeting-Room-Booking-System/tree/main/src/docker-compose.yml'>docker-compose.yml</a> at `WORK_DIR`, and add the host public key in `~/.ssh/authorized_keys` to make others can ssh login the new host via host private key.
