#!/bin/bash
LINE='script -t 0 >(while read;do date;echo "[CLI]$REPLY";done >>session.log)'
PROFILE=~/.bash_profile
REC_FILE=~/.screen_record
SETUP="if [[ -f $REC_FILE ]]; then\n bash $REC_FILE \nfi"

if [[ "$1" = "setup" ]]; then
	grep $SETUP $PROFILE||echo -e $SETUP >> ~/.bash_profile
	cat $PROFILE
fi

if [[ "$1" = "start" ]]; then
    echo "Starting Session Recording to file './session.log'"

    if [[ -f $REC_FILE ]]; then
        rm $REC_FILE
	fi
	echo $LINE > $REC_FILE
        chmod +x $REC_FILE
    cat $REC_FILE
fi

if [[ "$1" = "stop" ]]; then
	rm $REC_FILE
	echo "Stopped Session Recording"
fi

if [[ -z "$1" || "$1" = "--help" || "$1" = '-h' ]]; then

cat << EOF
usage: record_session.sh [ setup | start | stop ]

Report bugs to:
miller@nicehou.se
EOF

fi
