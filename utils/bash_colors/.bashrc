source /usr/local/etc/bash_completion.d/password-store
#export CLICOLOR=cons25
#ls --color=always

#export GREP_OPTIONS='--color=auto --color=always'
#export LS_COLORS='rs=0:di=01;34:ln=01;36:mh=00:pi=40;33'

#PS1='\e[33;1m\u@\h: \e[31m\W\e[0m\$ '

export TERM=xterm-color
export GREP_OPTIONS='--color=auto' GREP_COLOR='1;32'
export CLICOLOR=1
export LSCOLORS=ExFxCxDxBxegedabagacad

source ~/.colordefs
source ~/.colordefs_example

gd() { git diff $* | view -; }
gdc() { gd --cached $*; }

source "`brew --prefix grc`/etc/grc.bashrc"

source ~/.bash_aliases
