sudo /usr/bin/x11vnc -display :0 -auth /var/run/lightdm/root/:0 -forever -rfbauth /etc/x11vnc.pass -rfbport 5900

  sudo x11vnc  -forever -shared -rfbauth /etc/x11vnc.pass


x11vnc -forever -shared -rfbauth ~/.vnc/passwd



sudo /usr/bin/x11vnc -display :1 -auth /var/run/lightdm/root/:0 -forever -bg -o /var/log/x11vnc.log -rfbauth /etc/x11vnc.pass -rfbport 5900

sudo cp ~/.vnc/passwd /etc/x11vnc.pass
