x11vnc.service



cat /lib/systemd/system/x11vnc.service

[Unit]
Description=Start x11vnc at startup.
After=multi-user.target

[Service]
User=kenwang
Type=simple
ExecStart=/usr/bin/x11vnc -forever -loop -noxdamage -repeat -rfbauth /home/kenwang/.vnc/passwd -rfbport 5900 -shared
[Install]
WantedBy=multi-user.target
