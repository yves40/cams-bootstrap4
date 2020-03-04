#!/bin/bash
export LOG=/tmp/mongoport.log

VERSION="admin.sh v 1.10, "
VERSIONDATE="Mar 04 2020 "
LOG="/home/node/iptablesboot.log"
#--------------------------------------------------------------------------------
# Logger
#--------------------------------------------------------------------------------
log()
{
        echo "`date '+%Y-%m-%d %H:%M:%S'` : $VERSION $1" >> $LOG
        echo "`date '+%Y-%m-%d %H:%M:%S'` : $1"
}
#--------------------------------------------------------------------------------
# Executed once @ boot
#--------------------------------------------------------------------------------
case $1 in
 'start')
	# mongodb server accessible from remote client. dangerous ;-)
  log "Opening port 27017 for mongodb."
	iptables  -A INPUT -p tcp -m tcp --dport 27017 -j ACCEPT
	echo `iptables -L | grep 27017` 
	log "Open port 8088 for the webdev server"
	# webpack server
	ufw allow 8088/tcp
	log "Open port 8081 for the express server" 
	# express server
 	ufw allow 8081/tcp
	 ufw reload
	exit 0 
  ;;
 'stop')
  	log "`date` : Non sense." 
	exit 0 
  ;;
 *)
  	log "Parameter pleease: start/stop."
	exit 0 
  ;;
esac
