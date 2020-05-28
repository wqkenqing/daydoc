
安装：

sudo apt-get install vnc4server xfce4


vncserver -geometry 1280x800 -alwaysshared :1


 vncserver -kill :1


 #!/bin/sh

# Uncomment the following two lines for normal desktop:
#unset SESSION_MANAGER
#exec /etc/X11/xinit/xinitrc

#[ -x /etc/vnc/xstartup ] && exec /etc/vnc/xstartup
#[ -r $HOME/.Xresources ] && xrdb $HOME/.Xresources
#xsetroot -solid grey
#vncconfig -iconic &
#x-terminal-emulator -geometry 80x24+10+10 -ls -title "$VNCDESKTOP Desktop" &
#x-window-manager &
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
[ -x /etc/vnc/xstartup ] && exec /etc/vnc/xstartup
[ -r $HOME/.Xresources ] && xrdb $HOME/.Xresources
vncconfig -iconic &
-session &


 sudo x11vnc -display :2 -auth ~/.vnc/passwd -forever -bg -o /var/log/x11vnc.log -rfbauth /etc/x11vnc.pass -shared -noxdamage -xrandr "resize" -rfbport 5900

 sudo x11vnc -forever -bg -usepw -cursor arrow -display :2
