#!/bin/bash

source "set_env.sh"

run_mpv() {
    mpv --config-dir="$MPV_DIR" --force-window --idle $2
    exit
}

dir=$1

if [ "$dir" = "video" ]; then
    MPV_DIR="$CD_VIDEO"
    run_mpv
elif [ "$dir" = "stream" ]; then
    MPV_DIR="$CD_STREAM"
    run_mpv
elif [ "$dir" = "music" ]; then
    MPV_DIR="$CD_MUSIC"
    run_mpv
elif [ "$dir" = "manga" ]; then
    MPV_DIR="$CD_MANGA"
    run_mpv
elif [ "$dir" = "edit" ]; then
    MPV_DIR="$CD_EDIT"
    run_mpv
else
    echo "Invalid dir"
    exit 1
fi

exit