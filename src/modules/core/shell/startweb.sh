#---------------------------------------------------------------------------------------
#   startweb.sh
#
#   Jan 14 2020   Initial
#---------------------------------------------------------------------------------------
#   Some parameters here:
#---------------------------------------------------------------------------------------
#   Running under cygwin ?
#---------------------------------------------------------------------------------------
version=startweb.sh 1.01, Jan 14 2020
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
if [ $nodename == 'ASUSP4']
then
    export MONGOSERVER=192.168.47.111
else
    export MONGOSERVER=192.168.47.24
fi
export PATH=$nodeloc:$PATH
echo "$version : Start web interface"
npm run dev

