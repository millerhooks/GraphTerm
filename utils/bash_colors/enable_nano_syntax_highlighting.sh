#!/bin/bash
find /usr/local/Cellar/nano/2.8.1/share/nano/ -iname "*.nanorc" -exec echo include {} \; >> ~/.nanorc