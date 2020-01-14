#---------------------------------------------------------------------------------------
#   startapi.sh
#
#   Jan 14 2020   Initial
#---------------------------------------------------------------------------------------
#   Some parameters here:
#---------------------------------------------------------------------------------------
#   Running under cygwin ?
#---------------------------------------------------------------------------------------
version=startapi.sh 1.00, Jan 14 2020
pm2loc=/drives/c/Users/ytoubhan/AppData/Roaming/npm
nodeloc=/drives/d/TOOLS/nodejs
srcloc=/drives/d/ALL/LAB/git/cams-bootstrap4/src/

if [ ! -z $OSTYPE ]
then
    if [ $OSTYPE == "cygwin" ]
    then
        alias clear='cmd /c cls'
    fi
fi
if [ -z $1 ]
then
    nodename=$COMPUTERNAME
else
    nodename=$1
fi
echo "Starting webdev server on $nodename"
export PATH=$nodeloc:$PATH
cd $srcloc
$pm2loc/pm2 start server.js --watch
$pm2loc/pm2 list

