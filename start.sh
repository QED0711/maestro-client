docker run --rm -t -d \
-p 3000:3000 \
-e REACT_APP_SERVER_HOST=192.168.1.217 \
-e REACT_APP_SERVER_PORT=5000 \
maestro_ui:latest