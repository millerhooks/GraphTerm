#!/bin/bash
LINE="cd $PWD"
PROFILE=~/.bashrc
PD_FILE=~/.project_dir
SETUP=$(cat << EOF
alias md="$PWD/utils/mdir.sh" \n
alias mdg="md go" \n
if [[ -f $PD_FILE ]]; then \n
    source $PD_FILE \n
fi \n
EOF
)

if [[ "$1" = "setup" ]]; then
	grep $PROFILE $SETUP||echo -e $SETUP >> $PROFILE
	cat $PROFILE
fi

if [[ "$1" = "set" ]]; then
    echo "Setting Project Dir"
	echo $LINE > $PD_FILE
        chmod +x $PD_FILE
    cat "$PD_FILE"
fi

if [[ "$1" = "rm" ]]; then
	rm $PD_FILE
	echo "unset project dir"
fi

if [[ -z "$1" || "$1" = "--help" || "$1" = '-h' ]]; then

cat << EOF
mdir.sh - Mark Directory. Set a new default home.
usage: mdir.sh [ setup | set | rm ]

Report bugs to:
miller@nicehou.se
EOF

fi
