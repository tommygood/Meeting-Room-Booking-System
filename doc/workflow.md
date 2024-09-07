# Workflow
![image](https://github.com/user-attachments/assets/53fbee9a-5e92-4651-a6e5-495cbc8e589e)

## Settings
- image registry
  - It's currently restored in <a href='https://hub.docker.com/repository/docker/tommygood/ncu-mrbs/'>my docker hub account</a>.
  - Update the `DOCKER_PASSWORD`, `DOCKER_USERNAME`, `IMAGE_NAME`, `REGISTRY` in <a href='https://github.com/tommygood/Meeting-Room-Booking-System/settings/secrets/actions'>secrets & variables</a>.
- deploy container on which host
    - It's temporarily deploy on 163.22.17.184. 
    - Update the `SSH_USER`, `SSH_PORT`, `SSH_PRIVATE_KEY` and `WORK_DIR` in <a href='https://github.com/tommygood/Meeting-Room-Booking-System/settings/secrets/actions'>secrets</a> when switch to new host.
    - Make sure new host have a <a href='https://github.com/tommygood/Meeting-Room-Booking-System/tree/main/src/docker-compose.yml'>docker-compose.yml</a> at `WORK_DIR`, and add the host public key in `~/.ssh/authorized_keys` to make others can ssh login the new host via host private key.
